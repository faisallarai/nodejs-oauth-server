const passport = require('passport')
// const { Strategy: GoogleStrategy } = require('passport-google-oauth20')
const { Strategy: GithubStrategy } = require('passport-github')
const { Strategy: OAuth2Strategy } = require('passport-oauth2')
const { GITHUB_CONFIG, OAUTH2_CONFIG} = require('../config')
const Profile = require('./profile')

module.exports = () => {
    // Allow passport to serialize and deserialize users into sessions
    passport.serializeUser((user, cb) => cb(null, user))
    passport.deserializeUser((obj, cb) => cb(null, obj))

    // The callback that is invoked when an OAuth provider sends back user
    // information. Normally, you would save the user to the database
    // in this callback and it would be customized for each provider
    const callback = (accessToken, refreshToken, params, profile, cb) => {
        console.log('access-token',accessToken)
        console.log('refresh-token',refreshToken)
        console.log('profile',profile)
        console.log('params',params)
        return cb(null, profile)
    }

    // Adding each OAuth provider's startegy to passport
    // passport.use(new GoogleStrategy(GOOGLE_CONFIG, callback))
    passport.use(new GithubStrategy(GITHUB_CONFIG, callback))
    const DjangoStrategy = new OAuth2Strategy(OAUTH2_CONFIG, callback)
    DjangoStrategy.userProfile = function(accessToken, done) {
        var self = this;
        this._userProfileURL = 'http://localhost:8001/accounts/profile/';
        this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
            var json;
            
            if (err) {
            if (err.data) {
                try {
                json = JSON.parse(err.data);
                } catch (_) {}
            }
            
            if (json && json.message) {
                return done(new APIError(json.message));
            }
            return done(new InternalOAuthError('Failed to fetch user profile', err));
            }
            
            try {
            json = JSON.parse(body);
            } catch (ex) {
            return done(new Error('Failed to parse user profile'));
            }

            console.log('json', json)
            
            var profile = Profile.parse(json);
            profile.provider  = 'oauth2';
            profile._raw = body;
            profile._json = json;
            done(null, profile);
        });
        }
    passport.use(DjangoStrategy)
}

