const express = require('express');
const {User} = require('./model/model');
const {connectDB} = require('./config/database');
const app = express();
const PORT = 3000;
app.use(express.json());


app.use('/getUser',async (req,res)=>{
    try {
        const user = await User.find({})
        res.status(200).send({message:"User Fetched Successfully",data:user})
    } catch (error) {
        res.status(400).send({message: "Failed to fetch user", error: error.message})
    }
})

app.use('/addUser',async (req,res)=>{
    try {
        const data = req.body
        const user = await User(data)
        await user.save()
        res.status(200).send({message:"User Added Successfully",data:user})
    } catch (error) {
        res.status(400).send({message: "Failed to add user", error: error.message})
    }
})

app.use('/editUser/:id',async (req,res)=>{
    try {
        const {id} = req.params
        const data = req.body
        const user = await User.findByIdAndUpdate(id,data,{new:true,runValidators:true})
        res.status(200).send({message: "User updated successfully",data: user})
    } catch (error) {
         res.status(400).send({message: "Failed to update user", error: error.message});
    }
})

app.use('/deleteUser/:id',async (req,res)=>{
    try {
        const {id} = req.params
        const user = await User.findByIdAndDelete(id)
         res.status(200).send({message: "User deleted successfully",data: user})
    } catch (error) {
         res.status(400).send({message: "Failed to delete user", error: error.message});
    }
})


connectDB().then(()=>{
    console.log("Database connected");
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
}).catch((err)=>{
    console.log("Database connection failed", err);
})