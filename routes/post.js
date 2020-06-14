const express = require('express')
const router = express.Router()
const _ = require('lodash')
const { Post, validate } = require("../models/post");
const auth = require('../middleware/requireLogin')

router.get('/api/allposts', auth, async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("postedBy", "_id name pic")
            .populate("comments.commentedBy", "_id name")
            .sort("-createdAt")
        res.json({ posts })
    } catch (err) {
        console.error("Error", err);
    }

})

router.get('/api/myfollowposts', auth, async (req, res) => {
    try {
        const posts = await Post.find({ postedBy: { $in: req.user.following } })
            .populate("postedBy", "_id name pic")
            .populate("comments.commentedBy", "_id name")
            .sort("createdAt")
        res.json({ posts })
    } catch (err) {
        console.error("Error", err);
    }

})

router.post('/api/createpost', auth, async (req, res) => {
    try {
        const { title, body, pic } = req.body
        if (!title || !body || !pic) {
            return res.status(422).json({ error: "Please enter all the fields" })
        }

        const { error } = validate(req.body)
        if (error) return res.status(400).json({ errror: error.details[0] });


        const post = new Post({
            title,
            body,
            pic,
            postedBy: req.user
        })
        req.user.password = undefined;
        console.log(post)
        const result = await post.save()

        res.json({ post: result })


    }
    catch (err) {
        console.error(err);
    }
})

router.get('/api/myposts', auth, async (req, res) => {
    try {
        const myposts = await Post.find({ postedBy: req.user._id }).populate("postedBy", "_id name pic")
        res.json({ myposts })
    } catch (err) {
        console.error("Error", err);
    }

})

router.put('/api/like', auth, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(req.body.postId, {
            $push: { likes: req.user._id }
        }, {
            new: true
        })
            .populate("comments.commentedBy", "_id name")
            .populate("postedBy", "_id name pic")
        return res.json(result);

    } catch (err) {
        console.error("Error", err);
    }
})

router.put('/api/unlike', auth, async function (req, res) {
    try {
        const result = await Post.findByIdAndUpdate(req.body.postId, {
            $pull: { likes: req.user._id }
        }, {
            new: true
        })
            .populate("comments.commentedBy", "_id name")
            .populate("postedBy", "_id name pic")
        return res.json(result);
    } catch (err) {
        console.error("Error", err);
    }
});

router.put('/api/comment', auth, async (req, res) => {
    try {
        const comment = {
            text: req.body.text,
            commentedBy: req.user._id
        }
        const result = await Post.findByIdAndUpdate(req.body.postId, {
            $push: { comments: comment }
        }, {
            new: true
        })
            .populate("comments.commentedBy", "_id name")
            .populate("postedBy", "_id name pic")
        return res.json(result)
    } catch (err) {
        console.error("Error", err);

    }
})

router.delete('/api/deletepost/:postId', auth, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.postId })
            .populate("postedBy", "_id name pic")
        if (!post) {
            return res.status(422).json({ error: "Post not found" })
        }
        if (post.postedBy._id.toString() === req.user._id.toString()) {
            const result = await post.remove()
            return res.json(result)
        }
    } catch (err) {
        console.error("Error", err);

    }

})

router.delete('/api/deletecomment/:postId/:commentId', auth, async (req, res) => {
    try {
        // console.log(req.params.postId);
        // console.log(req.params.commentId);
        let post = await Post.findOne({ _id: req.params.postId })
            .populate("comments.commentedBy", "_id name")
            .populate("postedBy", "_id name pic")
        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }
        post.comments = await post.comments.filter(comment => {
            return comment._id != req.params.commentId
        })

        const result = await post.save()
        return res.json(result)

    } catch (err) {
        console.error("Error", err);

    }

})


module.exports = router
