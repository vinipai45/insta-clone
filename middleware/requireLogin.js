const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const { User } = require("../models/user");

const auth = function (req, res, next) {
    try {
        const { authorization } = req.headers
        if (!authorization) {
            return res.status(401).json({ error: "Access Denied" })
        }
        jwt.verify(authorization, JWT_SECRET, (err, payload) => {
            if (err) {
                return res.status(401).json({ error: "Access Denied" })
            }
            const { _id } = payload
            User.findById(_id).then(userdata => {
                req.user = userdata;
                next();
            }).catch((err => console.error(err)))
        })

    }
    catch (err) {
        console.error("Error", err)
    }
}

module.exports = auth