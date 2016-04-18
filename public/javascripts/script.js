/**
 * Created by Michael Moore
 */

(function(){

    var app = angular .module('dashboard-pageWrapper',[]);


    //-----------------------------Page/dashboard controller
    app.controller('DashboardController', function(){
        this.tab = 0; // this will be a default value leading to the profile page
        this.setTab = function(argument){
            console.log("user clicked tab: " +argument );
            this.tab=argument;
        };

        this.isSet = function(tab){
            return this.tab === tab;
        }
      this.testFunc = function(){
        console.log('pressed the button');
      };


    });

   //---------------------------------------------------profile stuff
    app.controller('ProfileController', function(){
        this.user = user; // sets be as the default user. it's Ben

        this.setUser = function(newUser){
            var newuser = newUser;
            console.log("newUser.fname = " + newuser.fname);
            this.user.fname = newUser.fname;
            this.user.lname = newUser.lname;
            this.user.email = newUser.email;
            this.user.gender = newUser.gender;
            this.user.major = newUser.major;
            this.user.age = newUser.age;

        };

        this.makeProfAPIcall = function(){
            var url = "http://localhost:3000/ProfileUtility"; //where the post is made to. will need to be changed to antilizard.com:3000 when moved to server.
            //var url = "http://antilizard.com:3000/ProfileUtility";
            // var usr = 'qwex';
            //var key = '41o89MLJ7VCm33GXGttVhCziIfiS0d';
            var usr = localStorage.getItem('username');
            var key = localStorage.getItem('key');
            var userData;
            $.ajax({
                type: "POST",
                url: url,
                dataType: 'json',
                data: {username: usr, KEY: key},
                success: function(result) {
                    //alert("the username is: " + usr + " || and the key is: "+ key +" YOUR FIRST NAME IS - "+ result.fname);
                    //this.user = result.;
                    //alert("this.user.fname = "+ this.user.firstname + " result.fname = "+ result.fname);
                    //this.user.firstname = result.fname;
                    //alert(result.fname + " " + result.lname);
                    //this.setUser(result)
                    //console.log(result.fname);
                    this.user = result;
                   // return result;
                    //alert("this.user.firstname = " + this.user.fname);

                },
                failure: function(){
                    swal({title: "Error", text: "Could not get response from server", type: "error", confirmButtonText:"Cool"});
                    alert("POST REQUEST FAILED.  browser -> server.");
                }
            });
        };
    });

    //----------------------------Study Groups
    /**
     *
     */
    app.controller('StudyController', function(){
        this.groups = [group1,group2,group3];


    });


    //---------------------------------------------
    //this is a default user
    var user =
        {
            fname: "BenClammin",
            lname: "Churchill",
            major: "SE",
            email: "bjc37@students.uwf.edu",
            gender: "whitehorse",
            year: "senior",
            age: 21,
            username: "qwex"
        }

    var user2t =
    {
        firstname: "Michael",
        lastname: "Moore",
        major: "CS",
        email: "mjm61@students.uwf.edu",
        gender: "space dragon",
        year: "senior",
        age: 22
    }

    var group1 = {
        course : "COP 4532",
        owner: "testOwner",
        topic: "this is the topic",
        date: "12/25/1993",
        time: "13:00",
        members: [
            "qwex",
            "hamhock",
            "satan"
        ],
        publicView: true
    }

    var group2 = {
        course : "COP 4532",
        owner: "qwex",
        topic: "this is the topic",
        date: "12/25/1993",
        time: "13:00",
        members: [
            "hamhock",
            "satan"
        ],
        publicView: true
    }

    var group3 = {
        course : "COP 4532",
        owner: "hamhock",
        topic: "this is the topic",
        date: "12/25/1993",
        time: "13:00",
        members: [
            "qwex",
            "hamhock",
            "satan"
        ],
        publicView: true
    }

})(); // end of closure
