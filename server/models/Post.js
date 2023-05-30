const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: false
    },
    text: {
        type: String,
        max: 500
    },
    img: {
        type: String,
        default: '',
        required: false
    },
    likes: {
        type: Array,
        default: [],
        required: false
    },
    comments: {
        type: Array,
        default: [],
        required: false
    }
}, { timestamps: true })

module.exports = mongoose.model("Post", postSchema)