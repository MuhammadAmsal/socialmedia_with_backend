import express from "express"
import User from "../Model/userSchema.js"
import bcrypt from "bcrypt"
 
const authRoutes = express.Router()

authRoutes.post('/register',async(req,res)=>{
 
 try{
   // Generate new password
   const salt= await bcrypt.genSalt(10);
   const hashedPassword=  await bcrypt.hash(req.body.password, salt)

// create new user
   const newUser= new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
   })

// Save User and return response
   const user= await newUser.save();
    res.status(200).json(user);


 } catch (err){
   res.status(500).json(err);
 }
})

//login
authRoutes.post('/login', async (req,res)=>{
try{

const user=await User.findOne({email:req.body.email});
!user && res.status(404).json("user not found")

const validPassword= await bcrypt.compare(req.body.password , user.password);
!validPassword && res.status(404).json("wrong password")

res.status(200).json(user)

} catch(err){
//  res.status(404).json(err);
console.log(err)
}


})

export default authRoutes