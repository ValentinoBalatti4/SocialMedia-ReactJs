const router = require('express').Router()
const { json } = require('body-parser')
const { userLogged } = require('../middleware/tokenManagment')
const Post = require('../models/Post')
const User = require('../models/User')
const multer = require("multer")
const tokenManagment = require('../middleware/tokenManagment')
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage')
const { initializeApp } = require('firebase/app')
const config = require('../config/firebase.config.js')


initializeApp(config)
const storage = getStorage()

const upload = multer({ storage: multer.memoryStorage() })


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

router.post('/changeProfilePicture', tokenManagment.userLogged, upload.single('image'), async (req, res) => {
    try{
        const image = req.file;
        const user = await User.findOne({ username: req.user.username }); 
        const defaultProfilePicture = "https://firebasestorage.googleapis.com/v0/b/my-social-media-af5c3.appspot.com/o/profPics%2Fdefault_profile_picture.webp?alt=media&token=0b4d2adb-db62-476c-98ae-66814186c7a1"

        if(!user){
            res.status(404).json({ message: 'User not found' });
        }

        //Delete ProfilePicture from Firebase (does not apply for default picture)
        if(user.profilePic !== defaultProfilePicture){
            const imgRef = ref(storage, user.profilePic);
            await deleteObject(imgRef);
        }

        let imageUrl = defaultProfilePicture;
        if(image){
            const timestamp = Date.now().toString()
            const fileUpload = ref(storage,  `profPic/${uploadedImage.originalname}_${timestamp}`);
            const snapshot = await uploadBytes(fileUpload, file.buffer);

            imageUrl = await getDownloadURL(snapshot.ref)
        }

        await user.updateOne({ profilePic: imageUrl});

        res.status(200).json({ message: 'ProfilePic changed successfully!' })

    }catch(error){
        res.status(500).json({ message: 'Internal Server Error' });
        console.log(error);
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