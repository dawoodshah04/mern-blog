import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import mongoose from "mongoose";
import { User } from "./models/User.js";
import { Post } from "./models/Post.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadMiddleware = multer({ dest: "uploads/" });

const app = express();
const PORT = 5000 || 8080;

const salt = bcrypt.genSaltSync(10);
const secret = '2hjvhcgj2bn54blb7l4bo5bcxysir34gioo2pf3b6o6'


const allowedOrigins = [
  "http://localhost:5173",   // dev
  "https://mern-blog-coral.vercel.app"  // prod
];

app.use(cors(
{
    
    origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },     
    methods: ['POST','GET','PUT'],
    credentials: true
}
));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname+'/uploads'))

const dbconnection = async () =>{
await mongoose.connect('mongodb+srv://dawood:Dawood123@cluster0.vrp2lje.mongodb.net/')
}


// Register endpoint
app.post('/api/register',async (req, res)=>{
    const {username, password} = req.body;
  try {
     const UserDoc = await  User.create({
       username,
       password:bcrypt.hashSync(password, salt)
    })
    res.json(UserDoc);
  } catch (error) {
    if(error.code === 11000){
        return res.status(400).json({ error: "Username already exists" });
    }
    res.status(500).json({error:'somthing went wrong'});
  }
  console.log('User registered!')
    
});

// Login endpoint
app.post('/api/login',async (req, res)=>{
    const {username, password} = req.body;
    const UserDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, UserDoc.password);
    if(passOk){
        // user loggedIn
        jwt.sign({username, id:UserDoc._id},secret,{},(err, token)=>{
            if (err) throw err;
            res.cookie('token',token,{httpOnly:true})
            .json({ 
                id:UserDoc._id,
                username
            });
            console.log('User LoggedIn!')
        });
    }else{
        res.status(400).json('wrong credentials')
        console.log('Login Failed!')
    }
});

// Profile endpoint
app.get('/api/profile',(req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    })
});

app.post('/api/post',uploadMiddleware.single('file'),async (req, res) => {

    try{
    // changing the filename in uploads
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath)

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;

 // sending post to db
    const {title, summary, content} = req.body;
    const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id,
    })
    res.json(postDoc);
    })
    }catch(err){
        res.status(500).json({err:"Failed to fetch posts"});
    }
   

});

app.get('/api/post',async (req, res) => {
    console.log()
    res.json(
     await Post.find()
    .populate('author',['username'])
    .sort({createdAt:-1})
    .limit(20))
});

app.get('/api/post/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const postDoc = await Post.findById(id).populate('author', ['username']);

        if (!postDoc) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.json(postDoc);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch post" });
    }
});


// app.put('/api/post',uploadMiddleware.single('file'),async (req, res) => {
//     let newPath = null;
//     if(req.file){
//     const {originalname,path} = req.file;
//     const parts = originalname.split('.');
//     const ext = parts[parts.length - 1];
//     newPath = path+'.'+ext;
//     fs.renameSync(path, newPath);
//     }

//     const {token} = req.cookies;
//     jwt.verify(token, secret, {}, async (err, info) => {
//         if (err) throw err;

//  // sending post to db
//     const {id, title, summary, content} = req.body;
//     const postDoc = await Post.findById(id);
//     const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
//     console.log(isAuthor);
//     if(!isAuthor){
//         return res.status(400).json('you are not the author');
//     }
//     await postDoc.update({title, summary, content, cover:newPath ? newPath : postDoc.cover});

//     // const postDoc = await Post.create({
//     //     title,
//     //     summary,
//     //     content,
//     //     cover:newPath,
//     //     author:info.id,
//     // })
//     res.json(postDoc);
//     })

// });

app.put('/api/post',uploadMiddleware.single('file'), async (req,res) => {
  let newPath = null;
  if (req.file) {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  }

 const { token } = req.cookies;
jwt.verify(token, secret, {}, async (err, info) => {
  if (err) throw err;

  const { id, title, summary, content } = req.body;
  const postDoc = await Post.findById(id);

  const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
  if (!isAuthor) {
    return res.status(400).json('you are not the author');
  }

  postDoc.title = title;
  postDoc.summary = summary;
  postDoc.content = content;
  postDoc.cover = newPath ? newPath : postDoc.cover;

  await postDoc.save();

  res.json(postDoc);
})});




app.post('/api/logout',(req, res) => {
    
    res.cookie('token', '').json('ok');
});

dbconnection();


// module.exports = app;
// module.exports.handler = serverless(app);

app.listen(PORT, ()=>{
    console.log(`Server running on PORT: ${PORT}`)
});
