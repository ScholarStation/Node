/**
 * Created by bjc90_000 on 2/8/2016.
 */
var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/',function(req,res,next){
   //Only send back if you can validate the user is logged in with the right key and all that.
   res.sendFile(path.resolve('./views/dashBoard.html'));
});
module.exports = router;