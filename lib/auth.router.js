const express = require('express')
const router = express.Router()
const passport = require('passport')
const authController = require('./auth.controller')

// Setting up the passport middleare for each of the OAuth providers
// const googleAuth = passport.authenticate('google', {scope: ['profile']})
const githubAuth = passport.authenticate('github')
const oAuth = passport.authenticate('oauth2')

// Routes that are triggered by the callbacks from each OAuth provider once
// the user has authenticated successfully
// router.get('/google/callback', googleAuth, authController.google)
router.get('/github/callback', githubAuth, authController.github)
router.get('/oauth2/callback', oAuth, authController.oauth2)

// This custom middleware allows us to attach the socket id to the session
// with that socket id we can send back the right user info to the right socket
router.use((req, res, next) => {
    req.session.socketId = req.query.socketId
    next()
})

// Routes that are triggered on the client
// router.get('/google', googleAuth)
router.get('/github', githubAuth)
router.get('/oauth2', oAuth)

module.exports = router