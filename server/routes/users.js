const router = require('express').Router()
const { json } = require('body-parser')
const { userLogged } = require('../middleware/tokenManagment')
const Post = require('../models/Post')
const User = require('../models/User')
const multer = require("multer")

router.get('/search', async (req, res) => {
    try{
        const { query } = req.query;
        const users = await User.find({ username: { $regex: new RegExp(query, 'i') } })

        res.status(200).json({ users });
    } catch(error){
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.get('/:username', async (req, res) => {
        const username = req.params.username;
    try{
        const user = await User.findOne({ username: username });

        if(!user){
            res.status(404).json({ message: 'User not found!'});
        }

        const userInfo = { 
            username: user.username,
            profilePic: user.profilePic,
            posts: user.posts,
            followers: user.followers,
            following: user.following,
        }

        res.status(200).json({ message: 'User found!', user: userInfo});
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})


module.exports = router