require('dotenv').config()
const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const verifyJWT = require('../middleware/verifyJWT')

router.post('/register', async (req, res) => {
    try{
        const { username, password } = req.body

        const existingUser = await User.findOne({ username: username})
        if(existingUser){
            res.status(400).json({message: "Username already in use"})
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

        const user = await User.findOne({ username: username}).exec()
        if(!user){
            res.status(400).json({ message:"No account with username provided!"})
        }

        const isMatch = bcrypt.compare(password, user.password)
        if(!isMatch){res.status(400).json({message: "Invalid credentials"})}

        const accessToken = jwt.sign(
            {
                userInfo: {
                    id: user._id,
                    username: user.username
                }
            }, process.env.JWT_KEY, { expiresIn: '7d'})
            
        const refreshToken = jwt.sign(
            {username : user.username},
            process.env.RF_KEY,
            {expiresIn: '1d'}
        )
        
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({ accessToken })

    } catch(e){
        res.status(401).json({message: "Something has gone wrong!"})
    }
})

router.get('/refresh', (req, res, next) => {
    const cookies = req.cookies

    if(!cookies.jwt) return res.status(401).json({message: 'Unauthorized'})

    const refreshToken = cookies.jwt

    try{
        const decoded = jwt.verify(
            refreshToken,
            process.env.RF_KEY,
        )

        const user = User.findOne({username: decoded.username})

        if(!user) return res.status(401).json({message: 'Unauthorized'})

        const accessToken = jwt.sign(
            {
                userInfo: {
                    id: user._id,
                    username: user.username
                }
            },
            process.env.JWT_KEY,
            {expiresIn: '15m'}
        )

        res.json({ accessToken })

    } catch(e){
        if(e.name === 'TokenExpiredError'){
            return res.status(403).json({ message: 'Forbidden' });
        }
        res.status(500).json({ message: 'Internal Server Error' });

    }
})

router.get('/verify', verifyJWT, (req, res) => {
    res.sendStatus(200); // Return a success status if the token is valid
});

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