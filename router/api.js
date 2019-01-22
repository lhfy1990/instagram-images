// requires
var express = require('express');

let router = express.Router();
// middleware to avoid router from stopping halfway
router.use(function(req, res, next) {
    next();
});
// entrance
router.get('/',
    function(req, res) {
        res.json({
            message: "hello, RESTful!"
        });
    });
// no api
module.exports = router;
