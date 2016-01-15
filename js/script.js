var imageFile = null;
var daysArray = "";
var registerData = null;
var userCount = 0;
var userArray = new Array();
var existingUserArray = new Array();
var testObject = null;
var customDate = null;
var customString = null;
var customID = null;
var reverseDictionary = new Array();
var groupsArray = new Array();
var showYesterday = true;

/*var CustomView = Parse.View.extend({
	template: Handlebars.compile($('#custom-tpl').html()),
    events: {
        'submit .form-add': 'submit',
        'click .cancel' : 'cancel'
    },
    cancel: function(e){
    	e.preventDefault();

    	var data = $(e.target).serializeArray();

    	var scheduleView = new ScheduleView();
    	scheduleView.render();
    	$('.main-container').html(scheduleView.el);
    },
    submit: function(e){
        e.preventDefault();

        var data = $(e.target).serializeArray();

       	var custom = data[0].value;

       	if (! custom) {
       		alert("No data entered!");
       	} else {
       		$("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
       		var query = new Parse.Query("SchoolDayStructure");
       		query.equalTo("schoolDayID", window.customID);
       		query.first({
       			success: function(object) {
       				object.set("customSchedule", custom);
       				object.set("scheduleType", "*");
       				object.save(null, {
       					success: function() {
       						alert("Schedule successfully updated.");
							$("#spinnerDiv").html("");
							var scheduleView = new ScheduleView();
					    	scheduleView.render();
					    	$('.main-container').html(scheduleView.el);
					    },
					    error: function(error) {
					    	alert(error.code + " - " + error.message);
					    }
       				});
       			},
       			error: function(error) {
       				alert(error.code + " - " + error.message);
       			}
       		});
       	};
    },
    render: function(){
        this.$el.html(this.template());
    }
});

var ScheduleView = Parse.View.extend({
	template: Handlebars.compile($('#schedule-tpl').html()),
    events: {
        'submit .form-add': 'submit',
        'click .cancel' : 'cancel'
    },
    cancel: function(e){
    	e.preventDefault();

    	if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
			var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
		} else {
			var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
		};
    },
    submit: function(e){
        e.preventDefault();

        var data = $(e.target).serializeArray();

       	//
    },
    render: function(){
        this.$el.html(this.template());
    }
});

var AdminWelcomeView = Parse.View.extend({
    template: Handlebars.compile($('#admin-welcome-tpl').html()),
    events: {
        'click .add-ec' : 'addEC',
        'click .add-cs' : 'addCS',
        'click .add-poll' : 'addPoll',
        'click .add-alert' : 'addAlert',
        'click .register-ec' : 'registerEC',
        'click .user' : 'user',
        'click .schedule' : 'schedule'
    },
    addEC: function() {
    	var addECView = new AddECView();
    	addECView.render();
    	$('.main-container').html(addECView.el);
    },
    addCS: function() {
    	var addCSView = new AddCSView();
    	addCSView.render();
    	$('.main-container').html(addCSView.el);
    },
    addPoll: function() {
    	var addPollView = new AddPollView();
    	addPollView.render();
    	$('.main-container').html(addPollView.el);
    },
    addAlert: function() {
    	var addAlertView = new AddAlertView();
    	addAlertView.render();
    	$('.main-container').html(addAlertView.el);
    },
    registerEC: function() {
    	var registerECView = new RegisterECView();
    	registerECView.render();
    	$('.main-container').html(registerECView.el);
    },
    user: function() {
    	var userView = new UserView();
    	userView.render();
    	$('.main-container').html(userView.el);
    },
    schedule: function() {
    	var scheduleView = new ScheduleView();
    	scheduleView.render();
    	$('.main-container').html(scheduleView.el);
    },
    render: function(){
        var attributes = this.model.toJSON();
        this.$el.html(this.template(attributes));
    }
});

var FacultyWelcomeView = Parse.View.extend({
    template: Handlebars.compile($('#faculty-welcome-tpl').html()),
    events: {
        'click .add-news': 'addNews',
        'click .add-ec' : 'addEC',
        'click .register-ec' : 'registerEC'
    },
    addNews: function(){
        var addNewsView = new AddNewsView();
	    addNewsView.render();
	    $('.main-container').html(addNewsView.el);
    },
    addEC: function() {
    	var addECView = new AddECView();
    	addECView.render();
    	$('.main-container').html(addECView.el);
    },
    registerEC: function() {
    	var registerECView = new RegisterECView();
    	registerECView.render();
    	$('.main-container').html(registerECView.el);
    },
    render: function(){
        var attributes = this.model.toJSON();
        this.$el.html(this.template(attributes));
    }
});*/

