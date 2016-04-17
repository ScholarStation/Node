/**
 * Created by bjc90_000 on 4/13/2016.
 */


var express = require('express');
var app = express();
var router = express.Router();


var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost/SS';

router.post('/Create', function (req, res) {

    var createFF = function (db) {

        db.collection('feedback').insert(
            {
                helpful: req.body.helpful,
                topic: req.body.topic,
                prep: req.body.prep,
                course: req.body.course
            },
            function (err, records) {
                if (err) {
                    console.log("DB ERROR");
                    res.send({success: false, error: err.toString()});
                } else if (records) {
                    console.log("added feedback", records);
                    res.send({success: true, message: records.toString()});
                } else {
                    console.log("something has gone terribly long");
                    res.send({success: false, message: "???", error: "???"});
                }
            });
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        createFF(db, function () {
            db.close();
        });
    });
});

router.post('/DeleteByID', function (req, res) {


    var deleteReminder = function(db){
        db.collection('reminder').deleteOne({_id: ObjectId(req.body._id)},function(err,results){
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
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        deleteReminder(db, function () {
            db.close();
        });
    });
});


router.post('/GetReminders',function(req,res){

    var getReminders = function(db) {
        var reminders = [];
        var cursor = db.collection('reminder').find({username: req.body.username});
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                //create an aray of all of the study groups
                console.log("REMMINDER!: ", doc);
                reminders.push(doc);
            } else {
                // send
                res.send({success: true, reminders: reminders});
            }
        });
    }
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        getReminders(db, function () {
            db.close();
        });
    });

});

module.exports = router;