const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        min: 4,
        required
    },
    password: {
        type: String,
        min: 4,
        required
    },
    profilePic: String,
    followers: Array,
    following: Array
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)