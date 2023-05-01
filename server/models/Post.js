const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: false
    },
    caption: {
        type: String,
        max: 500
    },
    img: {
        type: String,
        default: ''
    },
    likes: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    }
}, { timestamps: true })

module.exports = mongoose.model("Post", postSchema)