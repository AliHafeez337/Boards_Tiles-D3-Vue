/* REQUIRES */

const express = require('express');
const session = require('express-session');
const bodyParser = require("body-parser");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const passport = require('passport');
const http = require("http");
const cors = require ('cors');
require('dotenv').config();

process.env.MSG ? console.log('\n', process.env.MSG) : console.log('\n', "Environment variables are not working.")

// pasport config
require('./auth/passport')(passport);

// routes
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const boardRoutes = require('./routes/board');
const sectionRoutes = require('./routes/section');
const sectionNameRoutes = require('./routes/sectionName');
const tileRoutes = require('./routes/tile');
const labelRoutes = require('./routes/label');


/* SERVER SETUP */

var app = express();
var server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log('\n', `Server started on port ${process.env.PORT}.`);
});


/* LOCAL IMPORTS */


/* DATABASE */

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true,  
        useFindAndModify: false,
        useUnifiedTopology: true
    }
  )
  .then(() => console.log('\n', 'Connected to mongodb.'))
  .catch(err => console.log('\n', err));


/* APP SETUP */

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(logger("dev"));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express session
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
  })
);

app.get(/.*/, (req, res, next) => {
  next()
})

// Passport middleware
app.use(passport.initialize());
// app.use(passport.session());

// Static folder
app.use(express.static(__dirname + '/public/'));


/* ROUTES */

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/board', boardRoutes);
app.use('/api/section', sectionRoutes);
app.use('/api/sectionName', sectionNameRoutes);
app.use('/api/tile', tileRoutes);
app.use('/api/label', labelRoutes);
app.get('/api/credits', (req, res) => res.status(200).send({ msg: 'This project is developed by AliHafeez337.' }))

// handle SPA
app.get(/.*/, (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})