var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/', isLoggedIn, (req, res) => {
    req.logout();
    res.status(200).json({
        'message': 'map loaded'
    });
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
