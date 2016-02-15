/**
 * Created by bjc90_000 on 1/30/2016.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('This is the Profiles Page that the App commnicates with');
});

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost/SS';


router.post('/',function(req,res,next) {
    var request = req.body;
    console.log("this is the request:", request);

    var requestProfile = function (db, callback) {
       db.collection('uniquekey').findOne({//object to search for

            username: req.body.username,
            KEY: req.body.KEY

        }, function (err, document) {// search results
            console.log("error:",err,"document: ",document);
            if(err){//error- something went wrong
                console.log("could not find key for user");
                res.send({error: "could not find key for user"});
            }else

            if (document) {//found in the uk collection "is loggedin"
                console.log("user:"+document.username+"is logged in ");

                db.collection('profile').findOne({username:document.username}, function (err, document) {//finds the user profile
                    if (err) {
                        console.log("could not find profile for user");
                        res.send({error: "could not find profile for user"});
                    } else
                        console.log("found user profile  " , document);
                    res.send(document);
                });

            }
            else // invalid UK or user
                res.send({fuck: "you"});


        })
    }
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        requestProfile(db, function() {
            db.close();

        });
    });
});




module.exports = router;
