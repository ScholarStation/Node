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
                console.log("There was an error in the Validation-- Create Study Group", err);
                res.send({result: false, message: err});

            } else if (document) {
                console.log("found the login!: ", document);
                var NewStudyGroup =
                {
                    course: req.body.course,
                    owner: req.body.owner,
                    topic: req.body.topic,
                    date: req.body.date,
                    time: req.body.time,
                    members: req.body.members
                };
                console.log("study group object (starting insert): ", NewStudyGroup);


                db.collection("study").insert(NewStudyGroup, function (err, records) {
                    //Callback for insert
                    if (err) {
                        console.log("There was an error in the insert-- Create Study Group", err);
                        res.send({result: false, message: err});
                    } else {
                        console.log("Created a new study Group: ", records);
                        res.send({result: true, message: ""});
                    }


                });


            } else {
                console.log("Didnt find a login to make a Study Group! ", req.body);
                res.send({result: false, message: "invalid Login"});

            }
        });

    }

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        CreateProfile(db, function () {
            db.close();

        });
    });

});

router.post('/GetStudyGroupsByMember', function (req, res) {

    var getProfile = function (db, callback) {
        console.log("starting a retrival of study group", req.body);

        db.collection('uniquekey').findOne({username: req.body.username, KEY: req.body.KEY}, function (err, document) {
            if (err) {
                console.log("There was an error in the Validation-- Create Study Group", err);
                res.send({result: false, message: err});

            } else if (document) {
                console.log("found the login!: , starting to find the study groups", document);

                var cursor = db.collection('study').find({$or: [{owner: req.body.username}, {members: req.body.username}]});
                console.log("Done! processing!");
                //use this as template
                var studyGroups = [];
                cursor.each(function (err, doc) {
                    assert.equal(err, null);
                    if (doc != null) {
                        //create an aray of all of the study groups
                        console.log("found a study group!: ", doc);
                        studyGroups.push(doc);
                    } else {
                        // send
                        res.send({studyGroups: studyGroups});
                    }
                });


            } else {
                console.log("Didnt find a login to get studyGroups! ", req.body);
                res.send({result: false, message: "invalid Login"});
            }

        });

    }
    console.log("made it to get groups1!");
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        getProfile(db, function () {
            db.close();

        });
    });
});

router.post('/DeleteByID', function (req, res) {

    var deleteItem = function (db, callback) {

            db.collection('uniquekey').findOne({username: req.body.username, KEY: req.body.KEY}, function (err, document) {
                if (err) {
                    console.log("There was an error in the Validation-- Create Study Group", err);
                    res.send({result: false, message: err});

                } else if (document) {
                    console.log("found the login!: , deleting ");
                    db.collection('study').deleteOne({owner:req.body.username,_id: ObjectId(req.body._id)}, function (err, results) {
                        res.send({err: err, result: results});
                    });
                } else {
                    res.send({message: "NO LOGIN"});
                }
            });
        };

//only do it if a valid key (24 char)
    if (req.body._id.length == 24) {
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            deleteItem(db, function () {
                db.close();

            });
        });
    } else {
        res.send({message: "Invalid _id" });
    }

});

router.post('/EditByID',function(req,res){

    var editByID = function(db, callback){
      //check login
        db.collection('uniquekey').findOne({username: req.body.username, KEY: req.body.KEY}, function (err, document) {
            if (err) {
                console.log("There was an error in the Validation-- EDIT Study Group", err);
                res.send({result: false, message: err});

            } else if (document) {
                console.log("found the login!: , updating ");
                //update the document
                var UpdateStudyGroup =
                {
                    course: req.body.course,
                    owner: req.body.owner,
                    topic: req.body.topic,
                    date: req.body.date,
                    time: req.body.time,
                    members: req.body.members
                };

                db.collection('study').update({_id: ObjectId(req.body._id)},UpdateStudyGroup,function(err,record){
                    if(err){
                        console.log("Error in the update ");
                        res.send({result:false, message : err})

                    }else if(record){
                        console.log("edited the record!: ",record);
                        res.send({result:true,message:""});

                    } else{
                        console.log("n record with id found: ",req.body._id);
                        res.send({result:false, message: "record not found"});

                    }


                });


            } else {
                res.send({message: "NO LOGIN"});
            }
        });
    };


    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        editByID(db, function () {
            db.close();

        });
    });
});


module.exports = router;