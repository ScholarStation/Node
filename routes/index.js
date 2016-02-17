var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res) {
  //res.render('index', { title: 'Express' });
  //res.sendFile('index.html');
  res.sendFile(path.resolve('./views/index.html'));
 // res.send('this is the main page of the website');
});
router.post('/',function(req,res){
  console.log("INDEX.JS... REQ BODY");
  console.log(req.body);
  res.send(req.body);
});

module.exports = router;
