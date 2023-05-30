const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/posts')

const app = express()

app.use(express.json())
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
app.use("/", postRoutes)

//Initialize server
app.listen(process.env.PORT, () => {
    console.log('[+] Listening on http://localhost:' + process.env.PORT)
})