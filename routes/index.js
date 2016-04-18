var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function (req, res) {
    //res.render('dashboard', { title: 'Express' }); // this is if we are using index.jade
    res.sendFile(path.resolve('./views/index.html'));// this si if we are using index.html

});
router.post('/', function (req, res) {
    console.log("INDEX.JS... REQ BODY");
    console.log(req.body);
    res.send(req.body);
});

module.exports = router;
