/**
 * Created by bjc90_000 on 1/28/2016.
 */
var express = require('express');
var app = express();
var router = express.Router();


var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost/SS';
/* GET listing. */
//router.get('/', function(req, res, next) {
//    res.send("nothing");
//});
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 30; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

router.post('/', function(req,res,next){
    console.log("validating login...");
    //asynch function for validation login
    var validateLogin = function(db, callback) {
        db.collection('login').findOne({username:req.body.username,password:req.body.password},function(err,document){

            if(err)//error: something went wroing
            res.send({validate:false});
            if(document){//found in the login collection

                db.collection('uniquekey').findOne({//object to search for

                    username: req.body.username,

                }, function (err, document) {
                    if(err){
                        res.send({validate:false});

                    }
                    if (document){
                        res.send({validate:true ,username:document.username,KEY:document.KEY});
                    }else
                    console.log("Issuing new key" );
                });
                var KEY = makeid();
                var ValidatedLoginUK = {username:document.username,KEY:KEY};
                db.collection('uniquekey').insert(ValidatedLoginUK, {w: 1}, function(err, records){//inserts into the uniquekey collection
                    if(err){
                        console.log("could not validatelogin-- insert");
                        res.send({error:"error in uniquekey collection insert"});
                    }else
                    console.log("Record added ",records);
                });
                res.send({validate:true ,username:document.username,KEY:KEY});
               }
             else

            res.send({validate:false})
        } );
    };
    // creates connection and calls validate login
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        validateLogin(db, function() {
            db.close();

        });
    });

});

//app.post('/', function (req,res,next){
//    res.json({hello:"world"})
//});

module.exports = router;