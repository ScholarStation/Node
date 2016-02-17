/**
 * Created by Michael on 2/6/2016.
 *This file is responsible for the affects and actions on the login page.
 * -handles animations when page loads
 * =calls the server to validate users and redirects them to the appropriate page
 */






/**Another function for providing cool little animations for the login page
 */
$(document).ready(function() {

    var animating = false,
        submitPhase1 = 1100,
        submitPhase2 = 400,
        logoutPhase1 = 800,
        $login = $(".login"),
        $app = $(".app");

    function ripple(elem, e) {
        $(".ripple").remove();
        var elTop = elem.offset().top,
            elLeft = elem.offset().left,
            x = e.pageX - elLeft,
            y = e.pageY - elTop;
        var $ripple = $("<div class='ripple'></div>");
        $ripple.css({top: y, left: x});
        elem.append($ripple);
    };

    /** This provides the fancy spinning wheel at the bottom after pressing sign up
     */
    $(document).on("click", ".login__submit", function(e) {
        //console.log(" animating...");
        if (animating) return;
        animating = true;
        var that = this;
        ripple($(that), e);
        $(that).addClass("processing");
        setTimeout(function() {
            $(that).addClass("success");
            setTimeout(function() {
                $app.show();
                $app.css("top");
                $app.addClass("active");
            }, submitPhase2 - 70);
            setTimeout(function() {
                $login.hide();
                $login.addClass("inactive");
                animating = false;
                $(that).removeClass("success processing");
            }, submitPhase2);
        }, submitPhase1);

    });


    /** This isn't being used
     * - provides nice affects for logging out.
     */
    $(document).on("click", ".app__logout", function(e) {
        if (animating) return;
        $(".ripple").remove();
        animating = true;
        var that = this;
        $(that).addClass("clicked");
        setTimeout(function() {
            $app.removeClass("active");
            $login.show();
            $login.css("top");
            $login.removeClass("inactive");
        }, logoutPhase1 - 120);
        setTimeout(function() {
            $app.hide();
            animating = false;
            $(that).removeClass("clicked");
        }, logoutPhase1);
    });
});



/** This function fires when the user clicks submit.
 *  - This function will send a POST request to the servers script that verifies a user and allowes them to login.
 *  - Checks if the user was valid or not.
 *  - Alerts the user to an incorrect user.
 *
 */
$(document).on("click", ".login__submit", function(e) {
            // read the passwords from the web page....
            //login__input pass
            //login__input name
            var url = "http://localhost:3000/LoginApp"; // where the post is made to. will need to be changed to antilizard.com:3000 when moved to server
            var username;
            var password;
            var userData;

            $.ajax({
                    type: "POST",
                    url: url,
                    dataType: 'json',
                    data: {username: 'qweyx', password: 'pass1234'},
                    success: function(result) {
                        if(result.validate == true){

                        }
                        else{ // login utility could not validate user
                            swal({   title: "Login Failed!",   text: "Incorrect username or password!",   type: "error",   confirmButtonText: "Cool" });
                            location.reload();
                        }
                        //alert(result.validate);
                    },
                    failure: function(){
                        swal({   title: "Error",   text: "Could not get response from server",   type: "error",   confirmButtonText: "Cool" });
                        alert("POST REQUEST FAILED.  browser -> server.");
                    }
                    });
});