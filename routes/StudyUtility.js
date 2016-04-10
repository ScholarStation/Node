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
                res.send({success: false, message: err});

            } else if (document) {
                console.log("found the login!: ", document);
                var NewStudyGroup =
                {
                    course: req.body.course,
                    owner: req.body.owner,
                    topic: req.body.topic,
                    date: req.body.date,
                    time: req.body.time,
                    members: req.body.members,
                    publicView: req.body.publicView
                };
                console.log("study group object (starting insert): ", NewStudyGroup);


                db.collection("study").insert(NewStudyGroup, function (err, records) {
                    //Callback for insert
                    if (err) {
                        console.log("There was an error in the insert-- Create Study Group", err);
                        res.send({success: false, message: err.toString()});
                    } else {
                        console.log("Created a new study Group: ", records);
                        res.send({success: true, message: ""});
                    }


                });


            } else {
                console.log("Didnt find a login to make a Study Group! ", req.body);
                res.send({success: false, message: "invalid Login"});

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
                res.send({success: false, message: err});

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
                        res.send({success:true,studyGroups: studyGroups});
                    }
                });


            } else {
                console.log("Didnt find a login to get studyGroups! ", req.body);
                res.send({success: false, message: "invalid Login"});
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
                    res.send({success: false, error: err});

                } else if (document) {
                    console.log("found the login!: , deleting ");
                    if(isAdmin(document)){
                        //delete based on ID
                        db.collection('study').deleteOne({_id: ObjectId(req.body._id)},function(err,results){
                            if(err){
                                //send error message
                                console.log("there was a DB error");
                                res.send({success: false, error: err.toString()});
                            }else if(results){
                                console.log("deleted: ",results);
                                res.send({success:true,message:results.toString()});
                                //send success
                            }else{
                                // send did not find message
                                console.log("there was no record with id ");
                                res.send({success: false, message:"not found"});
                            }
                        });
                    }else{
                    db.collection('study').findOne({_id: ObjectId(req.body._id)}, function (err, document) {
                        if (err) {
                            console.log("there was a DB error");
                            res.send({success: false, error: err});
                        } else if (document) {
                            //todo check for owner
                            db.collection('study').deleteOne(document,function(err,results){
                                if(err){
                                    //send error message
                                    console.log("there was a DB error");
                                    res.send({success: false, error: err.toString()});
                                }else if(results){
                                    console.log("deleted: ",results);
                                    res.send({success:true,message:results.toString()});
                                    //send success
                                }else{
                                    // send did not find message
                                    console.log("there was no record with id ");
                                    res.send({success: false, message:"not found"});
                                }
                            });
                        }else{
                            console.log("didnt find study groups");
                        }
                        //res.send({success: true,error: err, message: results});
                    });}
                } else {
                    res.send({success:false,message: "NO LOGIN"});
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
        res.send({success: false,message: "Invalid _id" });
    }

});

router.post('/EditByID',function(req,res){

    var editByID = function(db, callback){
      //check login
        db.collection('uniquekey').findOne({username: req.body.username, KEY: req.body.KEY}, function (err, document) {
            if (err) {
                console.log("There was an error in the Validation-- EDIT Study Group", err);
                res.send({success: false, message: err});
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
                    members: req.body.members,
                    publicView: req.body.publicView
                };



                db.collection('study').update({_id: ObjectId(req.body._id)},{$set:{
                    course: req.body.course,
                    owner: req.body.owner,
                    topic: req.body.topic,
                    date: req.body.date,
                    time: req.body.time,
                    members: req.body.members
                }},function(err,record){

                    if(err){
                        console.log("Error in the update ");
                        res.send({success:false, message : err})
                    }else if(record){
                        console.log("edited the record!: ",record);
                        res.send({success:true,message:""});
                    } else{
                        console.log("n record with id found: ",req.body._id);
                        res.send({success:false, message: "record not found"});
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

router.post('/JoinByID',function(req,res){
var joinByID = function(db){

    db.collection('uniquekey').findOne({username: req.body.username, KEY: req.body.KEY}, function (err, document) {
        if (err) {
            console.log("There was an error in the Validation-- EDIT Study Group", err);
            res.send({success: false, message: err});
        } else if (document) {
            console.log("found the login!: , updating ");
            //update the document
            var admin = isAdmin(document);
            db.collection('study').findOne({_id: ObjectId(req.body._id)}, function (err, document) {
                if (err) {
                    console.log("there was a DB error");
                    res.send({success: false, error: err});
                } else if (document) {
                    var UpdateStudyGroup = document;
                    if(admin||document.publicView)
                        document.members.add(req.body.newUser);
                    else{
                        console.log("not public or admin");
                        res.send({success: false, message: "not admin or public group"});
                    }
                    db.collection('study').update({_id:ObjectId(req.body._id)},UpdateStudyGroup, function(err,record){
                        if(err){
                            console.log("Error in the update ");
                            res.send({success:false, message : err})
                        }else if(record){
                            console.log("edited the record!: ",record);
                            res.send({success:true,message:""});
                        } else{
                            console.log("no record with id found: ",req.body._id);
                            res.send({success:false, message: "record not found"});
                        }
                    });
                }else{
                    console.log("didnt find study groups");
                    res.send({success: false, message:"didnt find study groups"});
                }
            });
            //schema
            //var UpdateStudyGroup =
            //{
            //    course: req.body.course,
            //    owner: req.body.owner,
            //    topic: req.body.topic,
            //    date: req.body.date,
            //    time: req.body.time,
            //    members: req.body.members
            //};

        } else {
            res.send({message: "NO LOGIN"});
        }
    });
};



    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        joinByID(db, function () {
            db.close();

        });
    });
});



function isAdmin(document){
    return document.permissionLevel=="ADMIN"
}

module.exports = router;