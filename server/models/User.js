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
        default: "https://firebasestorage.googleapis.com/v0/b/my-social-media-af5c3.appspot.com/o/profPics%2Fdefault_profile_picture.webp?alt=media&token=0b4d2adb-db62-476c-98ae-66814186c7a1"
    },
    followers: Array,
    following: Array
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)