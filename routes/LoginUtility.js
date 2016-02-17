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

router.get('/', function(req, res, next){
    res.send('tried to use a GET with LoginUtility. Should redirect to a different page...');
});


/**handles POST request to LOGINAPP from browser or phone
 *
 */
router.post('/', function(req,res,next){
    console.log("validating login...");
    var validateLogin = function(db, callback) {
        db.collection('login').findOne({username:req.body.username,password:req.body.password},function(err,document){
            if(err) {//error: something went wroing
                console.log("Something went wrong...");
                res.send({validate: false});
            }
            if(document){//found the user by their username and password
                console.log("I FOUND YOU...");
                db.collection('uniquekey').findOne({//now search for them and see if they already have a key too...
                    username: req.body.username,
                }, function (err, document) {
                    if(err){ // error occured during read from DB
                        console.log("Error during lookup...");
                        res.send({validate:false});
                        return;
                    }
                    if (document){ // found the user and thier unique key. send back valid!
                        console.log("Found user and their key...");
                        res.send({validate:true ,username:document.username,KEY:document.KEY});
                        return;
                    }
                    else // found user, but they don't have a key...
                    {
                        console.log("Issuing new key" );
                        var KEY = makeid();
                        var ValidatedLoginUK = {username:document.username,KEY:KEY};
                        db.collection('uniquekey').insert(ValidatedLoginUK, {w: 1}, function(err, records){//inserts into the uniquekey collection
                            if(err){
                                console.log("could not validatelogin-- insert");
                                 res.send({error:"error in uniquekey collection insert"});
                            }else
                                console.log("Record added ",records);
                        });
                        console.log("hot here 3");
                        res.send({validate:true ,username:document.username,KEY:KEY});
                        return;
                    }
                });
               }
                else// Did not find the user. Login failed!! -send back false-
                {
                console.log("Not a valid user. Login failed!");
                res.send({validate:false});
                return;
                }

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