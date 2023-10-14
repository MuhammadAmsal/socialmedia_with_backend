import express from "express";
import bcrypt from "bcrypt";
import User from "../Model/userSchema.js";
 

const usersRoutes = express.Router();

// Update User
//put : localhost:8000/api/users/id

usersRoutes.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      res.status(200).json("Account Has Been Updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("you can update only your account");
  }
});

// Delete User
//delete : localhost:8000/api/users/id

usersRoutes.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);

      res.status(200).json("Your Account Has Been Deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("you can delete only your account");
  }
});

// get a user
//get : localhost:8000/api/users/id

usersRoutes.get("/", async (req, res) => {
  const userId=req.query.userId
  const username=req.query.username

  try {
    const user = userId ? await User.findById(userId): await User.findOne({username:username});
    const { password, updatedAt , ...other}= user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
  
});

// follow a user
// put : localhost:8000/api/users/id/follow

usersRoutes.put("/:id/follow", async (req, res) => {
 
if(req.body.userId !== req.params.id){ //1 if else condition start

try{
const user= await User.findById(req.params.id);
const currentUser= await User.findById(req.body.userId);

 if(!user.followers.includes(req.body.userId)){  // 2 if else condition start
 await user.updateOne({$push:{followers:req.body.userId}});
 await currentUser.updateOne({$push:{followings:req.params.id}});
 res.status(200).json("User has been followed")
}else{
  res.status(403).json("You already follow this user")
} // 2 if else condition end 


} catch(err){
  res.status(500).json(err)
}

} else{
  res.status().json("You can't follow yourself ")
} // 1 if else condition end end
 
})

// unfollow a user
usersRoutes.put("/:id/unfollow", async (req, res) => {
 
  if(req.body.userId !== req.params.id){ //1 if else condition start
  
  try{
  const user= await User.findById(req.params.id);
  const currentUser= await User.findById(req.body.userId);
  
   if(user.followers.includes(req.body.userId)){  // 2 if else condition start
   await user.updateOne({$pull:{followers:req.body.userId}});
   await currentUser.updateOne({$pull:{followings:req.params.id}});
   res.status(200).json("User has been unfollowed")
  }else{
    res.status(403).json("You dont follow this user")
  } // 2 if else condition end 
  
  
  } catch(err){
    res.status(500).json(err)
  }
  
  } else{
    res.status().json("You can't follow yourself ")
  } // 1 if else condition end end
   
  })
  

export default usersRoutes;
