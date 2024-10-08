const express = require("express");
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValid){
            error = null;
        }
        // path relative to server.ts
        cb(error, "backend/images")
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
})

router.post('');

router.post('', multer({storage: storage}).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added successfully',
            // postId: createdPost._id,
            post: {
                ...createdPost,
                id: post._id,
                // title: post.title,
                // content: post.content,
                // imagePath: post.imagePath
            }
        });
    });
    console.log(post);
});



router.put('/:id', multer({storage: storage}).single("image"), (req, res, next) => {
    // console.log(req.file);
    let imagePath = req.body.imagePath;
    if (req.file){
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id : req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    console.log(post);
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