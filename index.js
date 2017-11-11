const express           = require('express');
const app               = express();
const path              = require('path');
const passport          = require('passport');
const session           = require('express-session');
const mongoose          = require('mongoose');
const User              = require('./models/user');
const TwitterStrategy   = require('./middleware/twitter-strategy');
const MongoStore        = require('connect-mongo')(session);

// Database connection
mongoose.connect(process.env.DB_URL, { useMongoClient: true });
mongoose.connection
    .once('open', () => {
        console.log('Connected to the database');
        mongoose.Promise = global.Promise;
    })
    .on('error', (e) => {
       console.log(e.message);
    });

// App configuration
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'static')));

// Session configuration
if (process.env.ENVIRONMENT && process.env.ENVIRONMENT === 'dev') {
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    }));
} else {
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    }));
}

// Passport Configuration
app.use(passport.initialize());
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
app.use(passport.session());
passport.use(TwitterStrategy);

// Routes setup
const apiRoutes = require('./routes/api');
const twitterAuthRoutes = require('./routes/auth');
app.get('/', (req, res) => { res.render('index', { user: req.user }) });
app.use('/api', apiRoutes);
app.use('/auth/twitter', twitterAuthRoutes);

app.listen(3000, () => {
    console.log('The server has started!');
});