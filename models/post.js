const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi);

function validatePost(post) {
    const schema = {
        title: Joi.string().required(),
        body: Joi.string().required(),
        pic: Joi.string().required(),
        postedBy: Joi.objectId(),

    }
    return Joi.validate(post, schema)
}


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    pic: {
        type: String,
        required: true,
    },
    likes: [{ type: ObjectId, ref: "User" }],

    comments: [{
        text: String,
        commentedBy: { type: ObjectId, ref: "User" }
    }],

    postedBy: {
        type: ObjectId,
        ref: "User"
    }

})

const Post = mongoose.model('Post', postSchema)

exports.Post = Post
exports.validate = validatePost