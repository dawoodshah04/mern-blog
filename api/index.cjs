const express = require('express')
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const { User } = require('./models/User');
const { Post } = require('./models/Post')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const multer = require('multer');
const uploadMiddleware = multer({dest:'uploads/'});
const fs = require('fs');
const app = express();
const PORT = 5000 || 8080;

const salt = bcrypt.genSaltSync(10);
const secret = '2hjvhcgj2bn54blb7l4bo5bcxysir34gioo2pf3b6o6'

app.use(cors(
{
    origin: 'http://localhost:5173',
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

  // ✅ assign new values
  postDoc.title = title;
  postDoc.summary = summary;
  postDoc.content = content;
  postDoc.cover = newPath ? newPath : postDoc.cover;

  // ✅ save the updated doc
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
