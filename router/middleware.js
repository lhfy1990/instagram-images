// requires
let URL = require("url");
let express = require('express');

let INS = require('../controllers/ins-images');

let router = express.Router();
// middleware to avoid router from stopping halfway
router.use(function(req, res, next) {
    next();
});

router.post('/getImageResourcesFromUrl', function(req, res) {
    let data = req.body;
    if (data && typeof data === 'object') data = data.url;
    if (!data || typeof data !== 'string') {
        res.status(400).json({ message: "Please provide request data!" });
        return;
    }
    // validate url
    let isValidUrl = true;
    try {
        isValidUrl = URL.parse(data).hostname !== null;
    } catch (err) {
        isValidUrl = false;
    }
    if (!isValidUrl) {
        res.status(400).json({ message: "Please provide valid url!" });
        return;
    }
    INS.getResources(data, (err, resources) => {
        if (err) res.status(400).json({message: err.message});
        else if (resources.length===0) res.status(404).json(null);
        else res.status(200).json(resources);
    });
});

module.exports = router;
