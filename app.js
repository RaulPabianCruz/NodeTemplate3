require('dotenv').config();
const express = require('express');
const path = require('node:path');
const session = require('express-session');
const pgStore = require('connect-pg-simple')(session);
const passport = require('passport');
require('./config/passportConfig');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const connectionString = process.env.CONNECTION_STRING || process.env.DATABASE_URL;
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new pgStore({
        conString: connectionString,
        createTableIfMissing: true, 
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
}))
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
const assetsPath = path.join(__dirname, 'public')
app.use(express.static(assetsPath));
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).send(err.message);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

