const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

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

app.post('/api/posts', (req, res, next) => {
    // const post = req.body;
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    console.log(post);
    res.status(201).json({
        message: 'Post added successfully'
    });
});
// app.get()

app.get('/api/posts', (req, res, next) => {
    const posts = [
        {
            id: '123445',
            title: 'First server post',
            content: 'This comes from the server'
        },
        {
            id: '1234456',
            title: 'Second server post',
            content: 'This comes from the server,too'
        }
    ];
    // return
    res.status(200).json({
        message: 'Posts send successfully', 
        posts: posts
    });
;})

module.exports = app;