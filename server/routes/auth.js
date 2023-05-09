require('dotenv').config()
const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')


router.post('/register', async (req, res) => {
    try{
        const { username, password } = req.body

        const existingUser = await User.findOne({ username: username})
        if(existingUser){
            res.json.status(400).json({message: "Username already in use"})
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({
            username: username,
            password: passwordHash
        })

        const savedUser = newUser.save()
        res.json({savedUser})
    } catch(err){
        res.status(500).json({message: err.message})
    }
})

router.post('/login', async (req, res) => {
    try{
        const { username, password } = req.body

        const user = await User.findOne({ username: username})
        if(!user){
            res.status(400).json({ message:"No account with username provided!"})
        }

        const isMatch = bcrypt.compare(password, user.password)
        if(!isMatch){res.status(400).json({message: "Invalid credentials"})}

        const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username
            }
        })

    } catch(e){
        res.status(500).json({message: e.message})
    }
})

module.exports = router