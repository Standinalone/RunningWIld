var express = require('express');
var router = express.Router();
var passport = require('passport');

var User       = require('../../models/user');
var Stats       = require('../../models/stats');

router.post('/', isLoggedIn, (req, res) => {


    let stats = new Stats()
    stats.seconds = req.body.seconds
    stats.minutes = req.body.minutes
    stats.level = req.body.level
    stats.ms = req.body.ms
    stats.user = req.user
    stats.save()

    let level = stats.level + 1
    if (req.user.levels_completed < level)
        req.user.levels_completed = level
    req.user.save().then(()=> {
        console.log(level + " " + req.user.levels_completed)
        res.json({message : 'done'})
    })
});

router.get('/levels', (req, res) => {
    let levels_completed = req.user.levels_completed
    res.status(200).json({completed_levels : levels_completed})
    console.log(levels_completed)
})

router.get('/:id', isLoggedIn, (req, res) => {
    let id = req.params.id
    let query = Stats.find({ level : id },'seconds minutes ms').populate('user','login').limit(10).sort({ minutes : 1, seconds : 1, ms : 1})//.limit(10)

    query.exec((err, object) => {
        console.log(object)
        res.status(200).json((object))
    } )
    
});


module.exports = router;

//route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.status(400).json({
        'message': 'access denied'
    });
}