const providers = ['google', 'github', 'oauth2']

const callbacks = providers.map(provider => {
    return process.env.NODE_ENV === 'production' 
    ? `https://django-oauth-server.herokuapp.com/${provider}/callback/`
    : `http://localhost:8080/${provider}/callback/`
})

const [googleURL, githubURL, oauth2URL] = callbacks

exports.CLIENT_BASEURL = process.env.NODE_ENV === 'production'
    ? 'https://react-oauth-client.herokuapp.com'
    : ['http://localhost:3000','http://127.0.0.1:3000']

exports.GOOGLE_CONFIG = {
    clientID: process.env.GOOGLE_KEY,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: googleURL
}

exports.GITHUB_CONFIG = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: githubURL
}

exports.OAUTH2_CONFIG = {
    authorizationURL: 'http://localhost:8001/o/authorize/',
    tokenURL: 'http://localhost:8001/o/token/',
    clientID: process.env.OAUTH2_CLIENT_ID,
    clientSecret: process.env.OAUTH2_CLIENT_SECRET,
    callbackURL: oauth2URL,
    userProfileURL: 'http://localhost:8001/accounts/profile/',
    scope: "read"
}