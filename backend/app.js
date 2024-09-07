const express = require('express');

const app = express();

// handles CORS error
// Control witch methods may be send
app.use((req, res, next)  => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With,Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, PUT, OPTIONS");
    next();
});

app.use('/api/posts', (req, res, next) => {
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