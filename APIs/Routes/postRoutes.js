 
import express from "express"
import Post from "../Model/postSchema.js"
import User from "../Model/userSchema.js"
 
 

const postRoutes = express.Router()

 // create a post

 postRoutes.post('/',async(req,res)=>{
  const newPost= await Post(req.body);
try{
    const savedPost= await newPost.save();
    res.status(200).json(savedPost);

}catch(err){
    res.status(500).json(err)
}


 })
 // update a post

 postRoutes.put('/:id',async(req,res)=>{
 
    try{

        const post= await Post.findById(req.params.id)
        
     if(post.userId == req.body.userId){

        await Post.updateOne({$set:req.body});
        res.status(200).json("the post has been updated")

     }else{
        res.status(403).json("you can update only your post")
     }
  
  }catch(err){
      res.status(500).json(err)
  }
  
  
   })


 // delete a post
 postRoutes.delete('/:id',async(req,res)=>{
 
    try{

        const post= await Post.findById(req.params.id)
        
     if(post.userId == req.body.userId){

        await Post.deleteOne();
        res.status(200).json("the post has been deleted")

     }else{
        res.status(403).json("you can deleted only your post")
     }
  
  }catch(err){
      res.status(500).json(err)
  }
  
  
   })

// like a post

postRoutes.put("/:id/like", async (req, res) => {
   try {
     const post = await Post.findById(req.params.id);
     
     if (!post) {
       return res.status(404).json("Post not found");
     }
 
     if (!post.likes.includes(req.body.userId)) {
       await Post.updateOne({ _id: req.params.id }, { $push: { likes: req.body.userId } });
      //  const updatedPost = await Post.findById(req.params.id);
       res.status(200).json({ message: "The post has been liked" });
     } else {
       await Post.updateOne({ _id: req.params.id }, { $pull: { likes: req.body.userId } });
      //  const updatedPost = await Post.findById(req.params.id);
       res.status(200).json({ message: "The post has been disliked"});
     }
   } catch (err) {
     res.status(500).json(err);
   }
 });
 
// get a post

postRoutes.get("/:id", async(req,res)=>{
try{
const post=await Post.findById(req.params.id)

res.status(200).json(post)

}catch(err){
res.status(404).json(err)
}

})

// get timeline post

postRoutes.get("/timeline/:userId",async(req,res)=>{
   try{
const currentUser= await User.findById(req.params.userId);
const userPosts=await Post.find({userId:currentUser._id});
const friendPosts= await Promise.all(
   currentUser.followings.map((friendpost)=>{
     return Post.find({userId:friendpost})
   })
)

res.status(200).json(userPosts.concat(...friendPosts))
   } catch (err){
      res.status(500).json(err)
   }
})


// get user all post

postRoutes.get("/profile/:username",async(req,res)=>{
   try{
 const user= await User.findOne({ username:req.params.username })
 const posts= await Post.find({ userId:user._id })
 res.status(200).json(posts)
   } catch (err){
      res.status(500).json(err)
   }
})


export default postRoutes