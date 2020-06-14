const express = require('express')
const router = express.Router()
const { Post } = require("../models/post");
const { User } = require("../models/user");
const auth = require("../middleware/requireLogin")

router.get('/api/userprofile/:id', auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).select("-password")
        if (!user) return res.status(404).json({ error: "User Found" })
        const posts = await Post.find({ postedBy: req.params.id })
            .populate("postedBy", "_id name")
        if (!posts) return res.status(422).json({ error: "Unable to process" })
        return res.json({ user, posts })

    } catch (err) {
        console.error("Error", err);
    }
})

router.put('/api/follow', auth, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }

        }, { new: true }).select("-password").then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
    })
})

router.put('/api/unfollow', auth, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unfollowId }

        }, { new: true }).select("-password").then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
    })
})

router.put('/api/updatepic', auth, (req, res) => {
    User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: "pic cannot be posted" })
            }
            return res.json(result)
        })
})

router.post('/api/search-users', (req, res) => {
    let userPattern = new RegExp('.*' + req.body.query + '.*', 'i')
    User.find({ name: { $regex: userPattern } }).select("_id name email pic")
        .then(user => {
            return res.json({ user })
        }).catch(err => console.error("Error", err))
})

module.exports = router