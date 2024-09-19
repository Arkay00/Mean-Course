const express = require("express");

const Post = require('../models/post');

const router = express.Router();


router.post('');

router.post('', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added successfully',
            postId: createdPost._id
        });
    });
    console.log(post);
});



router.put('/:id', (req, res, next) => {
    const post = new Post({
        _id : req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post).then(result => {
        res.status(200).json({message: 'Post has been updated.'});
    });
});

router.get('/:id', (req, res, next) => {
    const postId = req.params.id;
    Post.findById(postId)
        .then(post => {
            if(post) {
                res.status(200).json({
                    message: 'Post updated successfully',
                    post: post
                });
                console.log(post);
            }
            else{
                res.status(404).json({
                    message: 'Post not found'
                });
            }
        });
});

router.get('', (req, res, next) => {
    Post.find()
        .then(documents => {
            //unbedingt im Then-Block, da asynchroner call und der sonst ggf. noch nicht fertig ist.
            res.status(200).json({
                message: 'Posts send successfully', 
                posts: documents
            });
        });
;})

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post){
            res.status(200).json(post);
        }
        else{
            res.status(404).json({message: 'Post not found!'});
        }
    })
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Post.deleteOne({_id: id})
        .then(result => {
            console.log(result);
        });
    res.status(200).json({
        message: 'Post has been deleted'
    });
});

module.exports = router;