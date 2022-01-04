require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

console.log(process.env.SECRET);

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

let newUser= new User({
    email: "ppoy@gmal",
    password: "eppeoop"
})

// newUser.save();

app.get("/", function(req, res) {


    res.render("home");
})

app.get("/login", function(req, res) {


    res.render("login");
})

app.get("/register", function(req, res) {


    res.render("register");
})

/////// level 1 - username and password as text

app.post("/register", function(req, res) {

    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(function(err) {
        if (err) {
            console.log(err)
        } else {
            res.render("secrets");
        }
    });
})


app.post("/login", function(req, res) {
    
    User.findOne({email: req.body.username}, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            if (user) {
                if(user.password === req.body.password) {
                    res.render("secrets");
                } else {
                    res.send("wrong password");
                }
            }
        }
    })

})



//////// level 2 encryption using mongoose-encryption nodejs package


app.listen("3000", function() {
    console.log("started server");
})
