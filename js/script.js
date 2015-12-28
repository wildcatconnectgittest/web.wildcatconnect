var imageFile = null;
var daysArray = "";
var registerData = null;
var userCount = 0;
var userArray = new Array();
var existingUserArray = new Array();
var testObject = null;

$(function() {
 
    Parse.$ = jQuery;
 
    Parse.initialize("cLBOvwh6ZTQYex37DSwxL1Cvg34MMiRWYAB4vqs0", "tTcV5Ns1GFdDda44FCcG5XHBDMbLA1sxRUzSnDgW");

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
						var articleID = structure.get("articleID");
						var object = new NewsArticleStructure();
						if (window.imageFile === null) {
							object.save({
								'articleID' : articleID + 1,
								'authorString' : author,
								'contentURLString' : content,
								'dateString' : date,
								'hasImage' : 0,
								'imageFile' : null,
								'likes' : 0,
								'summaryString' : summary,
								'titleString' : title,
								'views' : 0
							},	{
								success: function(object) {
									alert("Article successfully posted.");
									if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
										var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
									    welcomeView.render();
									    $('.main-container').html(welcomeView.el);
									    $("#spinnerDiv").html("");
									} else {
										var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
									    welcomeView.render();
									    $('.main-container').html(welcomeView.el);
									    $("#spinnerDiv").html("");
									};
								},
								error: function(error) {
									alert(error);
									$("#spinnerDiv").html("");
								}
							});
						} else {
							object.save({
								'articleID' : articleID + 1,
								'authorString' : author,
								'contentURLString' : content,
								'dateString' : date,
								'hasImage' : 1,
								'imageFile' : window.imageFile,
								'likes' : 0,
								'summaryString' : summary,
								'titleString' : title,
								'views' : 0
							},	{
								success: function(object) {
									alert("Article successfully posted.");
									if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
										var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
									    welcomeView.render();
									    $('.main-container').html(welcomeView.el);
									    $("#spinnerDiv").html("");
									} else {
										var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
									    welcomeView.render();
									    $('.main-container').html(welcomeView.el);
									    $("#spinnerDiv").html("");
									};
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
		create: function(ID, message) {
			if (parseInt(ID) < 0 || ! message) {
				alert("Please ensure you have filled out all required fields!");
			} else {
				$("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
				var query = new Parse.Query("ExtracurricularUpdateStructure");
				query.descending("extracurricularUpdateID");
				query.first({
					success: function(structure) {
						var theID = structure.get("extracurricularUpdateID");
						var object = new ExtracurricularUpdateStructure();
						object.save({
							'extracurricularUpdateID' : theID + 1,
							'extracurricularID' : parseInt(ID),
							'messageString' : message
						},	{
							success: function(object) {
								alert("Update successfully posted.");
								if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
									var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
								    welcomeView.render();
								    $('.main-container').html(welcomeView.el);
								    $("#spinnerDiv").html("");
								} else {
									var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
								    welcomeView.render();
								    $('.main-container').html(welcomeView.el);
								    $("#spinnerDiv").html("");
								};
							},
							error: function(error) {
								alert(error.message);
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

	var CommunityServiceStructure = Parse.Object.extend("CommunityServiceStructure", {
		create: function(title, startDateDate, startDateTime, endDateDate, endDateTime, message) {
			startDateTime = new Date(startDateDate + " " + startDateTime);
			startDateDate = new Date(startDateDate);
			endDateTime = new Date(endDateDate + " " + endDateTime);
			endDateDate = new Date(endDateDate);
			if (! title || ! startDateDate || ! startDateTime || ! endDateDate || ! startDateTime || ! message) {
				alert("Please ensure you have filled out all required fields!");
			} else {
				$("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
				var query = new Parse.Query("CommunityServiceStructure");
				query.descending("communityServiceID");
				query.first({
					success: function(structure) {
						var theID = structure.get("communityServiceID");
						var object = new CommunityServiceStructure();
						var startDate = new Date(startDateDate.getFullYear(), startDateDate.getMonth(), startDateDate.getDate(), startDateTime.getHours(), startDateTime.getMinutes(), 0, 0);
						var endDate = new Date(endDateDate.getFullYear(), endDateDate.getMonth(), endDateDate.getDate(), endDateTime.getHours(), endDateTime.getMinutes(), 0, 0);
						object.save({
							'communityServiceID' : theID + 1,
							'commTitleString' : title,
							'commSummaryString' : message,
							'startDate' : startDate,
							'endDate' : endDate
						},	{
							success: function(object) {
								alert("Update successfully posted.");
								if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
									var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
								    welcomeView.render();
								    $('.main-container').html(welcomeView.el);
								    $("#spinnerDiv").html("");
								} else {
									var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
								    welcomeView.render();
								    $('.main-container').html(welcomeView.el);
								    $("#spinnerDiv").html("");
								};
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
						var pollID = structure.get("pollID");
						var object = new PollStructure();
						object.save({
							'pollID' : (parseInt(pollID) + 1).toString(),
							'pollTitle' : title,
							'pollQuestion' : question,
							'daysActive' : parseInt(daysSelect),
							'totalResponses' : "0",
							'pollMultipleChoices' : dictionary
						},	{
							success: function(object) {
								alert("Poll successfully posted.");
								if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
									var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
								    welcomeView.render();
								    $('.main-container').html(welcomeView.el);
								    $("#spinnerDiv").html("");
								} else {
									var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
								    welcomeView.render();
								    $('.main-container').html(welcomeView.el);
								    $("#spinnerDiv").html("");
								};
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
			var before = dateTime < new Date();
			if (! title || ! author || ! alertTiming || (alertTiming === "time" && (! dateDate || ! dateTime)) || before === true) {
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
						if (alertTiming === "now") {
							var now = new Date();
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
							},	{
								success: function(object) {
									alert("Alert successfully posted.");
									if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
										var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
									    welcomeView.render();
									    $('.main-container').html(welcomeView.el);
									    $("#spinnerDiv").html("");
									} else {
										var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
									    welcomeView.render();
									    $('.main-container').html(welcomeView.el);
									    $("#spinnerDiv").html("");
									};
								},
								error: function(error) {
									alert(error);
									$("#spinnerDiv").html("");
								}
							});
						} else if (alertTiming === "time") {
							var alertDate = new Date(dateDate.getFullYear(), dateDate.getMonth(), dateDate.getDate(), dateTime.getHours(), dateTime.getMinutes(), 0, 0);
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
							},	{
								success: function(object) {
									alert("Alert successfully posted.");
									if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
										var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
									    welcomeView.render();
									    $('.main-container').html(welcomeView.el);
									    $("#spinnerDiv").html("");
									} else {
										var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
									    welcomeView.render();
									    $('.main-container').html(welcomeView.el);
									    $("#spinnerDiv").html("");
									};
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

	var ExtracurricularStructure = Parse.Object.extend("ExtracurricularStructure", {
		create: function(title, content) {
			if (! title || ! content) {
				alert("Please ensure you have correctly filled out all required fields!");
			} else {
				$("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
				var query = new Parse.Query("ExtracurricularStructure");
				query.descending("extracurricularID");
				query.first({
					success: function(structure) {
						var ECID = structure.get("extracurricularID");
						var object = new ExtracurricularStructure();
						object.save({
							'extracurricularID' : ECID + 1,
							'titleString' : title,
							'descriptionString' : content,
							'hasImage' : 0,
							'imageFile' : null,
							'meetingIDs' : window.daysArray.join(""),
							'channelString' : "E" + (ECID + 1).toString()
						},	{
							success: function(object) {
								if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
									alert("Group successfully registered.");
									var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
								    welcomeView.render();
								    $('.main-container').html(welcomeView.el);
								    $("#spinnerDiv").html("");
								} else {
									var ownedEC = Parse.User.current().get("ownedEC");
									ownedEC.push("E" + object.get("extracurricularID").toString());
									Parse.User.current().save({
										'ownedEC' : ownedEC
									}, {
										success : function(user) {
											alert("Group successfully registered.");
											var welcomeView = new FacultyWelcomeView({ model: Parse.User.current() });
										    welcomeView.render();
										    $('.main-container').html(welcomeView.el);
										    $("#spinnerDiv").html("");
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
					},
					error: function(error) {
						alert(error);
						$("#spinnerDiv").html("");
					}
				});
			};
		}
	});

	var UserRegisterStructure = Parse.Object.extend("UserRegisterStructure", {
		create: function(firstName, lastName, email, username, password) {
			if (! firstName || ! lastName || ! username || ! password || ! email) {
				alert("Please ensure you have correctly filled out all required fields!");
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
									object.save({
										'firstName' : firstName.toString(),
										'lastName' : lastName.toString(),
										'email' : email.toString(),
										'username' : username.toString(),
										'password' : returnedObject
									},	{
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

	var LoginView = Parse.View.extend({
	    template: Handlebars.compile($('#login-tpl').html()),
	    events: {
	        'submit .form-signin': 'login',
	        'submit .form-horizontal' : 'register'
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
					div.innerHTML = div.innerHTML + '<ul class="nav navbar-nav navbar-right"><li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Account<span class="caret"></span></a><ul class="dropdown-menu"><li><a href="" id="changePassword">Change Password</a></li><li><a href="mailto:support@wildcatconnect.org">Report an issue</a></li><li role="separator" class="divider"></li><li><a href="" id="logOut">Log Out</a></li></ul></li></ul>';
					location.reload();
				},
	            // If there is an error
	            error: function(user, error) {
	                if (error.code === 101) {
	                	alert("Invalid username or password. Please try again.");
	                };
	            }
	        });
	    },
	    render: function(){
	        this.$el.html(this.template());
	    }
	}),
    AdminWelcomeView = Parse.View.extend({
        template: Handlebars.compile($('#admin-welcome-tpl').html()),
	    events: {
	        'click .add-news': 'addNews',
	        'click .add-ec' : 'addEC',
	        'click .add-cs' : 'addCS',
	        'click .add-poll' : 'addPoll',
	        'click .add-alert' : 'addAlert',
	        'click .register-ec' : 'registerEC',
	        'click .user' : 'user'
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
	});

	if (Parse.User.current()) {
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
		div.innerHTML = div.innerHTML + '<ul class="nav navbar-nav navbar-right"><li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Account<span class="caret"></span></a><ul class="dropdown-menu"><li><a href="" id="changePassword">Change Password</a></li><li><a href="mailto:support@wildcatconnect.org">Report an issue</a></li><li role="separator" class="divider"></li><li><a href="" id="logOut">Log Out</a></li></ul></li></ul>';
	} else {
		var loginView = new LoginView();
		loginView.render();
		$('.main-container').html(loginView.el);
	};

	$('#logOut').click(function() {
		event.preventDefault();
		Parse.User.logOut();
		var loginView = new LoginView();
		loginView.render();
		$('.main-container').html(loginView.el);
		var div = document.getElementById('navbar');
		div.innerHTML = "";
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

							Parse.Cloud.run("decryptPassword", { "password" : password }, {
								success: function(here) {
									Parse.Cloud.run('registerUser', { "username" : user.get("username") , "password" : here , "email" : user.get("email") , "firstName" : user.get("firstName") , "lastName" : user.get("lastName") }, {
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

				var heading = new Array();
				heading[0] = "Last Name";
				heading[1] = "First Name";
				heading[2] = "E-Mail";
				heading[3] = "Action";

				//TABLE COLUMNS

				var tr = document.createElement("TR");
				tableBody.appendChild(tr);

				$("#existingUsers").html("");

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
					button.value = "Delete";
					button.name = i;
					button.style.marginRight = "10px";
					button.onclick = (function() {
					    var count = i;

					    return function(e) {
					        
					    	//Delete that user...

					    	$("#spinnerDiv").html('<a><img src="./spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

					    	var user = window.existingUserArray[count];

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