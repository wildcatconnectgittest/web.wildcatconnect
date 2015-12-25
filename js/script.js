$(function() {
 
    Parse.$ = jQuery;
 
    Parse.initialize("cLBOvwh6ZTQYex37DSwxL1Cvg34MMiRWYAB4vqs0", "tTcV5Ns1GFdDda44FCcG5XHBDMbLA1sxRUzSnDgW");

	var NewsArticleStructure = Parse.Object.extend("NewsArticleStructure", {
		create: function(title, author, date, summary, content) {
			if (! title || ! author || ! date || ! summary || ! content) {
				alert("Please ensure you have filled out all required fields!");
			} else {
				var query = new Parse.Query("NewsArticleStructure");
				query.descending("articleID");
				query.first({
					success: function(structure) {
						var articleID = structure.get("articleID");
						var object = new NewsArticleStructure();
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
								var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
							    welcomeView.render();
							    $('.main-container').html(welcomeView.el);
							},
							error: function(error) {
								alert(error);
							}
						});
					},
					error: function(error) {
						alert(error);
					}
				});
			};
		}
	});

	var ExtracurricularUpdateStructure = Parse.Object.extend("ExtracurricularUpdateStructure", {
		create: function(ID, message) {
			console.log(parseInt(ID) < 0);
			if (parseInt(ID) < 0 || ! message) {
				alert("Please ensure you have filled out all required fields!");
			} else {
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
								var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
							    welcomeView.render();
							    $('.main-container').html(welcomeView.el);
							},
							error: function(error) {
								alert(error.message);
							}
						});
					},
					error: function(error) {
						alert(error);
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
								var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
							    welcomeView.render();
							    $('.main-container').html(welcomeView.el);
							},
							error: function(error) {
								alert(error);
							}
						});
					},
					error: function(error) {
						alert(error);
					}
				});
			};
		}
	}); 

	var LoginView = Parse.View.extend({
	    template: Handlebars.compile($('#login-tpl').html()),
	    events: {
	        'submit .form-signin': 'login',
	        'click .register' : 'register'
	    },
	    register: function(e) {
	    	e.preventDefault();
	    },
	    login: function(e) {
	 
	        // Prevent Default Submit Event
	        e.preventDefault();
	 
	        // Get data from the form and put them into variables
	        var data = $(e.target).serializeArray(),
	            username = data[0].value,
	            password = data[1].value;
	 
	        // Call Parse Login function with those variables
	        Parse.User.logIn(username, password, {
	            // If the username and password matches
	            success: function(user) {
	                var welcomeView = new AdminWelcomeView({ model: user });
				    welcomeView.render();
				    $('.main-container').html(welcomeView.el);
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
	        'click .add-cs' : 'addCS'
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

	    	var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
	    },
	    submit: function(e){
	        e.preventDefault();

	        var data = $(e.target).serializeArray();

	        var newsArticle = new NewsArticleStructure();

	        newsArticle.create(data[0].value, data[1].value, data[2].value, data[3].value, data[4].value, null);
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

	    	var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
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

	    	var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
		    welcomeView.render();
		    $('.main-container').html(welcomeView.el);
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

	if (Parse.User.current()) {
		var welcomeView = new AdminWelcomeView({ model: Parse.User.current() });
	    welcomeView.render();
	    $('.main-container').html(welcomeView.el);
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