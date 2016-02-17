/**
 * Created by bjc90_000 on 2/17/2016.
 */

var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost/SS';

router.post('/Create',function(req,res){
    //Key Auth


    var NewStudyGroup =
    {
        course:req.body.course,
        owner:req.body.owner,
        topic:req.body.topic,
        date:req.body.date,
        time:req.body.time,
        members:req.body.members
    }


    db.collection("study").insert(NewStudyGroup,function(err,records){
        //Callback for insert
        if(err){

        }else{
            console.log("Created a new study Group: "+records);

        }




    });

});