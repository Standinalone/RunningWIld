// ============ Libraries ===================
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser') // Request parser
const mongoose = require('mongoose')

// ============= Authentication =============
var passport        = require('passport')
var session         = require('express-session')
var cookieParser    = require('cookie-parser');
var authRoutes      = require('./routes/auth');
var testRoutes      = require('./routes/test');
var levelRoutes     = require('./routes/level');
var statsRoutes     = require('./routes/info');
require('./config/passport')(passport); // pass passport for configuration

// ============ DB Configuration ============

mongoose.connect('mongodb://localhost:27017/test2')
// const Schema = mongoose.Schema
// const usersSchema = new Schema({
//     name: {type : String, required : true},
//     password :{type : String, required : true},
// })
// const statsSchema = new Schema({
//     name: {type : String, required : true},
//     password :{type : String, required : true},
// })
// const UserData = mongoose.model('users', usersSchema)
// const StatsData = mongoose.model('stats', statsSchema)

// ============= Configuration ==============
const app = express()
app.set('view engine', 'ejs')
app.use(morgan('dev')) // logger
app.use(bodyParser.urlencoded({ extended : false})) // which kind of bodies to parse
app.use(bodyParser.json()) // extracts json data and parses it
app.use(express.static(__dirname));

// required for passport
app.use(cookieParser()); // read cookies (needed for auth)
app.use(session({
    secret: 'whynot', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// ============= Routes ==============
app.use('/auth', authRoutes);
app.use('/test', testRoutes);
// app.use('/level', levelRoutes)
app.use('/stats', statsRoutes)

// function isAuthenticated(req, res, next) {
//     console.log('as')
//     if (req.user.authenticated){
//         return next();
//     }
//     res.redirect('/views/loggingin');
// }

// app.use('/test', (req, res, next) => {
//     console.log('aaaaaaaaaaaaaaaaaaaa')
//     if (req.user)
//         res.send('yes')
//     else
//         res.send('no')
//     // res.render('../index')
// })

// app.use('/login', (req, res, next) => {
//     UserData.find().then(doc => {res.json({ items : doc})})
// })
// app.use('/sign-up', (req, res, next)  => {
//     res.render('signup')
// })
// app.use('/confirm', (req, res, next) => {
//     let user = {
//         name : req.body.name,
//         password : req.body.password,
//     }
//     UserData.count({ name : req.body.name}, (err, count) => {
//         if (count > 0)
//             res.send('Пользователь с таким ником уже зарегистрирован')
//         else
//         {
//             let data = new UserData(user)
//             data.save()
//             res.render('success')
//         }
            
//     })
// })
// app.use('/sign_in', (req, res, next) => {
//     let user = {
//         name : req.body.name,
//         password : req.body.password,
//     }
//     // UserData.count({ name : req.body.name}, (err, count) => {
//     //     if (count > 0)
//     //         res.send('Пользователь с таким ником уже зарегистрирован')
//     //     else
//     //         res.render('success')
//     // })
// })

// app.use('/login', (req, res, next) => {
//     res.render('login')
// })

// viewed at http://localhost:8080
// app.get('/', function(req, res) {
//     // res.sendFile(path.join(__dirname + '/index.html'));
    
//     res.sendFile(path.join(__dirname +'/index.html'));
// });
app.listen(8080, "0.0.0.0");