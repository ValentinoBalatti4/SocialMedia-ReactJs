const router = require('express').Router()
const { json } = require('body-parser')
const { userLogged } = require('../middleware/tokenManagment')
const Post = require('../models/Post')
const User = require('../models/User')
const multer = require("multer")
const tokenManagment = require('../middleware/tokenManagment')

router.get('/discover', tokenManagment.userLogged, async (req, res) => {
    try{
        const currentUser = req.user;

        const query = currentUser
            ? { username: { $ne: currentUser.username }, followers: { $nin: [currentUser.username] } }
            : {};

        const randomUsers = await User.aggregate([
            { $match: query },
            { $sample: { size: 10 } } // Retrieve a random sample of 10 users
        ]);

        res.status(200).json({ users: randomUsers });

    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


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
        const username = req.params?.username;
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
    try {
        const targetUser = await User.findOne({ username: req.params.username });
        const currentUser = await User.findById(req.user._id);

        if (!targetUser.followers.some(follower => follower === req.user.username)) {
            await targetUser.followers.push(req.user.username);
            await currentUser.following.push(targetUser.username);
        } else {
            await targetUser.followers.pull(req.user.username);
            await currentUser.following.pull(targetUser.username);
        }

        await targetUser.save();
        await currentUser.save();

        res.status(200).json({ message: 'Operation Success!',followers: targetUser.followers});

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router