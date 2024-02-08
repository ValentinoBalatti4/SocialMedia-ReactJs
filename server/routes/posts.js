const router = require('express').Router()
const Post = require('../models/Post')
const tokenManagment = require('../middleware/tokenManagment')
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage')
const { initializeApp } = require('firebase/app')
const config = require('../config/firebase.config.js')
const multer = require('multer')


initializeApp(config)
const storage = getStorage()

const upload = multer({ storage: multer.memoryStorage() })

router.post('/upload', tokenManagment.userLogged, upload.single('image'), async (req, res) => {
    console.log("[!] exec upload...")
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

router.post('/remove/:postId',  tokenManagment.userLogged, async (req, res) => {
    const postId = req.params.postId;
    try{
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({message: 'Post not found!'});
        }

        if(post.username !== req.user.username){
            return res.status(403).json({message: 'Unauthorized!'});
        }

        await Post.findByIdAndDelete(postId)
        res.json({message: 'Post deleted successfully!'});
    }catch(e){
        console.log(e);
        res.status(500).json({message: 'Internal Server Error!'});
    }
})

router.post("/like/:postId", tokenManagment.userLogged, (req, res) => {
    const postId = req.params.postId
    try{
        const post = Post.findById(postId);

        if(!post){
            return res.status(404).json({message: 'Post not found!'});
        }

    }catch(e){
        console.log(e);
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