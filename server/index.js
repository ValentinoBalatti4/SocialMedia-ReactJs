const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { default: mongoose } = require('mongoose')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/posts')

const app = express()

app.use(cors())

//Connect to DB
mongoose.connect(process.env.MONGO_KEY)
.then(() => {
    console.log("[+] DB connected!")
})
.catch((e) => {
    console.log("[!] Failed to connect! ", e.message)
})

// Routes
app.use("/auth", authRoutes)
app.use("/posts", postRoutes)

//Initialize server
app.listen(process.env.PORT, () => {
    console.log('[+] Listening on port ' + process.env.PORT)
})