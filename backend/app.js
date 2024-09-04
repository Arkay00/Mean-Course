const express = require('express');

const app = express();

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