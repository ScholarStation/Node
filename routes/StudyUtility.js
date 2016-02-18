/**
 * Created by bjc90_000 on 2/17/2016.
 */

var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost/SS';

router.post('/Create', function (req, res) {

    // This function validates a KEY and makes a new "study group"
    var CreateProfile = function (db, callback) {

        db.collection('uniquekey').findOne({username: req.body.username, KEY: req.body.KEY}, function (err, document) {
            if (err) {
                console.log("There was an error in the Validation-- Create Study Group"+ err);
                res.send({result: false, message: err});

            } else if (document) {
                console.log("found the login!: "+document);
                var NewStudyGroup =
                {
                    course: req.body.course,
                    owner: req.body.owner,
                    topic: req.body.topic,
                    date: req.body.date,
                    time: req.body.time,
                    members: req.body.members
                };
                console.log("study group object (starting insert): " + NewStudyGroup);


                db.collection("study").insert(NewStudyGroup, function (err, records) {
                    //Callback for insert
                    if (err) {
                        console.log("There was an error in the insert-- Create Study Group"+ err);
                        res.send({result: false, message: err});
                    } else {
                        console.log("Created a new study Group: " + records);
                        res.send({result: true, message: ""});
                    }


                });


            } else {
                console.log("Didnt find a login to make a Study Group! "+req.body);
                res.send({result: false, message: "invalid Login"});

            }
        });

    }

});