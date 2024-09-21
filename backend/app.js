const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");

// const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb://readwrite:123456@localhost:27017/meancourse?retryWrites=true")
    .then(() => {
        console.log('Connected to database')
    })
    .catch(() => {
        console.log("Connection to database failed")
    })

// needs body-parser package
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// handles CORS error
// Control witch methods may be send
app.use((req, res, next)  => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With,Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE, PUT, OPTIONS');
    next();
});

//Achtung: Wenn in der Angular APP Routing verwende dann dürfen sich die Namen der Routings, zum Beispiel /api/posts nicht mit denen in der App überschneiden!
// app.post('/api/posts', (req, res, next) => {
//     // const post = req.body;
//     const post = new Post({
//         title: req.body.title,
//         content: req.body.content
//     });
//     post.save().then(createdPost => {
//         // console.log(createdPost);
//         res.status(201).json({
//             message: 'Post added successfully',
//             postId: createdPost._id
//         });
//     });
//     console.log(post);
// });
// // app.get()



// app.put('/api/posts/:id', (req, res, next) => {
//     const post = new Post({
//         _id : req.body.id,
//         title: req.body.title,
//         content: req.body.content
//     });
//     Post.updateOne({_id: req.params.id}, post).then(result => {
//         // console.log(result);
//         res.status(200).json({message: 'Post has been updated.'});
//     });
// });

// app.get('/api/posts/:id', (req, res, next) => {
//     const postId = req.params.id;
//     Post.findById(postId)
//         .then(post => {
//             if(post) {
//                 res.status(200).json({
//                     message: 'Post updated successfully',
//                     post: post
//                 });
//                 console.log(post);
//             }
//             else{
//                 res.status(404).json({
//                     message: 'Post not found'
//                 });
//             }
//         });
// });

// app.get('/api/posts', (req, res, next) => {
//     // Post.find((err, documents) =>{};
//     Post.find()
//         .then(documents => {
//             // console.log(documents);
//             //unbedingt im Then-Block, da asynchroner call und der sonst ggf. noch nicht fertig ist.
//             res.status(200).json({
//                 message: 'Posts send successfully', 
//                 posts: documents
//             });
//         });
//         // .catch()

//     // const posts = [
//     //     {
//     //         id: '123445',
//     //         title: 'First server post',
//     //         content: 'This comes from the server'
//     //     },
//     //     {
//     //         id: '1234456',
//     //         title: 'Second server post',
//     //         content: 'This comes from the server,too'
//     //     }
//     // ];
//     // return
//     // res.status(200).json({
//     //     message: 'Posts send successfully', 
//     //     posts: posts
//     // });
// ;})

// app.get("/api/posts/:id", (req, res, next) => {
//     Post.findById(req.params.id).then(post => {
//         if (post){
//             res.status(200).json(post);
//         }
//         else{
//             res.status(404).json({message: 'Post not found!'});
//         }
//     })
// });

// app.delete('/api/posts/:id', (req, res, next) => {
//     const id = req.params.id;
//     Post.deleteOne({_id: id})
//         .then(result => {
//             console.log(result);
//         });
//     // console.log(id);
//     res.status(200).json({
//         // message: 'Post ' +  id + ' has been deleted'
//         message: 'Post has been deleted'
//     });
//     // Post.delete()
// });

// es wird nach Pfad gefiltert, und alles was dem Pfad entspricht, wird an postRoutes weitergeleitet.
app.use("/api/posts", postsRoutes);

module.exports = app;