var UserRegisterStructure = Parse.Object.extend("UserRegisterStructure", {
    create: function(firstName, lastName, email, confirmEmail, username, password, confirmPassword) {
        if (! firstName || ! lastName || ! username || ! password || ! email) {
            alert("Please ensure you have correctly filled out all required fields!");
            $("#signupButton").html("Register");
        } else if (email != confirmEmail) {
            alert("Your e-mail addresses do not match!");
            $("#signupButton").html("Register");
        } else if (password != confirmPassword) {
            alert("Your passwords do not match!");
            $("#signupButton").html("Register");
        } else if (email.indexOf("weymouthschools.org") === -1) {
            alert("Your e-mail address is not a valid faculty address!");
            $("#signupButton").html("Register");
        } else if (username.indexOf(" ") > -1) {
            alert("Your username cannot contain any spaces!");
            $("#signupButton").html("Register");
        } else if (password.indexOf(" ") > -1) {
            alert("Your password cannot contain any spaces!");
            $("#signupButton").html("Register");
        } else {
            $("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

            $("#signupButton").html("Checking availability...");
            Parse.Cloud.run("validateUser", { "username" : username , "email" : email }, {
                success: function(count) {
                    if (count > 0) {
                        alert("This username or e-mail has already been used. Please try again.");
                        $("#signupButton").html("Register");
                        $("#spinnerDiv").html("");
                    } else {
                        Parse.Cloud.run("encryptPassword", { "password" : password }, {
                            success: function(returnedObject) {
                                var object = new UserRegisterStructure();
                                //Generate key...
                                var string = "";
                                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                                for (var i = 0; i < 11; i++) {
                                    string += possible.charAt(Math.floor(Math.random() * possible.length));
                                };
                                object.save({
                                    'firstName' : firstName.toString(),
                                    'lastName' : lastName.toString(),
                                    'email' : email.toString(),
                                    'username' : username.toString(),
                                    'password' : returnedObject,
                                    'key' : string
                                },  {
                                    success: function(object) {
                                        alert("You have successfully registered your WildcatConnect account! A member of administration will approve your request and you will then receive a confirmation e-mail.");
                                        location.reload();
                                    },
                                    error: function(error) {
                                        alert(error);
                                        $("#signupButton").html("Register");
                                        $("#spinnerDiv").html("");
                                    }
                                });
                            },
                            error: function(error) {
                                alert(error);
                                $("#signupButton").html("Register");
                                $("#spinnerDiv").html("");
                            }
                        });
                    };
                },
                error: function(error) {
                    alert(error);
                    $("#signupButton").html("Register");
                    $("#spinnerDiv").html("");
                }
            });
        };
    }
});

/*var LoginView = Parse.View.extend({
    template: Handlebars.compile($('#login-tpl').html()),
    events: {
        'submit .form-signin': 'login',
        'submit .form-horizontal' : 'register',
        'click .forgot' : 'forgot' 
    },
    register: function(e) {
    	e.preventDefault();

    	var data = $(e.target).serializeArray();

    	var USR = new UserRegisterStructure();

    	USR.create(data[0].value, data[1].value, data[2].value, data[3].value, data[4].value);
    },
    login: function(e) {
 
        // Prevent Default Submit Event
        e.preventDefault();
 
        // Get data from the form and put them into variables
        var data = $(e.target).serializeArray(),
            username = data[0].value,
            password = data[1].value;
 
        $("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

        // Call Parse Login function with those variables
        Parse.User.logIn(username, password, {
            // If the username and password matches
            success: function(user) {
            	$("#spinnerDiv").html("");
                var verified = Parse.User.current().get("verified");
                if (verified === 0) {
                    var verifyView = new VerifyView();
                    verifyView.render();
                    $('.main-container').html(verifyView.el);
                } else {
                    if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
                        var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
                        welcomeView.render();
                        $('.main-container').html(welcomeView.el);
                    } else {
                        var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
                        welcomeView.render();
                        $('.main-container').html(welcomeView.el);
                    };
                    var div = document.getElementById('navbar');
                    div.innerHTML = div.innerHTML + '<ul class="nav navbar-nav navbar-right"><li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Account <span class="caret"></span></a><ul class="dropdown-menu"><li><a href="" id="changePassword">Change Password</a></li><li><a href="mailto:support@wildcatconnect.org">Report an issue</a></li><li role="separator" class="divider"></li><li><a href="" id="logOut">Log Out</a></li></ul></li></ul>';
                    location.reload();
                };
			},
            // If there is an error
            error: function(user, error) {
                if (error.code === 101) {
                	alert("Invalid username or password. Please try again.");
                    $("#spinnerDiv").html("");
                };
            }
        });
    },
    forgot: function(e) {
        e.preventDefault();    	var forgotView = new ForgotView();
	    forgotView.render();
	    $('.main-container').html(forgotView.el);
    },
    render: function(){
        this.$el.html(this.template());
    }
});

var ForgotView = Parse.View.extend({
    template: Handlebars.compile($('#forgot-tpl').html()),
    events: {
        'submit .form-signin' : 'submit',
        'click .cancel' : 'cancel'
    },
    submit: function(e) {
    	e.preventDefault();

    	var data = $(e.target).serializeArray();

    	var email = data[0].value;

    	if (! email) {
    		alert("You must enter a valid e-mail address.");
    	} else {
    		Parse.Cloud.run("recoverUser", { "email" : email }, {
    			success: function() {
    				alert("An e-mail will be sent to you at " + email + " with password reset instructions.");
    				location.reload();
    			},
    			error: function(error) {
    				alert(error.code + " - " + error.message);
    			}
    		});
    	};
    },
    cancel: function(e) {
    	e.preventDefault();
    	var loginView = new LoginView();
		loginView.render();
		$('.main-container').html(loginView.el);
    },
    render: function(){
        this.$el.html(this.template());
    }
});

var VerifyView = Parse.View.extend({
    template: Handlebars.compile($('#verify-tpl').html()),
    events: {
        'submit .form-signin' : 'submit',
        'click .cancel' : 'cancel'
    },
    submit: function(e) {
        e.preventDefault();

        var data = $(e.target).serializeArray();

        var newKey = data[0].value;

        if (newKey === Parse.User.current().get("key")) {
            alert("Registration complete! Welcome to WildcatConnect!");
            Parse.User.current().save({
                "verified" : 1
            }, {
                success: function(user) {
                    if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
                        var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
                        welcomeView.render();
                        $('.main-container').html(welcomeView.el);
                    } else {
                        var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
                        welcomeView.render();
                        $('.main-container').html(welcomeView.el);
                    };
                    var div = document.getElementById('navbar');
                    div.innerHTML = div.innerHTML + '<ul class="nav navbar-nav navbar-right"><li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Account <span class="caret"></span></a><ul class="dropdown-menu"><li><a href="" id="changePassword">Change Password</a></li><li><a href="mailto:support@wildcatconnect.org">Report an issue</a></li><li role="separator" class="divider"></li><li><a href="" id="logOut">Log Out</a></li></ul></li></ul>';
                    location.reload();
                },
                error: function(error) {
                    alert(error.code + " - " + error.message);
                    Parse.User.logOut();
                    var loginView = new LoginView();
                    loginView.render();
                    $('.main-container').html(loginView.el);
                    var div = document.getElementById('navbar');
                    div.innerHTML = "";
                } 
            });
        } else {
            alert("Incorrect registration key.");
            Parse.User.logOut();
            var loginView = new LoginView();
            loginView.render();
            $('.main-container').html(loginView.el);
            var div = document.getElementById('navbar');
            div.innerHTML = "";
        };
    },
    cancel: function(e) {
        e.preventDefault();
        event.preventDefault();
        Parse.User.logOut();
        var loginView = new LoginView();
        loginView.render();
        $('.main-container').html(loginView.el);
        var div = document.getElementById('navbar');
        div.innerHTML = "";
    },
    render: function(){
        this.$el.html(this.template());
    }
});

var AddNewsView = Parse.View.extend({
    template: Handlebars.compile($('#add-news-tpl').html()),
    events: {
        'submit .form-add': 'submit',
        'click .cancel' : 'cancel'
    },
    cancel: function(e){
    	e.preventDefault();

    	if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
			var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
		} else {
			var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
		};
    },
    submit: function(e){
        e.preventDefault();

        var data = $(e.target).serializeArray();

        var newsArticle = new NewsArticleStructure();

        newsArticle.create(data[0].value, data[1].value, document.getElementById('date').value, data[2].value, data[3].value);
    },
    render: function(){
        this.$el.html(this.template());
    }
});

var AddECView = Parse.View.extend({
	template: Handlebars.compile($('#add-ec-tpl').html()),
    events: {
        'submit .form-add': 'submit',
        'click .cancel' : 'cancel'
    },
    cancel: function(e){
    	e.preventDefault();

    	if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
			var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
		} else {
			var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
		};
    },
    submit: function(e){
        e.preventDefault();

        var data = $(e.target).serializeArray();

        var ECU = new ExtracurricularUpdateStructure();

        ECU.create(data[0].value, data[1].value);
    },
    render: function(){
        this.$el.html(this.template());
    }
});

var AddCSView = Parse.View.extend({
	template: Handlebars.compile($('#add-cs-tpl').html()),
    events: {
        'submit .form-add': 'submit',
        'click .cancel' : 'cancel'
    },
    cancel: function(e){
    	e.preventDefault();

    	if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
			var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
		} else {
			var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
		};
    },
    submit: function(e){
        e.preventDefault();

        var data = $(e.target).serializeArray();

        var CS = new CommunityServiceStructure();

        CS.create(data[0].value, data[1].value, data[2].value, data[3].value, data[4].value, data[5].value);
    },
    render: function(){
        this.$el.html(this.template());
    }
});

var AddPollView = Parse.View.extend({
	template: Handlebars.compile($('#add-poll-tpl').html()),
    events: {
        'submit .form-add': 'submit',
        'click .cancel' : 'cancel'
    },
    cancel: function(e){
    	e.preventDefault();

    	if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
			var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
		} else {
			var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
		};
    },
    submit: function(e){
        e.preventDefault();

        var data = $(e.target).serializeArray();

        var poll = new PollStructure();

        poll.create(data[0].value, data[1].value, data[2].value, choicesArray);
    },
    render: function(){
        this.$el.html(this.template());
    }
});

var AddAlertView = Parse.View.extend({
	template: Handlebars.compile($('#add-alert-tpl').html()),
    events: {
        'submit .form-add': 'submit',
        'click .cancel' : 'cancel'
    },
    cancel: function(e){
    	e.preventDefault();

    	if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
			var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
		} else {
			var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
		};
    },
    submit: function(e){
        e.preventDefault();

        var data = $(e.target).serializeArray();

       	var alert = new AlertStructure();

       	alert.create(data[0].value, Parse.User.current().get("firstName") + " " + Parse.User.current().get("lastName"), data[1].value, data[2].value, data[3].value, data[4].value);
    },
    render: function(){
        this.$el.html(this.template());
    }
});

var RegisterECView = Parse.View.extend({
	template: Handlebars.compile($('#reg-ec-tpl').html()),
    events: {
        'submit .form-add': 'submit',
        'click .cancel' : 'cancel'
    },
    cancel: function(e){
    	e.preventDefault();

    	if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
			var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
		} else {
			var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
		};
    },
    submit: function(e){
        e.preventDefault();

        var data = $(e.target).serializeArray();

       	var EC = new ExtracurricularStructure();

       	EC.create(data[0].value, data[1].value);
    },
    render: function(){
        this.$el.html(this.template());
    }
});

var UserView = Parse.View.extend({
	template: Handlebars.compile($('#user-tpl').html()),
    events: {
        'submit .form-add': 'submit',
        'click .cancel' : 'cancel'
    },
    cancel: function(e){
    	e.preventDefault();

    	if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
			var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
		} else {
			var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
		};
    },
    submit: function(e){
        e.preventDefault();

        var data = $(e.target).serializeArray();

       	//
    },
    render: function(){
        this.$el.html(this.template());
    }
});*/

var NewsArticleStructure = Parse.Object.extend("NewsArticleStructure", {
    create: function(title, author, date, summary, content) {
        if (! title || ! author || ! date || ! summary || ! content) {
            alert("Please ensure you have filled out all required fields!");
        } else {
            $("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
            var query = new Parse.Query("NewsArticleStructure");
            query.descending("articleID");
            query.first({
                success: function(structure) {
                    if (! structure) {
                        var articleID = 0;
                    } else {
                        var articleID = structure.get("articleID") + 1;
                    };
                    var object = new NewsArticleStructure();
                    if (window.imageFile === null) {
                        object.save({
                            'articleID' : articleID,
                            'authorString' : author,
                            'contentURLString' : content,
                            'dateString' : date,
                            'hasImage' : 0,
                            'imageFile' : null,
                            'likes' : 0,
                            'summaryString' : summary,
                            'titleString' : title,
                            'views' : 0
                        },  {
                            success: function(object) {
                                alert("Article successfully posted.");
                                window.location.replace("./index.html");
                            },
                            error: function(error) {
                                alert(error);
                                $("#spinnerDiv").html("");
                            }
                        });
                    } else {
                        object.save({
                            'articleID' : articleID,
                            'authorString' : author,
                            'contentURLString' : content,
                            'dateString' : date,
                            'hasImage' : 1,
                            'imageFile' : window.imageFile,
                            'likes' : 0,
                            'summaryString' : summary,
                            'titleString' : title,
                            'views' : 0
                        },  {
                            success: function(object) {
                                alert("Article successfully posted.");
                                window.location.replace("./index.html");
                            },
                            error: function(error) {
                                alert(error);
                                $("#spinnerDiv").html("");
                            }
                        });
                    };
                },
                error: function(error) {
                    alert(error);
                    $("#spinnerDiv").html("");
                }
            });
        };
    }
});

var ExtracurricularUpdateStructure = Parse.Object.extend("ExtracurricularUpdateStructure", {
    create: function(IDarray, message) {
        if (IDarray.length === 0 || ! message) {
            alert("Please ensure you have filled out all required fields!");
        } else {
            $("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
            var query = new Parse.Query("ExtracurricularUpdateStructure");
            query.descending("extracurricularUpdateID");
            query.first({
                success: function(structure) {
                    if (! structure) {
                        var theID = 0;
                    } else {
                        var theID = structure.get("extracurricularUpdateID") + 1;
                    };
                    var array = new Array();
                    for (var i = 0; i < IDarray.length; i++) {
                        var object = new ExtracurricularUpdateStructure();
                        object.set({
                            'extracurricularUpdateID' : theID + i,
                            'extracurricularID' : IDarray[i],
                            'messageString' : message
                        });
                        array.push(object);
                        Parse.Object.saveAll(array, {
                            success: function(array) {
                                alert("Update successfully posted.");
                                window.location.replace("./index.html");
                            },
                            error: function(error) {
                                alert(error.message);
                                $("#spinnerDiv").html("");
                            }
                        });
                    };
                },
                error: function(error) {
                    alert(error);
                    $("#spinnerDiv").html("");
                }
            });
        };
    }
});

var CommunityServiceStructure = Parse.Object.extend("CommunityServiceStructure", {
    create: function(title, startDateDate, startDateTime, endDateDate, endDateTime, message) {
        startDateTime = new Date(startDateDate + " " + startDateTime);
        startDateDate = new Date(startDateDate);
        endDateTime = new Date(endDateDate + " " + endDateTime);
        endDateDate = new Date(endDateDate);
        if (! title || ! startDateDate || ! startDateTime || ! endDateDate || ! startDateTime || ! message || startDateDate > endDateDate || (startDateDate.getDate() === endDateDate.getDate() && startDateTime > endDateTime)) {
            alert("Please ensure you have filled out all required fields!");
        } else {
            $("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
            var query = new Parse.Query("CommunityServiceStructure");
            query.descending("communityServiceID");
            query.first({
                success: function(structure) {
                    if (! structure) {
                        var theID = 0;
                    } else {
                        var theID = structure.get("communityServiceID") + 1;
                    };
                    var object = new CommunityServiceStructure();
                    var startDate = new Date(startDateDate.getFullYear(), startDateDate.getMonth(), startDateDate.getDate(), startDateTime.getHours(), startDateTime.getMinutes(), 0, 0);
                    var endDate = new Date(endDateDate.getFullYear(), endDateDate.getMonth(), endDateDate.getDate(), endDateTime.getHours(), endDateTime.getMinutes(), 0, 0);
                    object.save({
                        'communityServiceID' : theID,
                        'commTitleString' : title,
                        'commSummaryString' : message,
                        'startDate' : startDate,
                        'endDate' : endDate
                    },  {
                        success: function(object) {
                            alert("Update successfully posted.");
                            window.location.replace("./index.html");
                        },
                        error: function(error) {
                            alert(error);
                            $("#spinnerDiv").html("");
                        }
                    });
                },
                error: function(error) {
                    alert(error);
                    $("#spinnerDiv").html("");
                }
            });
        };
    }
});

var PollStructure = Parse.Object.extend("PollStructure", {
    create: function(title, question, daysSelect, choicesArray) {
        if (! title || ! question || ! daysSelect || ! choicesArray) {
            alert("Please ensure you have filled out all required fields!");
        } else {
            $("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
            var dictionary = {};
            for (var l = 0; l < choicesArray.length; l++) {
                dictionary[choicesArray[l].toString()] = "0";
            };
            var query = new Parse.Query("PollStructure");
            query.descending("pollID");
            query.first({
                success: function(structure) {
                    if (! structure) {
                        var pollID = 0;
                    } else {
                        var pollID = structure.get("pollID") + 1;
                    };
                    var object = new PollStructure();
                    object.save({
                        'pollID' : (parseInt(pollID)).toString(),
                        'pollTitle' : title,
                        'pollQuestion' : question,
                        'daysActive' : parseInt(daysSelect),
                        'totalResponses' : "0",
                        'pollMultipleChoices' : dictionary
                    },  {
                        success: function(object) {
                            alert("Poll successfully posted.");
                            window.location.replace("./index.html");
                        },
                        error: function(error) {
                            alert(error);
                            $("#spinnerDiv").html("");
                        }
                    });
                },
                error: function(error) {
                    alert(error);
                    $("#spinnerDiv").html("");
                }
            });
        };
    }
});

var AlertStructure = Parse.Object.extend("AlertStructure", {
    create: function(title, author, alertTiming, dateDate, dateTime, content) {
        dateTime = new Date(dateDate + " " + dateTime);
        dateDate = new Date(dateDate);
        if (! title || ! author || ! alertTiming || (alertTiming === "time" && (! dateDate || ! dateTime))) {
            alert("Please ensure you have correctly filled out all required fields!");
        } else {
            $("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
            var query = new Parse.Query("AlertStructure");
            query.descending("alertID");
            query.first({
                success: function(structure) {
                    var alertID = structure.get("alertID");
                    var object = new AlertStructure();
                    var month = new Array();
                    month[0] = "January";
                    month[1] = "February";
                    month[2] = "March";
                    month[3] = "April";
                    month[4] = "May";
                    month[5] = "June";
                    month[6] = "July";
                    month[7] = "August";
                    month[8] = "September";
                    month[9] = "October";
                    month[10] = "November";
                    month[11] = "December";
                    var alertDate = new Date(dateDate.getFullYear(), dateDate.getMonth(), dateDate.getDate(), dateTime.getHours(), dateTime.getMinutes(), 0, 0);
                    var now = new Date();
                    if (alertDate < now && alertTiming === "time") {
                        alert("Whoops! You can't send an alert in the past!");
                        $("#spinnerDiv").html("");
                    } else {
                        if (alertTiming === "now") {
                            var dateString = month[now.getMonth()] + " " + now.getDate().toString() + ", " + now.getFullYear().toString();
                            object.save({
                                'alertID' : alertID + 1,
                                'titleString' : title,
                                'authorString' : author,
                                'dateString' : dateString,
                                'isReady' : 1,
                                'views' : 0,
                                'alertTime' : null,
                                'contentString' : content,
                                'hasTime' : 0
                            },  {
                                success: function(object) {
                                    alert("Alert successfully posted.");
                                    window.location.replace("./index.html");
                                },
                                error: function(error) {
                                    alert(error);
                                    $("#spinnerDiv").html("");
                                }
                            });
                        } else if (alertTiming === "time") {
                            var dateString = month[alertDate.getMonth()] + " " + alertDate.getDate().toString() + ", " + alertDate.getFullYear().toString();
                            object.save({
                                'alertID' : alertID + 1,
                                'titleString' : title,
                                'authorString' : author,
                                'dateString' : dateString,
                                'isReady' : 0,
                                'views' : 0,
                                'alertTime' : alertDate,
                                'contentString' : content,
                                'hasTime' : 1
                            },  {
                                success: function(object) {
                                    alert("Alert successfully posted.");
                                    window.location.replace("./index.html");
                                },
                                error: function(error) {
                                    alert(error);
                                    $("#spinnerDiv").html("");
                                }
                            });
                        };  
                    };
                },
                error: function(error) {
                    alert(error);
                    $("#spinnerDiv").html("");
                }
            });
        };
    }
});

var ExtracurricularStructure = Parse.Object.extend("ExtracurricularStructure", {
    create: function(title, content) {
        if (! title || ! content) {
            alert("Please ensure you have correctly filled out all required fields!");
        } else {
            $("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
            var query = new Parse.Query("ExtracurricularStructure");
            query.descending("extracurricularID");
            query.equalTo("titleString", title);
            query.count({
                success: function(count) {
                    if (count > 0) {
                        alert("A group with this name has already been registered. Please enter a different name.");
                        $("#spinnerDiv").html("");
                    } else {
                        var queryTwo = new Parse.Query("ExtracurricularStructure");
                        queryTwo.descending("extracurricularID");
                        queryTwo.first({
                            success: function(structure) {
                                var ECID = structure.get("extracurricularID");
                                var object = new ExtracurricularStructure();
                                object.save({
                                    'extracurricularID' : ECID + 1,
                                    'titleString' : title,
                                    'descriptionString' : content,
                                    'hasImage' : 0,
                                    'meetingIDs' : window.daysArray.join("")
                                },  {
                                    success: function(object) {
                                        var ownedEC = Parse.User.current().get("ownedEC");
                                        ownedEC.push(object.get("extracurricularID"));
                                        Parse.User.current().save({
                                            'ownedEC' : ownedEC
                                        }, {
                                            success : function(user) {
                                                alert("Group successfully registered.");
                                                window.location.replace("./index.html");
                                            },
                                            error: function(error) {
                                                alert(error);
                                                $("#spinnerDiv").html("");
                                            }
                                        });
                                    },
                                    error: function(error) {
                                        alert(error);
                                        $("#spinnerDiv").html("");
                                    }
                                });
                            },
                            error: function(error) {
                                alert(error);
                                $("#spinnerDiv").html("");
                            }
                        });
                    };
                },
                error: function(error) {
                    alert(error.code + " - " + error.message);
                    $("#spinnerDiv").html("");
                }
            });
        };
    }
});

$(function() {
 
    Parse.$ = jQuery;
 
    Parse.initialize("cLBOvwh6ZTQYex37DSwxL1Cvg34MMiRWYAB4vqs0", "tTcV5Ns1GFdDda44FCcG5XHBDMbLA1sxRUzSnDgW");

    /*if (Parse.User.current()) {
        var verified = Parse.User.current().get("verified");
        if (verified === 0) {
            var verifyView = new VerifyView();
            verifyView.render();
            $('.main-container').html(verifyView.el);
        } else {
            if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
                var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
                welcomeView.render();
                $('.main-container').html(welcomeView.el);
            } else {
                var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
                welcomeView.render();
                $('.main-container').html(welcomeView.el);
            };
            var div = document.getElementById('navbar');
            div.innerHTML = div.innerHTML + '<ul class="nav navbar-nav navbar-right"><li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Account <span class="caret"></span></a><ul class="dropdown-menu"><li><a href="" id="changePassword">Change Password</a></li><li><a href="mailto:support@wildcatconnect.org">Report an issue</a></li><li role="separator" class="divider"></li><li><a href="" id="logOut">Log Out</a></li></ul></li></ul>';
        };
	} else {
		var loginView = new LoginView();
		loginView.render();
		$('.main-container').html(loginView.el);
	};*/

	$('#logOut').click(function() {
		event.preventDefault();
		Parse.User.logOut();
		window.location.replace("./login.html");
	});

	$('#changePassword').click(function() {
		var c = confirm("Are you sure you want to reset your password?");
		event.preventDefault();
		if (c == true) {
			Parse.User.requestPasswordReset(Parse.User.current().get("email"), {
			  success: function() {
			  	alert("Check your e-mail for password reset instructions!");
			  },
			  error: function(error) {
			    // Show the error message somewhere
			    alert("Error: " + error.code + " " + error.message);
			  }
			});
		};
	});

    $('.form-signin').submit(function() {
        event.preventDefault();
        var data = $(this).serializeArray(),
            username = data[0].value,
            password = data[1].value;

        $("#logIn").html("Signing in...");
 
        $("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

        Parse.User.logIn(username, password, {
            success: function(user) {
                $("#spinnerDiv").html("");
                var verified = Parse.User.current().get("verified");
                if (verified === 0) {
                    window.location.replace("./verify.html");
                } else {
                    window.location.replace("./index.html");
                };
            },
            // If there is an error
            error: function(user, error) {
                if (error.code === 101) {
                    alert("Invalid username or password. Please try again.");
                    $("#spinnerDiv").html("");
                };
            }
        });
    });

    $('.form-horizontal').submit(function() {
        event.preventDefault();

        var data = $(this).serializeArray();

        var USR = new UserRegisterStructure();

        USR.create(data[0].value, data[1].value, data[2].value, data[3].value, data[4].value, data[5].value, data[6].value);
    });

    $('.cancel').click(function() {
        event.preventDefault();

        history.back();
    });

    $('.cancel-schedule').click(function() {
        event.preventDefault();

        window.location.replace("./schedule.html");
    });

    $('.form-add-news').submit(function() {
        event.preventDefault();

        var data = $(this).serializeArray();
 
        var newsArticle = new NewsArticleStructure();

        newsArticle.create(data[0].value, data[1].value, document.getElementById('date').value, data[2].value, data[3].value);
    });

    $('.form-add-groupUpdate').submit(function() {
        event.preventDefault();

        var data = $(this).serializeArray();
 
        var ECU = new ExtracurricularUpdateStructure();

        ECU.create(window.groupsArray, data[data.length - 1].value);
    });

    $('.form-add-community').submit(function() {
        event.preventDefault();

        var data = $(this).serializeArray();
 
        var CS = new CommunityServiceStructure();

        CS.create(data[0].value, data[1].value, data[2].value, data[3].value, data[4].value, data[5].value);
    });

    $('.form-add-poll').submit(function() {
        event.preventDefault();

        var data = $(this).serializeArray();
 
        var poll = new PollStructure();

        poll.create(data[0].value, data[1].value, data[2].value, choicesArray);
    });

    $('.form-add-alert').submit(function() {
        event.preventDefault();

        var data = $(this).serializeArray();
 
        var alert = new AlertStructure();

        alert.create(data[0].value, Parse.User.current().get("firstName") + " " + Parse.User.current().get("lastName"), data[1].value, data[2].value, data[3].value, data[4].value);
    });

    $('.form-add-groupRegister').submit(function() {
        event.preventDefault();

        var data = $(this).serializeArray();
 
        var EC = new ExtracurricularStructure();

        EC.create(data[0].value, data[1].value);
    });

    $('.form-add-custom').submit(function() {
        event.preventDefault();

        var data = $(this).serializeArray();
 
        var description = data[0].value;
        var custom = data[1].value;

        if (! custom) {
            alert("No data entered!");
        } else {
            $("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
            var query = new Parse.Query("SchoolDayStructure");
            query.equalTo("schoolDayID", parseInt(localStorage.getItem("customID")));
            query.first({
                success: function(object) {
                    object.set("customString", description);
                    object.set("customSchedule", custom);
                    object.set("scheduleType", "*");
                    object.save(null, {
                        success: function() {
                            alert("Schedule successfully updated.");
                            $("#spinnerDiv").html("");
                            window.location.replace("./schedule.html");
                        },
                        error: function(error) {
                            alert(error.code + " - " + error.message);
                        }
                    });
                },
                error: function(error) {
                    alert(error.code + " - " + error.message);
                }
            });
        };
    });

});

function start(parameter) {
   return function()
   {
        window.imageFile = new Parse.File("image.png", parameter);
   }
}

function startTwo(parameter) {
   return function()
   {
        window.daysArray = parameter;
   }
}

function startThree(parameter) {
   return function()
   {
        window.groupsArray = parameter;
   }
}

function customView() {
    return function() {
          var parts = localStorage.getItem("customDate").split('-');
          var date = new Date(parts[2], parts[0]-1,parts[1]);
          var string = date.toString('dddd, MMMM d, yyyy');
          $("#topLabel").html("Custom Schedule - " + string);
          $('#customArea').val(localStorage.getItem("customString"));
          $('#scheduleDescription').val(localStorage.getItem("customDescription"));
    }
}

function loadNewUserTable() {
	return function() {
		$("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
		var query = new Parse.Query("UserRegisterStructure");
		query.ascending("lastName");
		query.find({
			success: function(structures) {

				$("#newLabel").html("New User Requests (" + structures.length+")");

				var tableDiv = document.getElementById("newUsers");
				var table = document.createElement("TABLE");
				var tableBody = document.createElement("TBODY");

				$("#newUsers").html("");

				table.appendChild(tableBody);
				table.className = "table table-striped";

				var heading = new Array();
				heading[0] = "Last Name";
				heading[1] = "First Name";
				heading[2] = "E-Mail";
				heading[3] = "Action";

				//TABLE COLUMNS

				var tr = document.createElement("TR");
				tableBody.appendChild(tr);

				for (var i = 0; i < heading.length; i++) {
					var th = document.createElement("TH");
					th.width = '25%';
					th.appendChild(document.createTextNode(heading[i]));
					tr.appendChild(th);
				};

				window.userArray = new Array();

				for (var i = 0; i < structures.length; i++) {
					window.userArray.push(structures[i]);
					var tr = document.createElement("TR");
					var tdTwo = document.createElement("TD");
					tdTwo.appendChild(document.createTextNode(structures[i].get("lastName")));
					tr.appendChild(tdTwo);
					var tdOne = document.createElement("TD");
					tdOne.appendChild(document.createTextNode(structures[i].get("firstName")));
					tr.appendChild(tdOne);
					var tdThree = document.createElement("TD");
					tdThree.innerHTML = '<a href="mailto:'+structures[i].get("email")+'">'+structures[i].get("email")+'</a>';
					tr.appendChild(tdThree);
					var tdFour = document.createElement("TD");
					var button =document.createElement("INPUT");
					button.type = "button";
					button.className = "approveUser btn btn-lg btn-primary";
					button.value = "Approve";
					button.name = i;
					button.style.marginRight = "10px";
					button.onclick = (function() {
					    var count = i;

					    return function(e) {
					        
					    	//Approve the user at i

					    	$("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

					    	var user = window.userArray[count];

					    	var password = user.get("password");
                            var key = user.get("key");

							Parse.Cloud.run("decryptPassword", { "password" : password}, {
								success: function(here) {
									Parse.Cloud.run('registerUser', { "username" : user.get("username") , "password" : here , "email" : user.get("email") , "firstName" : user.get("firstName") , "lastName" : user.get("lastName"), "key" : key }, {
									  success: function() {
									    $("#spinnerDiv").html("");
									    alert("User approved!");
									    $(document).ready(loadNewUserTable());
										$(document).ready(loadExistingUserTable());
									  },
									  error: function(error) {
									    alert(error);
									  }
									});
								},
								error: function(error) {
									alert(error.message);
								}
							});
					    };
					})();
					tdFour.appendChild(button);
					var buttonTwo =document.createElement("INPUT");
					buttonTwo.type = "button";
					buttonTwo.className = "approveUser btn btn-lg btn-primary";
					buttonTwo.value = "Deny";
					button.name = i;
					buttonTwo.style.marginRight = "10px";
					buttonTwo.onclick = (function() {
					    var count = i;

					    return function(e) {
					        
					    	$("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

					    	var user = window.userArray[count];

					    	var query = new Parse.Query("UserRegisterStructure");
					    	query.equalTo("username", user.get("username"));
					    	query.first({
					    		success: function(object) {
					    			object.destroy({
					    				success: function(object) {
					    					alert("User successfully denied request.");
										    $("#spinnerDiv").html("");
										    $(document).ready(loadNewUserTable());
											$(document).ready(loadExistingUserTable());
					    				},
					    				error: function(error) {
					    					alert(error);
					    					$("#spinnerDiv").html("");
					    				}
					    			});
					    		},
					    		error: function(error) {
					    			alert(error);
					    			$("#spinnerDiv").html("");
					    		}
					    	});

					    };
					})();
					tdFour.appendChild(buttonTwo);
					tr.appendChild(tdFour);
					tableBody.appendChild(tr);

					tableDiv.appendChild(table);
				};
			},
			error: function(error) {
				alert(error);
			}
		});
	}
}

function loadExistingUserTable() {
	return function() {
		var query = new Parse.Query("User");
		query.ascending("lastName");
		query.find({
			success: function(structures) {

				$("#existingLabel").html("Existing Users (" + structures.length+")");

				var tableDiv = document.getElementById("existingUsers");
				var table = document.createElement("TABLE");
				var tableBody = document.createElement("TBODY");

				table.appendChild(tableBody);
				table.className = "table table-striped";
                table.id = "userTable";

				var heading = new Array();
				heading[0] = "Last Name";
				heading[1] = "First Name";
				heading[2] = "E-Mail";
                heading[3] = "User Type";
                heading[4] = "Change Type";
				heading[5] = "Action";

				//TABLE COLUMNS

				var tr = document.createElement("TR");
				tableBody.appendChild(tr);

				$("#existingUsers").html("");

				for (var i = 0; i < heading.length; i++) {
					var th = document.createElement("TH");
					th.width = '17%';
					th.appendChild(document.createTextNode(heading[i]));
					tr.appendChild(th);
				};

				window.existingUserArray = new Array();

				for (var i = 0; i < structures.length; i++) {
					window.existingUserArray.push(structures[i]);
					var tr = document.createElement("TR");
					var tdTwo = document.createElement("TD");
					tdTwo.appendChild(document.createTextNode(structures[i].get("lastName")));
					tr.appendChild(tdTwo);

					var tdOne = document.createElement("TD");
					tdOne.appendChild(document.createTextNode(structures[i].get("firstName")));
					tr.appendChild(tdOne);

					var tdOther = document.createElement("TD");
					tdOther.innerHTML = '<a href="mailto:'+structures[i].get("email")+'">'+structures[i].get("email")+'</a>';
					tr.appendChild(tdOther);

                    var tdType = document.createElement("TD");
                    tdType.appendChild(document.createTextNode(structures[i].get("userType")));
                    tr.appendChild(tdType);

                    var tdThree = document.createElement("TD");
                    var selectList = document.createElement("SELECT");
                    selectList.name = "typeSelect";
                    var option = document.createElement("option");
                    option.value = -1;
                    option.text = "NONE SELECTED";
                    selectList.appendChild(option);

                    var theArray = ["Developer", "Administration", "Faculty"];

                    for (var j = 0; j < theArray.length; j++) {
                        var option = document.createElement("option");
                        option.value = j;
                        option.text = theArray[j];
                        selectList.appendChild(option);
                    }
                    selectList.onchange = (function() {

                        var count = i;

                        return function(e) {

                            var key = theArray[this.selectedIndex - 1];

                            structures[count].set("userType", key);
                            structures[count].save(null, {
                                success: function(object) {
                                    if (object.get("email") === Parse.User.current().get("email")) {
                                        Parse.User.current().fetch({
                                            success: function() {
                                                alert("User successfully updated.");
                                                $("#spinnerDiv").html("");
                                                $(document).ready(loadExistingUserTable());
                                            },
                                            error: function(error) {
                                                alert(error.code + " - " + error.message);
                                            }
                                        });
                                    } else {
                                        alert("User successfully updated.");
                                        $("#spinnerDiv").html("");
                                        $(document).ready(loadExistingUserTable());
                                    };
                                },
                                error: function(error) {
                                    alert(error.code + " - " + error.message);
                                }
                            });

                        };
                    })();
                    tdThree.appendChild(selectList);
                    tr.appendChild(tdThree);

					var tdFour = document.createElement("TD");
					var button =document.createElement("INPUT");
					button.type = "button";
					button.className = "approveUser btn btn-lg btn-primary";
					button.value = "Delete";
					button.name = i;
					button.style.marginRight = "10px";
					button.onclick = (function() {
					    var count = i;

					    return function(e) {
					        
					    	var user = window.existingUserArray[count];

                            var c = confirm("Are you sure you want to delete " + user.get("firstName") + " " + user.get("lastName") + " as a user?");
                            event.preventDefault();
                            if (c == true) {
                                $("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

                                Parse.Cloud.run('deleteUser', { "username" : user.get("username") }, {
                                  success: function() {
                                    alert("User successfully deleted.");
                                    $("#spinnerDiv").html("");
                                    $(document).ready(loadNewUserTable());
                                    $(document).ready(loadExistingUserTable());
                                  },
                                  error: function(error) {
                                    alert(error);
                                    $("#spinnerDiv").html("");
                                  }
                                });
                            };

					    };
					})();
					tdFour.appendChild(button);
					tr.appendChild(tdFour);
					tableBody.appendChild(tr);

					tableDiv.appendChild(table);
				};

				$("#spinnerDiv").html("");
			},
			error: function(error) {
				alert(error);
			}
		});
	}
}

function loadScheduleTable() {
	return function() {

		$("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

		var dictionary = [];

		var firstQuery = new Parse.Query("ScheduleType");
		firstQuery.ascending("typeID");
		firstQuery.find({
			success: function(objects) {
				for (var j = 0; j < objects.length; j++) {
					var key = objects[j].get("typeID");
					var value = objects[j].get("fullScheduleString");
					dictionary[key] = value;
					reverseDictionary[j] = key;
				};
				var query = new Parse.Query("SchoolDayStructure");
				query.equalTo("isActive", 1);
				query.ascending("schoolDayID");
                var structures = new Array();
				query.find({
					success: function(theStructures) {

                        var queryTwo = new Parse.Query("SchoolDayStructure");
                        queryTwo.equalTo("isActive", 0);
                        queryTwo.descending("schoolDayID");

                        queryTwo.first({
                            success: function(day) {

                                if (day.get("scheduleType") != theStructures[0].get("scheduleType")) {
                                    structures.push(day);
                                };

                                for (var i = 0; i < theStructures.length; i++) {
                                    structures.push(theStructures[i]);
                                };

                                $("#titleLabel").html("Available School Days (" + structures.length+")");

                                var tableDiv = document.getElementById("schedules");
                                var table = document.createElement("TABLE");
                                var tableBody = document.createElement("TBODY");

                                table.appendChild(tableBody);
                                table.className = "table table-striped";

                                var heading = new Array();
                                heading[0] = "Date";
                                heading[1] = "Schedule Type";
                                heading[2] = "Change Type";
                                heading[3] = "Custom Action";

                                //TABLE COLUMNS

                                var tr = document.createElement("TR");
                                tableBody.appendChild(tr);

                                $("#schedules").html("");

                                for (var i = 0; i < heading.length; i++) {
                                    var th = document.createElement("TH");
                                    th.width = '25%';
                                    th.appendChild(document.createTextNode(heading[i]));
                                    tr.appendChild(th);
                                };

                                window.existingUserArray = new Array();

                                for (var i = 0; i < structures.length; i++) {
                                    window.existingUserArray.push(structures[i]);
                                    var tr = document.createElement("TR");
                                    var tdTwo = document.createElement("TD");
                                    var parts = structures[i].get("schoolDate").split('-');
                                    var date = new Date(parts[2], parts[0]-1,parts[1]);
                                    var string = date.toString('dddd, MMMM d, yyyy');
                                    tdTwo.appendChild(document.createTextNode(string));
                                    var today = new Date();
                                    var todayString = today.toString('dddd, MMMM d, yyyy');
                                    if (todayString === string) {
                                        tdTwo.style.color = 'red';
                                    } else if (i == 0) {
                                        tdTwo.appendChild(document.createTextNode(" - LAST SCHOOL DAY")); 
                                    }
                                    tr.appendChild(tdTwo);

                                    //Schedule Type

                                    var schedule = structures[i].get("scheduleType");

                                    if (schedule === "*") {
                                        var tdOne = document.createElement("TD");
                                        tdOne.appendChild(document.createTextNode("CUSTOM SCHEDULE - " + structures[i].get("customString")));
                                        tdOne.style.fontWeight = 'bold';
                                        tr.appendChild(tdOne);
                                    } else {
                                        var actual = dictionary[schedule];
                                        var tdOne = document.createElement("TD");
                                        tdOne.appendChild(document.createTextNode(actual));
                                        tr.appendChild(tdOne);
                                    };

                                    var tdThree = document.createElement("TD");
                                    var selectList = document.createElement("SELECT");
                                    selectList.name = "typeSelect";
                                    var option = document.createElement("option");
                                    option.value = -1;
                                    option.text = "NONE SELECTED";
                                    selectList.appendChild(option);
                                    for (var j = 0; j < Object.keys(dictionary).length; j++) {
                                        var option = document.createElement("option");
                                        option.value = j;
                                        option.text = dictionary[Object.keys(dictionary)[j]];
                                        selectList.appendChild(option);
                                    }
                                    selectList.onchange = (function() {

                                        var count = i;

                                        return function(e) {

                                            var key = reverseDictionary[this.selectedIndex - 1];

                                            structures[count].set("scheduleType", key);
                                            structures[count].set("customSchedule", "None.");
                                            structures[count].set("customString", "");
                                            structures[count].save(null, {
                                                success: function(object) {
                                                    alert("Schedule successfully updated.");
                                                    $("#spinnerDiv").html("");
                                                    $(document).ready(loadScheduleTable());
                                                },
                                                error: function(error) {
                                                    alert(error.code + " - " + error.message);
                                                    $("#spinnerDiv").html("");
                                                }
                                            });

                                        };
                                    })();
                                    tdThree.appendChild(selectList);
                                    tr.appendChild(tdThree);

                                    var tdFour = document.createElement("TD");

                                    if (i < 2) {
                                        var button =document.createElement("INPUT");
                                        button.type = "button";
                                        button.className = "approveUser btn btn-lg btn-primary";
                                        button.value = "Snow Day";
                                        button.name = i;
                                        button.style.marginBottom = "10px";
                                        button.onclick = (function() {

                                            var count = i;

                                            return function(e) {

                                                if (count != structures.length - 1) {
                                                    if (count === 0) {
                                                        window.showYesterday = false;
                                                    };
                                                    $("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
                                                    Parse.Cloud.run('snowDay', { "ID" : structures[count].get("schoolDayID") }, {
                                                      success: function() {
                                                        alert("Schedule successfully updated.");
                                                        $("#spinnerDiv").html("");
                                                        $(document).ready(loadScheduleTable());
                                                      },
                                                      error: function(error) {
                                                        alert(error);
                                                        $("#spinnerDiv").html("");
                                                      }
                                                    });
                                                } else {
                                                    alert("You can't go back one day from here! This is the last day in the available queue.");
                                                };

                                            };
                                        })();
                                        tdFour.appendChild(button);
                                        tr.appendChild(tdFour);
                                    };

                                    var buttonTwo =document.createElement("INPUT");
                                    buttonTwo.type = "button";
                                    buttonTwo.className = "approveUser btn btn-lg btn-primary";
                                    buttonTwo.value = "Edit Custom Schedule";
                                    button.name = i;
                                    buttonTwo.style.marginRight = "10px";
                                    buttonTwo.onclick = (function() {
                                        var count = i;

                                        return function(e) {

                                            if (structures[count].get("scheduleType") === "*") {
                                                localStorage.setItem("customString", structures[count].get("customSchedule"));
                                            } else {
                                                localStorage.setItem("customString", "Period 1: \nPeriod 2: \nPeriod 3: \nPeriod 4: \n1st: \n2nd: \n3rd: \nPeriod 6: \nPeriod 7: ");
                                            };

                                            localStorage.setItem("customID", structures[count].get("schoolDayID"));

                                            localStorage.setItem("customDate", structures[count].get("schoolDate"));

                                            localStorage.setItem("customDescription", structures[count].get("customString"));     

                                            window.location.replace("./custom.html");                       

                                        };
                                    })();
                                    tdFour.appendChild(buttonTwo);
                                    tr.appendChild(tdFour);
                                    tableBody.appendChild(tr);

                                    tableDiv.appendChild(table);
                                };

                                $("#spinnerDiv").html("");
                            },
                            error: function(error) {
                                alert(error.code + " - " + error.message);
                                $("#spinnerDiv").html("");
                            }
                        });
					},
					error: function(error) {
						$("#spinnerDiv").html("");
						alert(error);
					}
				});
			},
			error: function(error) {
				$("#spinnerDiv").html("");
				alert(error);
			}
		});
	}
}