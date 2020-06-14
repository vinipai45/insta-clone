const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(5).required(),
        pic: Joi.string()
    }
    return Joi.validate(user, schema)
}

const userSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        required: true,
        ensureIndex: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    pic: {
        type: String,
        default: "https://res.cloudinary.com/vinipai45/image/upload/v1591981247/default-avatar_oefekd.png"
    },
    resetToken: String,
    expireToken: Date,

    confirmed: {
        type: Boolean,
        default: false
    },
    confirmToken: String,
    expireConfirmToken: Date,

    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }]
})

const User = new mongoose.model('User', userSchema)

exports.User = User
exports.validate = validateUser


