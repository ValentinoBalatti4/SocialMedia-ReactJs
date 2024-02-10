require('dotenv').config()
const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const tokenManagment = require('../middleware/tokenManagment')

router.post('/register', async (req, res, next) => {
    try {
        const { password, username } = req.body;
        const existingUser = await User.findOne({ username });
        
        if (existingUser) return res.json({ message: "User already exists" });
        
        const hashedPassword = await bcrypt.hash(password, 5);

        const user = await User.create({ 
          username: username,
          password: hashedPassword
        });

        const token = tokenManagment.createSecretToken({ id: user._id, username: user.username });
        res.cookie("token", token, {
          withCredentials: true,
          httpOnly: false,
          sameSite: 'none'
        });
        res
          .status(201)
          .json({ message: "User signed in successfully", success: true, user });
        next();
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
})

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if(!username || !password ){
          return res.json({message:'All fields are required'})
        }
        const user = await User.findOne({ username });
        if(!user){
          return res.json({message:'Incorrect password or username' }) 
        }
        const auth = await bcrypt.compare(password, user.password)
        if (!auth) {
          return res.json({message:'Incorrect password or username' }) 
        }
         const token = tokenManagment.createSecretToken({ id: user._id, username: user.username });
         res.cookie("token", token, {
           withCredentials: true,
           httpOnly: false,
           sameSite: 'none'
         });
         res.status(201).json({ message: "User logged in successfully", success: true });
         next()
      } catch (error) {
        console.error(error);
      }
})

router.post('/', tokenManagment.userVerification)

router.post('/logout', (req, res) => {
    try{
        const cookies = req.cookies
        if(!cookies?.jwt) return res.status(204)
        
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        })
        res.json({message: 'Loged out!'})       

    } catch(e){
        console.log(e.message)
    }
})

module.exports = router