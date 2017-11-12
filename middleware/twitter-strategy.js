const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user');

module.exports = new TwitterStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: "https://nightlybars.herokuapp.com/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, cb) {
        User.findOne({ twitterId: profile.id })
            .then(user => {
                if (!user) {
                    User.create({ twitterId: profile.id })
                        .then(user => cb(null, user))
                } else {
                    console.log(user);
                    cb(null, user)
                }
            })
    });