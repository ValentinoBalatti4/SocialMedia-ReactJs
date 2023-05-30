const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Post = require('../models/Post')
const verifyJWT = require('../middleware/verifyJWT')



router.post('/upload', verifyJWT, async (req, res) => {
    try{
        const post = new Post({
            username: req.user.username,
            text: req.body.text,
        })

        await post.save()

        res.status(200).json({message: 'Post uploaded succesfully!'})
    } catch(e){
        res.status(500).json({message: "An error has ocurred!", error: e.message})
        console.log(e)
    }
})


module.exports = router