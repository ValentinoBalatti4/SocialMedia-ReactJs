const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')   
require('dotenv').config()

const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/posts')

const app = express()

app.use(cors({origin: 'http://localhost:3000', credentials: true, methods: ['GET', 'POST']}))
app.use(cookieParser())
app.use(express.json())

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
    console.log('[+] Listening on http://localhost:' + process.env.PORT)
})