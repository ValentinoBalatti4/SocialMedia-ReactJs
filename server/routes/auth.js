require('dotenv').config()
const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/User')

router.post('/register', async (req, res) => {
    try{
        let = { username, password, checkPassword } = req.body

        if()







    } catch(err){

    }
})

router.post('/login', async (req, res) => {
    
})