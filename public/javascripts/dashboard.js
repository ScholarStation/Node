/**
 * Created by Michael on 2/10/2016.
 */
$(document).ready(function() {
    var url = "http://localhost:3000/ProfileUtility"; //where the post is made to. will need to be changed to antilizard.com:3000 when moved to server.
   // var usr = 'qwex';
    //var key = '41o89MLJ7VCm33GXGttVhCziIfiS0d';
    var usr = localStorage.getItem('username');
    var key = localStorage.getItem('key')
    var userData;
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {username: usr, KEY: key},
        success: function(result) {
            //alert("the username is: " + usr + " || and the key is: "+ key +" YOUR FIRST NAME IS - "+ result.fname);
            // fill the fields on the page with information from the returned document
            $("#first_name_output").val(result.fname);
            $("#last_name_output").val(result.lname);
            $("#major_output").val(result.major);
            $("#email_output").val(result.email);
            $("#gender_output").val(result.gender);
            $("#year_output").val(result.year);
            $("#age_output").val(result.age);
            document.getElementsByName("last_name_output").innerHTML = "test";
            //alert('got to success');

        },
        failure: function(){
            swal({title: "Error", text: "Could not get response from server", type: "error", confirmButtonText:"Cool"});
            alert("POST REQUEST FAILED.  browser -> server.");
        }
    });
});