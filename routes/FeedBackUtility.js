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
