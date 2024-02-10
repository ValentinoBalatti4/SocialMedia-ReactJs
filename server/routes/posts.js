const router = require('express').Router()
const Post = require('../models/Post')
const tokenManagment = require('../middleware/tokenManagment')
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage')
const { initializeApp } = require('firebase/app')
const config = require('../config/firebase.config.js')
const multer = require('multer')
const User = require('../models/User.js')
const { v4: uuidv4 } = require('uuid');

initializeApp(config)
const storage = getStorage()

const upload = multer({ storage: multer.memoryStorage() })

router.post('/upload', tokenManagment.userLogged, upload.single('image'), async (req, res) => {
    try{
        const file = req.file
        let imageUrl = ""
        if(file){
            const timestamp = Date.now().toString()
            const fileUpload = ref(storage,  file.originalname + '_' + timestamp);
            const snapshot = await uploadBytes(fileUpload, file.buffer);

            imageUrl = await getDownloadURL(snapshot.ref)
        }
        const post = new Post({
            username: req.user.username,
            text: req.body.text,
            img: imageUrl
        })
        await post.save()
        res.status(200).json({message: 'Post uploaded succesfully!'})
    } catch(e){
        res.status(500).json({message: "An error has ocurred!", error: e.message})
        console.log(e)
    }
})

router.post('/delete/:postId',  tokenManagment.userLogged, async (req, res) => {
    const postId = req.params.postId;
    try{
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({message: 'Post not found!'});
        }

        if(post.username !== req.user.username){
            return res.status(403).json({message: 'Unauthorized!'});
        }

        if(post.img !== ""){
            const imgRef = ref(storage, post.img);

            await deleteObject(imgRef);
        }

        await Post.findByIdAndDelete(postId)
        res.json({message: 'Post deleted successfully!'});
    }catch(e){
        console.log(e);
        res.status(500).json({message: 'Internal Server Error!'});
    }
})

router.post("/like/:postId", tokenManagment.userLogged, async (req, res) => {
    const postId = req.params.postId;
    const currentUser = req.user.username;
    try{
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({message: 'Post not found!'});
        }

        (post.likes.includes(currentUser)) ? post.likes.pull(currentUser) : post.likes.push(req.user.username);

        await post.save();

        res.status(200).json({message: 'Post liked successfully', likes: post.likes});
    }catch(e){
        console.log(e);
        res.status(500).json({message: 'Internal Server Error'});
    }
})

router.post('/comment/:postId', tokenManagment.userLogged, async (req, res) => {
    const postId = req.params.postId;
    const { commentText } = req.body;
    const user = req.user.username;
    try{
        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({message: 'Post not found'});

        const newComment = {
            username: user,
            commentText: commentText,
            commentId: uuidv4(),
            createdAt: new Date().toISOString()
        }

        post.comments.push(newComment);

        await post.save();
        res.status(200).json({ message: 'Comment uploaded successfully', comments: post.comments });
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
})

router.post('/deleteComment/:postId/:commentId', async (req, res) => {
    const  commentId = req.params.commentId;
    try{
        const post = await Post.findById(postId); 

        if(!post) return res.status(404).json({ message: 'Post not found'});



        
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
})

router.get('/:username/posts', async (req, res) => {
    const username = req.params.username;
    try{
        const user = User.findOne({ username: username});
        if(!user) return res.status(404).json({ message: 'User not found' });
        
        const userPosts = await Post.find({ username });

        res.status(200).json({ message: 'Posts found', posts: userPosts });

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
})

router.get('/', async (req, res) => {
    try{
        const posts = await Post.find().sort({createdAt: -1})
        
        res.status(200).json({posts: posts})
    } catch(e){
        res.status(404).json({ message: "Posts not found"})
    }
})

module.exports = router