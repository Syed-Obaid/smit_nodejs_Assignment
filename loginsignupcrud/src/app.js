const express = require('express');
const app = express();
const { User } = require('./model/products');
const {connectDB} = require('./config/database')
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());
const PORT = 3000;
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./midddlewear/user')
const { Product } = require('./model/addProducts');


app.post('/signup',async (req,res)=>{
    try {
        const {firstName, lastName, email, password} = req.body;
        if(!firstName || !lastName){
            throw new Error("Name is not valid!");
        }else if(!validator.isEmail(email)){
            throw new Error("Email is not valid!");
        } else if(!validator.isStrongPassword(password)){
            throw new Error("Password is not valid!");
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User({firstName, lastName, email, password: hashPassword});
        await user.save()
        const token = jwt.sign({id:user._id},"secretkey",{expiresIn: '1d'});
        res.cookie("token" , token)
        res.status(201).send({message: `User SignUp Successful`, user});

    } catch (error) {
          res.status(400).send({message: "User SignUp Error", error: error.message});
    }
})

app.post('/login',async (req,res)=>{
    try {
        const {email,password} = req.body
        const user = await User.findOne({email});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(isMatch){
            const token = jwt.sign({id:user._id},"secretkey",{expiresIn: '1d'});
            res.cookie("token" , token)
            res.status(200).send({message: `${user.firstName} ${user.lastName}: Login Successful`, user});
        } else {
            throw new Error("Invalid Credentials");
        }
    } catch (error) {
        res.status(400).send({message: "User Login Error", error: error.message});  
    }
})

app.get('/profiles',userAuth,async (req,res)=>{
    try {
        const user = req.user
        res.status(200).send({message: `${user.firstName} ${user.lastName}: Profile Fetched`, user});
    } catch (error) {
        res.status(500).send({message: "User Profile Fetch Error", error: error.message});
    }
})

app.post('/logout',(req,res)=>{
    res.cookie("token",null,{expires: new Date(Date.now() * 0)})
    res.status(200).send({message: `User Logout Successful`});
})

app.post('/changepassword',userAuth,async (req,res)=>{
    try {
        const user = req.user;
        const {oldPassword, newPassword} = req.body;
        if(!validator.isStrongPassword(newPassword)){
            throw new Error("New Password is not valid!");
        }
        const isMatch = await bcrypt.compare(oldPassword,user.password)
        if(!isMatch){
            throw new Error("Old Password is incorrect");
        }
        const hashPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashPassword;
        await user.save();
        res.status(200).send({message: "Password Changed Successfully"});
    } catch (error) {
        res.status(400).send({message: "Change Password Error", error: error.message});
    }
})

app.post('/forgotpassword',async (req,res)=>{
    try {
        const {email, newPassword} = req.body;
        if(!email || !newPassword){
            throw new Error("Email and New Password are required");
        }
        const user = await User.findOne({email});
        if(!user){
            throw new Error("User not found");
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();
        res.status(200).send({message: `${user.firstName} ${user.lastName}: Password Reset Successfully`});
    } catch (error) {
        res.status(400).send({message: "Forgot Password Error", error: error.message});
    }
})

app.post('/addproduct',userAuth,async (req,res)=>{
    try {
        const {name, price, description} = req.body;
        if(!name || !price || !description){
            throw new Error("All fields are required");
        }
        const product = await Product({name, price, description});
        await product.save();
        res.status(201).send({message: `${req.user.firstName} ${req.user.lastName} added product successfully`, product});
    } catch (error) {
        res.status(400).send({message: "Add Product Error", error: error.message});
    }
})

app.get('/products',userAuth,async (req,res)=>{
    try {
        const products = await Product.find({});
        res.status(200).send({message: `${req.user.firstName} ${req.user.lastName} fetched products successfully`, products});
    } catch (error) {
        res.status(400).send({message: "Fetch Products Error", error: error.message});
    }
})

app.delete('/deleteproduct/:id',userAuth,async (req,res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            throw new Error("Product not found");
        }
        res.status(200).send({message: `${req.user.firstName} ${req.user.lastName} deleted product successfully`, product});
    } catch (error) {
        res.status(400).send({message: "Delete Product Error", error: error.message});
    }
})

app.put('/updateproduct/:id',userAuth,async (req,res)=>{
    try {
        const {id} = req.params;
        const {name, price, description} = req.body;
        const product = await Product.findByIdAndUpdate(id,{ name, price, description }, { new: true, runValidators: true });
        if(!product){
            throw new Error("Product not found");
        }
        res.status(200).send({message: `${req.user.firstName} ${req.user.lastName} updated product successfully`, product});
    } catch (error) {
        res.status(400).send({message: "Update Product Error", error: error.message});
    }
})
connectDB().then(()=>{
    console.log("Database connected");
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error)=>{
    console.log("Database connection failed", error);
});








