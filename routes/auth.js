const express = require('express')
const router = express.Router()
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const { User, validate } = require("../models/user");
const { JWT_SECRET } = require("../config/keys");

function validateLogin(req) {
    const schema = {
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(req, schema);
}

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


        await user.save()
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


module.exports = router