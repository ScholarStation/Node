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
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 30; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

router.get('/', function (req, res, next) {
    res.send('tried to use a GET with LoginUtility. Should redirect to a different page...');
});


/**handles POST request to LOGINAPP from browser or phone
 *
 */
router.post('/', function (req, res, next) {
    console.log("validating login...");
    var validateLogin = function (db, callback) {
        db.collection('login').findOne({
            username: req.body.username,
            password: req.body.password
        }, function (err, document) {
            if (err) {//error: something went wroing
                console.log("Something went wrong...");
                res.send({success: false, error: "Something went wrong..."});
            }
            if (document) {//found the user by their username and password
                console.log("Found Login... Checking for UK");
                var permissionLevel = document.permissionLevel;
                db.collection('uniquekey').findOne({//now search for them and see if they already have a key too...
                    username: req.body.username
                }, function (err, document) {
                    if (err) { // error occurred during read from DB
                        console.log("Error during lookup...");
                        res.send({success: false, error: "Error during lookup..."});
                        return;
                    }
                    if (document) { // found the user and their unique key. send back valid!
                        console.log("Found user and their key...", document);
                        //find reminders
                        var cursor =db.collection('reminder').find({username:document.username});
                        var reminders =[];

                        cursor.each(function (err, doc) {
                            assert.equal(err, null);
                            if (doc != null) {
                                //create an aray of all of the reminders
                                console.log("found reminder!: ", doc);
                                reminders.push(doc);
                            } else {
                                //send
                                res.send({success: true, username: document.username, KEY: document.KEY,reminders:reminders});
                            }
                        });



                    }
                    else // found user, but they don't have a key...
                    {
                        console.log("Issuing new key");
                        var KEY = makeid();
                        var ValidatedLoginUK = {
                            username: req.body.username,
                            KEY: KEY,
                            permissionLevel: permissionLevel
                        };
                        db.collection('uniquekey').insert(ValidatedLoginUK, {w: 1}, function (err, records) {//inserts into the uniquekey collection
                            if (err) {
                                console.log("could not validatelogin-- insert");
                                res.send({error: "error in uniquekey collection insert"});
                            } else
                                console.log("Record added ", records);
                        });
                        console.log("sending reponse");
                        //find reminders
                        var cursor =db.collection('reminder').find({username:req.body.username});
                        var reminders =[];

                        cursor.each(function (err, doc) {
                            assert.equal(err, null);
                            if (doc != null) {
                                //create an aray of all of the reminders
                                console.log("found reminder!: ", doc);
                                reminders.push(doc);
                            } else {
                                //send
                                res.send({success: true, username: req.body.username, KEY: KEY,reminders:reminders});
                            }
                        });
                    }
                });
            }
            else// Did not find the user. Login failed!! -send back false-
            {
                console.log("Not a valid user. Login failed!");
                res.send({validate: false, message: "Not a valid user. Login failed!"});

            }

        });
    };
    // creates connection and calls validate login
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        validateLogin(db, function () {
            db.close();
        });
    });
});
router.post('/Create', function (req, res, next) {


    var createSG = function (db) {
        db.collection('login').findOne({username: req.body.username}, function (err, document) {//finds the user profile
            if (err) {
                console.log("could not find login for user");
                res.send({success: false, error: "could not find login for user"});
            } else if (document) {

                console.log("Cannot Make a Profile, on e allready exists");
                res.send({success: false, message: "USER ALREADY EXISTS (login)" + document.toString()})

            } else db.collection('login').insert(
                {
                    username: req.body.username,
                    password: req.body.password,
                    permissionLevel: req.body.permissionLevel
                }
                , function (err, records) {
                    if (err) {
                        console.log("DB ERROR");
                        res.send({success: false, error: err.toString()});
                    } else if (records) {
                        console.log("added login", records);
                        res.send({success: true, message: records.toString()});
                    } else {
                        console.log("something has gone terribly wong");
                        res.send({success: false, message: "???", error: "???"});
                    }

                });
        });
    };


    // creates connection and calls validate login
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        createSG(db, function () {
            db.close();
        });
    });
});




router.post('/DateTester', function (req, res, next) {
    var someDate = new Date(req.body.d);
    var numberOfDaysToAdd = 10;
    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
    console.log(someDate)


});
//app.post('/', function (req,res,next){
//    res.json({hello:"world"})
//});

module.exports = router;