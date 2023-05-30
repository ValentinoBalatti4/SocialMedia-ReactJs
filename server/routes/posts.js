const router = require('express').Router()
const Post = require('../models/Post')
const verifyJWT = require('../middleware/verifyJWT')
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage')
const { initializeApp } = require('firebase/app')
const config = require('../config/firebase.config.js')
const multer = require('multer')

initializeApp(config)
const storage = getStorage()

const upload = multer({ storage: multer.memoryStorage() })


router.post('/upload', verifyJWT, upload.single('image'), async (req, res) => {
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
            username: req.user,
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

router.post('/remove', verifyJWT, async (req, res) => {
    try{

    }catch(e){
        
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