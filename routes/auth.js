const express = require('express')
const router = express.Router()
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { User, validate } = require("../models/user");
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { SENDGRID_API, JWT_SECRET } = require('../config/keys')

function validateLogin(req) {
    const schema = {
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(req, schema);
}

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}))

router.post('/api/signup', async (req, res) => {
    try {
        const { email, name, password, pic } = req.body;

        if (!email || !name || !password) {
            return res.status(422).json({ error: "Please enter all the fields" })
        }

        const { error } = validate(req.body)
        if (error) return res.status(400).json({ error: error.details[0].message });

        let user = await User.findOne({ email: req.body.email })
        if (user) return res.status(400).json({ error: "User already exists" });

        user = new User(_.pick(req.body, ["name", "email", "password", "pic"]))

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt)


        user.save().then(() => {
            transporter.sendMail({
                to: user.email,
                from: "vinipai45@gmail.com",
                subject: "signup success",
                html: "<h1>welcome to instagram</h1>"
            })
        })
        return res.json({ success: "Registration Successful" })
    }
    catch (err) {
        console.error("Error", err);
    }

})

router.post('/api/signin', async (req, res) => {
    try {
        const { error } = validateLogin(req.body)
        if (error) return res.status(400).json({ error: "Invalid Username or Password" })

        let user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(400).json({ error: "Invalid Username or Password" })

        const result = await bcrypt.compare(req.body.password, user.password)
        if (!result) return res.status(400).json({ error: "Invalid Username or Password" })

        const { _id, name, email, pic, followers, following } = user
        const token = jwt.sign({ _id: user._id }, JWT_SECRET)
        if (token) {
            return res.json({ success: "Login Successful!", token, user: { _id, name, email, pic, followers, following } })
        }
        else {
            return res.json({ error: "Token generation failed" })
        }

    }
    catch (err) {
        console.error(Error, err)
    }

})

router.post('/api/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "There is no user user with this email" })
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {
                    transporter.sendMail({
                        to: user.email,
                        from: "vinipai45@gmail.com",
                        subject: "password reset",
                        html: `
                    <p>You requested for password reset</p>
                    <h5>click <a href="http://localhost:3000/api/reset/${token}">here</a> to reset password</h5>
                    `
                    })
                    return res.json({ message: "check your email" })
                })

            })
    })
})

router.post('/api/new-password', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Session Expired! try again" })
            }
            bcrypt.hash(newPassword, 12).then(hashedpassword => {
                user.password = hashedpassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then((saveduser) => {
                    res.json({ message: "Password updated!" })
                })
            })
        }).catch(err => {
            console.error("Error", err)
        })
})

module.exports = router