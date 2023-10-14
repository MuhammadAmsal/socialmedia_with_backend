import express from "express"
import mongoose from "mongoose"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from "dotenv"
import userRoutes from "./Routes/userRoutes.js"
import authRoutes from "./Routes/authRoutes.js"
import postRoutes from "./Routes/postRoutes.js"
import multer from "multer"
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Use this to get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 

const app=express()
dotenv.config()
const PORT=3000

const connect = () => {
    mongoose
        .connect(process.env.mongo_url)
        .then(() => {
            console.log(`connected to DB`);
        })
        .catch((err) => {
            throw err;
        });
};

app.use("/images", express.static(path.join(__dirname,"public/images")))

// middle ware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

const storage=multer.diskStorage({
    destination:( req, file, cb)=>{
        console.log(destination);
        cb(null,"public/images");
    },
    
filename: (req, file, cb) => {
    cb(null, req.body.name); // Keep the original filename
  },
});

const upload = multer({storage})
app.post("/api/upload",upload.single('file'), (req,res)=>{
    try{
     return res.status(200).json("File uploaded successfylly.")
    }catch (err){
        console.log(err)
    }
})
 

 




// app.get("/",(req,res)=>{
//     res.send("WELLCOME TO HOME PAGE")
// }

// )
// app.get("/users",(req,res)=>{
//     res.send("WELLCOME TO USERS PAGE")
// }

// )
// app.get("/friends",(req,res)=>{
//     res.send("WELLCOME TO FRIENDS PAGE")
// }

// )
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/post", postRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running now on ${PORT}`)
    connect()
})
