/**
 * Created by Michael on 2/11/2016.
 */
var express = require('express');
var app = express();
var router = express.Router();

router.get('/',function(req,res,next){
    //Only send back if you can validate the user is logged in with the right key and all that.
    res.sendFile('../views/error.html');
});
module.exports = router;