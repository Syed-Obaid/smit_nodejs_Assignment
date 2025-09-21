const jwt = require('jsonwebtoken');
const {User} = require('../model/products');

const userAuth = async (req,res,next)=>{
    try {
        const {token} = req.cookies
        if(!token){
            throw new Error('Token is not valid!')
        }
        const {id} = jwt.verify(token,"secretkey")
        const user = await User.findOne({_id:id})
        if(!user){
            throw new Error("User not found!")
        }
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({message: "User Authentication Error", error: error.message});
    }
}

module.exports = {userAuth};