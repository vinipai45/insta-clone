const express = require("express");
const mongoose = require("mongoose");
const { MONGOURL } = require("./config/keys");
const user = require("./routes/auth")
const post = require('./routes/post')
const userprofile = require('./routes/user')
const app = express();

const PORT = process.env.PORT || 5000;

mongoose.connect(MONGOURL, { useNewUrlParser: true, useNewUrlParser: true, useUnifiedTopology: true, })
  .then(() => console.log("Connected to MongoDb"))
  .catch((err) => console.error(err))

app.use(express.json())
app.use('/', user)
app.use('/', post)
app.use('/', userprofile)

if (process.env.NODE_ENV == "production") {
  app.use(express.static('client/build'))
  const path = require('path')
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
