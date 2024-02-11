const router = require('express').Router()
const { json } = require('body-parser')
const { userLogged } = require('../middleware/tokenManagment')
const Post = require('../models/Post')
const User = require('../models/User')
const multer = require("multer")
const tokenManagment = require('../middleware/tokenManagment')


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

router.post("/follow/:username", tokenManagment.userLogged, async (req, res) => {
    try{
        const targetUser = await User.findOne({ username: req.params.username });
        const currentUser = await User.findById(req.user._id);

        if(!targetUser.followers.some(follower => follower === req.user.username)){
            await targetUser.updateOne({ $push: {followers:  req.user.username} })
            await currentUser.updateOne({ $push: {following: targetUser.username} })        
        } else{
            await targetUser.updateOne({ $pull: {followers: req.user.username} })
            await currentUser.updateOne({ $pull: { following: targetUser.username} })
        }

        json.status(200).json({ message: 'Operation Success!', following: currentUser.following })

    } catch (err){
        res.status(500).json({ message: 'Internal server error' });
    }
})


module.exports = router