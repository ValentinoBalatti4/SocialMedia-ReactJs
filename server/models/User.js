const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        min: 4,
    },
    password: {
        type: String,
        min: 4,
    },
    profilePic: {
        type: String,
        default: "https://firebasestorage.googleapis.com/v0/b/my-social-media-af5c3.appspot.com/o/profPics%2FDefault_pfp.svg.png?alt=media&token=73bc4736-2ead-4e5c-92be-105cf343b0ac&_gl=1*1kio89c*_ga*MzAxOTUxMzg1LjE2ODA2NjkyMzY.*_ga_CW55HF8NVT*MTY4NjM1MDU3Ny42LjEuMTY4NjM1MDYwMS4wLjAuMA.."
    },
    followers: Array,
    following: Array
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)