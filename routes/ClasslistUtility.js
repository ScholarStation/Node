/**
 * Created by bjc90_000 on 3/29/2016.
 */
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost/SS';

router.post('/Create',function(req,res){
    var createList = function(db){

        var initArray = req.body.list;

        initArray.forEach(function(course){
           db.collection('courseList').insert({courseName:course},function(err,records){
               if(err){
                   console.log("DB ERROR");
                   res.send({success:false,error:err});
               }else if(records){
                   console.log("added course",records);
                   res.send({success:true,message:records});
               }else{
                   console.log("something has gone terribly long");
                   res.send({success:false,message:"???",error:"???"});
               }
           });
        },this);//dont know if this will work exactly
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        createList(db, function () {
            db.close();
        });
    });
});

router.post('/GetList', function(req,res){

    var getList = function(db){
        var cursor =db.collection('courseList').find();
        var courseListArray
        cursor.each(function(err,doc){
            if(err){
                console.log("DB ERROR");
                res.send({success:false,error:err});
            }else if (doc!=null){
               courseListArray.push(doc);
            }else{
                res.send({courseListNames:courseListArray});
            }
        });
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        getList(db, function () {
            db.close();
        });
    });
});



module.exports = router;