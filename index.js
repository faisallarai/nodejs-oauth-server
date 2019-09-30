require('dotenv').config()
const express = require('express')
const path = require('path')
const fs = require('fs')
const https = require('https')
const http = require('http')
const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const socket = require('socket.io')
const authRouter = require('./lib/auth.router')
const passportInit = require('./lib/passport.init')
const { CLIENT_BASEURL } = require('./config')
const morgan = require('morgan')
const app = express()

let server

server = http.createServer(app)

app.use(morgan('combined'))

// Setup for passport and to accept JSON objects
app.use(express.json())
app.use(passport.initialize())
passportInit()

// Accept requests from the client
app.use(cors({
    origin: CLIENT_BASEURL
}))

// Allows us to attach the socket id to the session
// before the user is authenticated
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

// Connecting sockets to the server and adding them to the request
// so that we can access them later in the controller
const io = socket(server)
app.set('io', io)

app.get('/wake-up', (req, res) => res.send('👍'))

// Direct all requests to the auth router
app.use('/', authRouter)

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})