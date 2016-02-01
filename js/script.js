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

var UserRegisterStructure = Parse.Object.extend("UserRegisterStructure", {
    create: function(firstName, lastName, email, confirmEmail, username, password, confirmPassword) {
        if (! firstName || ! lastName || ! username || ! password || ! email) {
            BootstrapDialog.show({
              type: BootstrapDialog.TYPE_DEFAULT,
              title: "Whoops!",
              message: "Please ensure you have correctly filled out all required fields!"
            });
            $("#signupButton").html("Register");
        } else if (email != confirmEmail) {
            BootstrapDialog.show({
              type: BootstrapDialog.TYPE_DEFAULT,
              title: "Whoops!",
              message: "Your e-mail addresses do not match!"
            });
            $("#signupButton").html("Register");
        } else if (password != confirmPassword) {
            BootstrapDialog.show({
              type: BootstrapDialog.TYPE_DEFAULT,
              title: "Whoops!",
              message: "Your passwords do not match!"
            });
            $("#signupButton").html("Register");
        } /*else if (email.indexOf("weymouthschools.org") === -1) {
            alert("Your e-mail address is not a valid faculty address!");
            $("#signupButton").html("Register");
        }*/ else if (username.indexOf(" ") > -1) {
            BootstrapDialog.show({
              type: BootstrapDialog.TYPE_DEFAULT,
              title: "Whoops!",
              message: "Your username cannot contain any spaces!"
            });
            $("#signupButton").html("Register");
        } else if (password.indexOf(" ") > -1) {
             BootstrapDialog.show({
              type: BootstrapDialog.TYPE_DEFAULT,
              title: "Whoops!",
              message: "Your password cannot contain any spaces!"
            });
            $("#signupButton").html("Register");
        } else {
            $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

            $("#signupButton").html("Checking availability...");
            Parse.Cloud.run("validateUser", { "username" : username , "email" : email }, {
                success: function(count) {
                    if (count > 0) {
                        BootstrapDialog.show({
                          type: BootstrapDialog.TYPE_DEFAULT,
                          title: "Whoops!",
                          message: "This username or e-mail has already been used. Please try again."
                        });
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
                                        BootstrapDialog.show({
                                            type: BootstrapDialog.TYPE_DEFAULT,
                                            title: "Success",
                                            message: "You have successfully registered your WildcatConnect account! A member of administration will approve your request and you will then receive a confirmation e-mail.",
                                            onhide: function(dialogRef){
                                                location.reload();
                                            }
                                        });
                                        $("#spinnerDiv").html("");
                                    },
                                    error: function(error) {
                                        BootstrapDialog.show({
                                            type: BootstrapDialog.TYPE_DEFAULT,
                                            title: "Error",
                                            message: "Error occurred. Please try again."
                                        });
                                        $("#spinnerDiv").html("");
                                        $("#signupButton").html("Register");
                                    }
                                });
                            },
                            error: function(error) {
                                BootstrapDialog.show({
                                    type: BootstrapDialog.TYPE_DEFAULT,
                                    title: "Error",
                                    message: "Error occurred. Please try again."
                                });
                                $("#spinnerDiv").html("");
                                $("#signupButton").html("Register");
                            }
                        });
                    };
                },
                error: function(error) {
                    BootstrapDialog.show({
                        type: BootstrapDialog.TYPE_DEFAULT,
                        title: "Error",
                        message: "Error occurred. Please try again."
                    });
                    $("#spinnerDiv").html("");
                    $("#signupButton").html("Register");
                }
            });
        };
    }
});

var NewsArticleStructure = Parse.Object.extend("NewsArticleStructure", {
    create: function(title, author, date, summary, content) {
        if (! title || ! author || ! date || ! summary || ! content) {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "Please ensure you have filled out all required fields!"
            });
        } else {
            $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
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
                            'views' : 0,
                            'isApproved' : 0
                        },  {
                            success: function(object) {
                                $("#spinnerDiv").html("");
                                localStorage.setItem("alertString", "Wildcat News Story successfully submitted for approval. Please allow 1-2 days for processing.");
                                window.location.replace("./index");
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
                            'views' : 0,
                            'isApproved' : 0
                        },  {
                            success: function(object) {
                                $("#spinnerDiv").html("");
                                localStorage.setItem("alertString", "Wildcat News Story successfully submitted for approval. Please allow 1-2 days for processing.");
                                window.location.replace("./index");
                            },
                            error: function(error) {
                                BootstrapDialog.show({
                                    type: BootstrapDialog.TYPE_DEFAULT,
                                    title: "Error",
                                    message: "Error occurred. Please try again."
                                });
                                $("#spinnerDiv").html("");
                            }
                        });
                    };
                },
                error: function(error) {
                    BootstrapDialog.show({
                        type: BootstrapDialog.TYPE_DEFAULT,
                        title: "Error",
                        message: "Error occurred. Please try again."
                    });
                    $("#spinnerDiv").html("");
                }
            });
        };
    }
});

var ExtracurricularUpdateStructure = Parse.Object.extend("ExtracurricularUpdateStructure", {
    create: function(IDarray, message) {
        if (IDarray.length === 0 || ! message) {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "Please ensure you have filled out all required fields!"
            });
        } else {
            $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
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
                                $("#spinnerDiv").html("");
                                localStorage.setItem("alertString", "Group update successfully posted.");
                                window.location.replace("./index");
                            },
                            error: function(error) {
                                BootstrapDialog.show({
                                    type: BootstrapDialog.TYPE_DEFAULT,
                                    title: "Error",
                                    message: "Error occurred. Please try again."
                                });
                                $("#spinnerDiv").html("");
                            }
                        });
                    };
                },
                error: function(error) {
                    BootstrapDialog.show({
                        type: BootstrapDialog.TYPE_DEFAULT,
                        title: "Error",
                        message: "Error occurred. Please try again."
                    });
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
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "Please ensure you have filled out all required fields!"
            });
        } else {
            $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
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
                            $("#spinnerDiv").html("");
                            localStorage.setItem("alertString", "Community service update successfully posted.");
                            window.location.replace("./index");
                        },
                        error: function(error) {
                            BootstrapDialog.show({
                                type: BootstrapDialog.TYPE_DEFAULT,
                                title: "Error",
                                message: "Error occurred. Please try again."
                            });
                            $("#spinnerDiv").html("");
                        }
                    });
                },
                error: function(error) {
                    BootstrapDialog.show({
                        type: BootstrapDialog.TYPE_DEFAULT,
                        title: "Error",
                        message: "Error occurred. Please try again."
                    });
                    $("#spinnerDiv").html("");
                }
            });
        };
    }
});

var EventStructure = Parse.Object.extend("EventStructure", {
    create: function(title, location, eventDate, eventTime, message) {
        eventDate = new Date(eventDate + " " + eventTime);
        console.log(eventDate);
        var now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0, 0);
        if (! title || ! location || ! eventDate || ! eventTime || ! message || eventDate < now ) {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "Please ensure you have filled out all required fields!"
            });
        } else {
            $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
            var object = new EventStructure();
            var theDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), eventDate.getHours(), eventDate.getMinutes(), 0, 0);
            object.save({
                "titleString" : title,
                "locationString" : location,
                "eventDate" : theDate,
                "messageString" : message,
                "isApproved" : 0,
                "userString" : Parse.User.current().get("firstName") + " " + Parse.User.current().get("lastName")
            }, {
                success: function(object) {
                    $("#spinnerDiv").html("");
                    localStorage.setItem("alertString", "Event successfully submitted for approval. Please allow 1-2 days for processing.");
                    window.location.replace("./index");
                },
                error: function(object, error) {
                    //console.log(error.code.toString() + error.message.toString() + " - " + object);
                    //Create ErrorStructures with custom method!!!
                    errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 333");
                    BootstrapDialog.show({
                        type: BootstrapDialog.TYPE_DEFAULT,
                        title: "Error",
                        message: "Error occurred. Please try again."
                    });
                    $("#spinnerDiv").html("");
                }
            });
        };
    }
});

var PollStructure = Parse.Object.extend("PollStructure", {
    create: function(title, question, daysSelect, choicesArray) {
        if (! title || ! question || ! daysSelect || ! choicesArray) {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "Please ensure you have filled out all required fields!"
            });
        } else {
            $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
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
                            $("#spinnerDiv").html("");
                            localStorage.setItem("alertString", "Poll successfully posted.");
                            window.location.replace("./index");
                        },
                        error: function(error) {
                            errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 380");
                           BootstrapDialog.show({
                                type: BootstrapDialog.TYPE_DEFAULT,
                                title: "Error",
                                message: "Error occurred. Please try again."
                            });
                            $("#spinnerDiv").html("");
                        }
                    });
                },
                error: function(error) {
                    errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 391");
                   BootstrapDialog.show({
                        type: BootstrapDialog.TYPE_DEFAULT,
                        title: "Error",
                        message: "Error occurred. Please try again."
                    });
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
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "Please ensure you have filled out all required fields!"
            });
        } else {
            $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
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
                           BootstrapDialog.show({
                                type: BootstrapDialog.TYPE_DEFAULT,
                                title: "Whoops!",
                                message: "You can't send an alert in the past. No one would ever see it. :("
                            });
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
                                    $("#spinnerDiv").html("");
                                    localStorage.setItem("alertString", "Alert successfully posted.");
                                    window.location.replace("./index");
                                },
                                error: function(error) {
                                    errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 460");
                                   BootstrapDialog.show({
                                        type: BootstrapDialog.TYPE_DEFAULT,
                                        title: "Error",
                                        message: "Error occurred. Please try again."
                                    });
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
                                    $("#spinnerDiv").html("");
                                    localStorage.setItem("alertString", "Alert successfully posted.");
                                    window.location.replace("./index");
                                },
                                error: function(error) {
                                    errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 488");
                                    BootstrapDialog.show({
                                        type: BootstrapDialog.TYPE_DEFAULT,
                                        title: "Error",
                                        message: "Error occurred. Please try again."
                                    });
                                    $("#spinnerDiv").html("");
                                }
                            });
                        };  
                    };
                },
                error: function(error) {
                    errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 501");
                    BootstrapDialog.show({
                        type: BootstrapDialog.TYPE_DEFAULT,
                        title: "Error",
                        message: "Error occurred. Please try again."
                    });
                    $("#spinnerDiv").html("");
                }
            });
        };
    }
});

var ExtracurricularStructure = Parse.Object.extend("ExtracurricularStructure", {
    create: function(title, content) {
        if (! title || ! content) {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "Please ensure you have filled out all required fields!"
            });
        } else {
            $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
            var query = new Parse.Query("ExtracurricularStructure");
            query.descending("extracurricularID");
            query.equalTo("titleString", title);
            query.count({
                success: function(count) {
                    if (count > 0) {
                        BootstrapDialog.show({
                            type: BootstrapDialog.TYPE_DEFAULT,
                            title: "Error",
                            message: "A group with this name has already been registered. Please enter a different name."
                        });
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
                                                $("#spinnerDiv").html("");
                                                localStorage.setItem("alertString", "Group successfully registered.");
                                                window.location.replace("./index");
                                            },
                                            error: function(error) {
                                                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 554");
                                                BootstrapDialog.show({
                                                    type: BootstrapDialog.TYPE_DEFAULT,
                                                    title: "Error",
                                                    message: "Error occurred. Please try again."
                                                });
                                                $("#spinnerDiv").html("");
                                            }
                                        });
                                    },
                                    error: function(error) {
                                        errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 565");
                                        BootstrapDialog.show({
                                            type: BootstrapDialog.TYPE_DEFAULT,
                                            title: "Error",
                                            message: "Error occurred. Please try again."
                                        });
                                        $("#spinnerDiv").html("");
                                    }
                                });
                            },
                            error: function(error) {
                                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 576");
                                BootstrapDialog.show({
                                    type: BootstrapDialog.TYPE_DEFAULT,
                                    title: "Error",
                                    message: "Error occurred. Please try again."
                                });
                                $("#spinnerDiv").html("");
                            }
                        });
                    };
                },
                error: function(error) {
                    errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 588");
                    BootstrapDialog.show({
                        type: BootstrapDialog.TYPE_DEFAULT,
                        title: "Error",
                        message: "Error occurred. Please try again."
                    });
                    $("#spinnerDiv").html("");
                }
            });
        };
    }
});

$(function() {
 
    Parse.$ = jQuery;
 
    Parse.initialize("cLBOvwh6ZTQYex37DSwxL1Cvg34MMiRWYAB4vqs0", "tTcV5Ns1GFdDda44FCcG5XHBDMbLA1sxRUzSnDgW");

	$('#logOut').click(function() {
		event.preventDefault();

        BootstrapDialog.confirm({
          title: 'Confirmation',
          message: 'Are you sure you want to log out and end your session?',
          type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: true, // <-- Default value is false
          draggable: true, // <-- Default value is false
          btnCancelLabel: 'No', // <-- Default value is 'Cancel',
          btnOKLabel: 'Yes', // <-- Default value is 'OK',
          btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
          callback: function(result) {
              // result will be true if button was click, while it will be false if users close the dialog directly.
              if(result) {
                  Parse.User.logOut();
                  window.location.replace("./login");
              };
          }
        });

	});

	$('#changePassword').click(function() {
        event.preventDefault();

        BootstrapDialog.confirm({
          title: 'Confirmation',
          message: 'Are you sure you want to change your password?',
          type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: true, // <-- Default value is false
          draggable: true, // <-- Default value is false
          btnCancelLabel: 'No', // <-- Default value is 'Cancel',
          btnOKLabel: 'Yes', // <-- Default value is 'OK',
          btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
          callback: function(result) {
              // result will be true if button was click, while it will be false if users close the dialog directly.
              if(result) {
                  Parse.User.requestPasswordReset(Parse.User.current().get("email"), {
                      success: function() {
                        $("#spinnerDiv").html("");
                        localStorage.setItem("alertString", "Success! Check your e-mail for password reset instructions.");
                        window.location.replace("./index");
                      },
                      error: function(error) {
                        errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 652");
                        $("#spinnerDiv").html("");
                        BootstrapDialog.show({
                            type: BootstrapDialog.TYPE_DEFAULT,
                            title: "Error",
                            message: "Error occurred. Please try again."
                        });
                        $("#spinnerDiv").html("");
                      }
                    });
              };
          }
      });
	});

    $('.form-signin').submit(function() {
        event.preventDefault();

        var data = $(this).serializeArray(),
            username = data[0].value,
            password = data[1].value;

        $("#logIn").html("Signing in...");
 
        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

        Parse.User.logIn(username, password, {
            success: function(user) {
                $("#spinnerDiv").html("");
                var verified = Parse.User.current().get("verified");
                if (verified === 0) {
                    localStorage.setItem("key", Parse.User.current().get("key"));
                    localStorage.setItem("username", Parse.User.current().get("username"));
                    window.location.replace("./verify");
                } else {
                    window.location.replace("./index");
                };
            },
            // If there is an error
            error: function(user, error) {
                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 692");
                BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_DEFAULT,
                    title: "Error",
                    message: "Error occurred logging in with those credentials. Please try again."
                });
                $("#spinnerDiv").html("");
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

        BootstrapDialog.confirm({
          title: 'Confirmation',
          message: 'Are you sure you want to go back? Any unsaved progress will be lost.',
          type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: true, // <-- Default value is false
          draggable: true, // <-- Default value is false
          btnCancelLabel: 'No', // <-- Default value is 'Cancel',
          btnOKLabel: 'Yes', // <-- Default value is 'OK',
          btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
          callback: function(result) {
              // result will be true if button was click, while it will be false if users close the dialog directly.
              if(result) {
                  history.back();
              };
          }
      });
    });

    $('.cancel-errors').click(function() {
        event.preventDefault();

        history.back();
    });

    $('.cancel-verify').click(function() {
        event.preventDefault();

        window.location.replace("./login");
    });

    $('.cancel-schedule').click(function() {
        event.preventDefault();

        BootstrapDialog.confirm({
          title: 'Confirmation',
          message: 'Are you sure you want to go back? Any unsaved progress will be lost.',
          type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: true, // <-- Default value is false
          draggable: true, // <-- Default value is false
          btnCancelLabel: 'No', // <-- Default value is 'Cancel',
          btnOKLabel: 'Yes', // <-- Default value is 'OK',
          btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
          callback: function(result) {
              // result will be true if button was click, while it will be false if users close the dialog directly.
              if(result) {
                  history.back();
              };
          }
      });
    });

    $('.form-add-news').submit(function() {
        event.preventDefault();

        var here = $(this);

        BootstrapDialog.confirm({
          title: 'Confirmation',
          message: 'Are you sure you want to submit this Wildcat News Story for administrative approval?',
          type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: true, // <-- Default value is false
          draggable: true, // <-- Default value is false
          btnCancelLabel: 'No', // <-- Default value is 'Cancel',
          btnOKLabel: 'Yes', // <-- Default value is 'OK',
          btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
          callback: function(result) {
              // result will be true if button was click, while it will be false if users close the dialog directly.
              if(result) {
                  var data = here.serializeArray();
 
                  var newsArticle = new NewsArticleStructure();

                  newsArticle.create(data[0].value, data[1].value, document.getElementById('date').value, data[2].value, data[3].value);
              };
          }
      });
    });

    $('.form-add-groupUpdate').submit(function() {
        event.preventDefault();

        var here = $(this);

        BootstrapDialog.confirm({
          title: 'Confirmation',
          message: 'Are you sure you want to post this group update?',
          type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: true, // <-- Default value is false
          draggable: true, // <-- Default value is false
          btnCancelLabel: 'No', // <-- Default value is 'Cancel',
          btnOKLabel: 'Yes', // <-- Default value is 'OK',
          btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
          callback: function(result) {
              // result will be true if button was click, while it will be false if users close the dialog directly.
              if(result) {
                  var data = here.serializeArray();
 
                  var ECU = new ExtracurricularUpdateStructure();

                  ECU.create(window.groupsArray, data[data.length - 1].value);
              };
          }
      });

    });

    $('.form-add-community').submit(function() {
        event.preventDefault();

        var here = $(this);

        BootstrapDialog.confirm({
          title: 'Confirmation',
          message: 'Are you sure you want to submit this Community Service Update?',
          type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: true, // <-- Default value is false
          draggable: true, // <-- Default value is false
          btnCancelLabel: 'No', // <-- Default value is 'Cancel',
          btnOKLabel: 'Yes', // <-- Default value is 'OK',
          btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
          callback: function(result) {
              // result will be true if button was click, while it will be false if users close the dialog directly.
              if(result) {
                  var data = here.serializeArray();
 
                    var CS = new CommunityServiceStructure();

                    CS.create(data[0].value, data[1].value, data[2].value, data[3].value, data[4].value, data[5].value);
              };
          }
      });

    });

    $('.form-add-event').submit(function() {
        event.preventDefault();

        var here = $(this);

        BootstrapDialog.confirm({
          title: 'Confirmation',
          message: 'Are you sure you want to submit this event for administrative approval?',
          type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: true, // <-- Default value is false
          draggable: true, // <-- Default value is false
          btnCancelLabel: 'No', // <-- Default value is 'Cancel',
          btnOKLabel: 'Yes', // <-- Default value is 'OK',
          btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
          callback: function(result) {
              // result will be true if button was click, while it will be false if users close the dialog directly.
              if(result) {
                  var data = here.serializeArray();
 
                    var theEvent = new EventStructure();

                    theEvent.create(data[0].value, data[1].value, data[2].value, data[3].value, data[4].value);
              };
          }
      });
    });

    $('.form-add-poll').submit(function() {
        event.preventDefault();

        var here = $(this);

        BootstrapDialog.confirm({
          title: 'Confirmation',
          message: 'Are you sure you want to submit this User Poll?',
          type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: true, // <-- Default value is false
          draggable: true, // <-- Default value is false
          btnCancelLabel: 'No', // <-- Default value is 'Cancel',
          btnOKLabel: 'Yes', // <-- Default value is 'OK',
          btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
          callback: function(result) {
              // result will be true if button was click, while it will be false if users close the dialog directly.
              if(result) {
                  var data = here.serializeArray();
 
                    var poll = new PollStructure();

                    poll.create(data[0].value, data[1].value, data[2].value, choicesArray);
              };
          }
      });

    });

    $('.form-add-alert').submit(function() {
        event.preventDefault();

        var here = $(this);

        BootstrapDialog.confirm({
          title: 'Confirmation',
          message: 'Are you sure you want to submit this alert? It will be live to all app users.',
          type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: true, // <-- Default value is false
          draggable: true, // <-- Default value is false
          btnCancelLabel: 'No', // <-- Default value is 'Cancel',
          btnOKLabel: 'Yes', // <-- Default value is 'OK',
          btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
          callback: function(result) {
              // result will be true if button was click, while it will be false if users close the dialog directly.
              if(result) {
                 var data = here.serializeArray();
 
            var alert = new AlertStructure();

            alert.create(data[0].value, Parse.User.current().get("firstName") + " " + Parse.User.current().get("lastName"), data[1].value, data[2].value, data[3].value, data[4].value);
              };
          }
      });
    });

    $('.form-add-groupRegister').submit(function() {
        event.preventDefault();

        var here = $(this);

        BootstrapDialog.confirm({
          title: 'Confirmation',
          message: 'Are you sure you want to register this new group?',
          type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: true, // <-- Default value is false
          draggable: true, // <-- Default value is false
          btnCancelLabel: 'No', // <-- Default value is 'Cancel',
          btnOKLabel: 'Yes', // <-- Default value is 'OK',
          btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
          callback: function(result) {
              // result will be true if button was click, while it will be false if users close the dialog directly.
              if(result) {
                 var data = here.serializeArray();
 
                 var EC = new ExtracurricularStructure();

                 EC.create(data[0].value, data[1].value);
              };
          }
      });

    });

    $('.form-add-custom').submit(function() {
        event.preventDefault();

        var data = $(this).serializeArray();
 
        var description = data[0].value;
        var custom = data[1].value;

        if (! custom) {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "No data entered!"
            });
        } else {
                BootstrapDialog.confirm({
                  title: 'Confirmation',
                  message: 'Are you sure you want to save this custom schedule?',
                  type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                  closable: true, // <-- Default value is false
                  draggable: true, // <-- Default value is false
                  btnCancelLabel: 'No', // <-- Default value is 'Cancel',
                  btnOKLabel: 'Yes', // <-- Default value is 'OK',
                  btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
                  callback: function(result) {
                      // result will be true if button was click, while it will be false if users close the dialog directly.
                      if(result) {
                         $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
                        var query = new Parse.Query("SchoolDayStructure");
                        query.equalTo("schoolDayID", parseInt(localStorage.getItem("customID")));
                        query.first({
                            success: function(object) {
                                object.set("customString", description);
                                object.set("customSchedule", custom);
                                object.set("scheduleType", "*");
                                object.save(null, {
                                    success: function() {
                                        $("#spinnerDiv").html("");
                                        localStorage.setItem("scheduleAlertString", "Schedule successfully updated.");
                                        window.location.replace("./schedule");
                                    },
                                    error: function(error) {
                                        errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1002");
                                        BootstrapDialog.show({
                                            type: BootstrapDialog.TYPE_DEFAULT,
                                            title: "Error",
                                            message: "Error occurred. Please try again."
                                        });
                                        $("#spinnerDiv").html("");
                                    }
                                });
                            },
                            error: function(error) {
                                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1013");
                                BootstrapDialog.show({
                                    type: BootstrapDialog.TYPE_DEFAULT,
                                    title: "Error",
                                    message: "Error occurred. Please try again."
                                });
                                $("#spinnerDiv").html("");
                            }
                        });
                      };
                  }
              });
            
        };
    });

    $('.form-verify').submit(function() {
        event.preventDefault();

        var data = $(this).serializeArray();

        var newKey = data[0].value;

        if (newKey === localStorage.getItem("key").toString()) {
            var query = new Parse.Query(Parse.User);
            query.equalTo("username", localStorage.getItem("username").toString());
            query.first({
                success: function(user) {
                    Parse.User.current().save({
                        "verified" : 1
                    }, {
                        success: function() {
                            Parse.User.logOut();
                            BootstrapDialog.show({
                                type: BootstrapDialog.TYPE_DEFAULT,
                                title: "Success",
                                message: "Registration complete! Welcome to WildcatConnect! Please re-enter your login credentials.",
                                onhide: function(dialogRef) {
                                    window.location.replace("./login");
                                }
                            });
                        },
                        error: function(error) {
                            Parse.User.logOut();
                            errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1057");
                            BootstrapDialog.show({
                                type: BootstrapDialog.TYPE_DEFAULT,
                                title: "Error",
                                message: "An error occurred. Please try again."
                            });
                            window.location.replace("./login");
                        }
                    });
                },
                error: function(error) {
                    errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1068");
                    $("#spinnerDiv").html("");
                    BootstrapDialog.show({
                        type: BootstrapDialog.TYPE_DEFAULT,
                        title: "Error",
                        message: "An error occurred. Please try again."
                    });
                    window.location.replace("./login");
                }
            });
        } else {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "Incorrect registration key."
            });
            Parse.User.logOut();
            window.location.replace("./login");
        };
    });

    $('.saveLunch').click(function() {
        event.preventDefault();

        BootstrapDialog.confirm({
          title: 'Confirmation',
          message: 'Are you sure you want to save this breakfast and lunch information?',
          type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: true, // <-- Default value is false
          draggable: true, // <-- Default value is false
          btnCancelLabel: 'No', // <-- Default value is 'Cancel',
          btnOKLabel: 'Yes', // <-- Default value is 'OK',
          btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
          callback: function(result) {
              // result will be true if button was click, while it will be false if users close the dialog directly.
              if(result) {
                 $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

            var array = new Array();

                    var query = new Parse.Query("SchoolDayStructure");
                    query.equalTo("isActive", 1);
                    query.ascending("schoolDayID");
                    query.find({
                        success: function(structures) {
                            for (var i = 0; i < structures.length; i++) {
                                var ID = "#b_" + i.toString();
                                var newBreakfast = $(ID).val();
                                var ID2 = "#l_" + i.toString();
                                var newLunch = $(ID2).val();
                                structures[i].set("breakfastString", newBreakfast);
                                structures[i].set("lunchString", newLunch);
                                array.push(structures[i]);
                            };
                            Parse.Object.saveAll(array, {
                                success: function(objects) {
                                    var alertString = "Breakfasts and lunches successfully updated.";
                                    localStorage.setItem("lunchAlertString", alertString);
                                    $("#spinnerDiv").html("");
                                    window.location.replace("./lunch");
                                },
                                error: function(error) {
                                    errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1129");
                                       BootstrapDialog.show({
                                            type: BootstrapDialog.TYPE_DEFAULT,
                                            title: "Error",
                                            message: "Error occurred. Please try again."
                                        });
                                        $("#spinnerDiv").html("");
                                }
                            });
                        },
                        error: function(error) {
                            errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1140");
                           BootstrapDialog.show({
                                type: BootstrapDialog.TYPE_DEFAULT,
                                title: "Error",
                                message: "Error occurred. Please try again."
                            });
                            $("#spinnerDiv").html("");
                        }
                    });
              };
          }
      });

    });

    $('.saveLinks').click(function() {
        event.preventDefault();

        BootstrapDialog.confirm({
          title: 'Confirmation',
          message: 'Are you sure you want to save these links? They will be live for all app users.',
          type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: true, // <-- Default value is false
          draggable: true, // <-- Default value is false
          btnCancelLabel: 'No', // <-- Default value is 'Cancel',
          btnOKLabel: 'Yes', // <-- Default value is 'OK',
          btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
          callback: function(result) {
              // result will be true if button was click, while it will be false if users close the dialog directly.
              if(result) {
                 $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

                var query = new Parse.Query("UsefulLinkArray");
                query.ascending("index");
                query.find({
                    success: function(structures) {
                        Parse.Object.destroyAll(structures, {
                            success: function() {
                                var everything = document.getElementById("links");

                                var tableCount = everything.getElementsByTagName("table").length;

                                var finalArray = new Array();

                                var work = true;

                                for (var i = 0; i < tableCount; i++) {
                                    var UsefulLinkArray = Parse.Object.extend("UsefulLinkArray");
                                    var object = new UsefulLinkArray();
                                    var headerID = "#header_" + i.toString();
                                    var headerTitle = $(headerID).val();
                                    object.set("headerTitle", headerTitle);
                                    object.set("index", i);
                                    var rows = document.getElementById("table_" + i.toString()).rows;
                                    var array = [];
                                    for (var j = 0; j < rows.length - 1; j++) {
                                        var dictionary = {};
                                        var titleID = "#title_" + i + "_" + j;
                                        var titleString = $(titleID).val();
                                        if (! titleString) {
                                            work = false;
                                            BootstrapDialog.show({
                                                type: BootstrapDialog.TYPE_DEFAULT,
                                                title: "Error",
                                                message: "Please ensure you have correctly filled all fields!"
                                            });
                                            var test = $(titleID).css("border-color");
                                            $(titleID).css("border-color", "red");
                                            break;
                                        } else {
                                            dictionary["titleString"] = titleString;
                                            $(titleID).css("border-color", "rgb(51, 51, 51");
                                        };
                                        var linkID = "#link_" + i + "_" + j;
                                        var linkString = $(linkID).val();
                                        if (! linkString) {
                                            work = false;
                                            BootstrapDialog.show({
                                                type: BootstrapDialog.TYPE_DEFAULT,
                                                title: "Error",
                                                message: "Please ensure you have correctly filled all fields!"
                                            });
                                            $(linkID).css("border-color", "red");
                                            break;
                                        } else {
                                            dictionary["URLString"] = linkString;
                                            $(linkID).css("border-color", "rgb(51, 51, 51");
                                        };
                                        array.push(dictionary);
                                    };
                                    if (work == true) {
                                        object.set("linksArray", array);
                                        finalArray.push(object);
                                    } else {
                                        break;
                                    };
                                };

                                if (work == true) {
                                    Parse.Object.saveAll(finalArray, {
                                        success: function(objects) {
                                            var alertString = "Links successfully updated.";
                                            localStorage.setItem("linksAlertString", alertString);
                                            $("#spinnerDiv").html("");
                                            window.location.replace("./links");
                                        },
                                        error: function(error) {
                                            errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1238");
                                            BootstrapDialog.show({
                                                type: BootstrapDialog.TYPE_DEFAULT,
                                                title: "Error",
                                                message: "Error occurred. Please try again."
                                            });
                                            $("#spinnerDiv").html("");
                                        }
                                    });
                                } else {
                                    Parse.Object.saveAll(structures, {
                                        success: function(objects) {
                                            $("#spinnerDiv").html("");
                                        },
                                        error: function(error) {
                                            errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1253");
                                           BootstrapDialog.show({
                                                type: BootstrapDialog.TYPE_DEFAULT,
                                                title: "Error",
                                                message: "Error occurred. Please try again."
                                            });
                                            $("#spinnerDiv").html("");
                                        }
                                    });
                                };
                            },
                            error: function(error) {
                                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1265");
                               BootstrapDialog.show({
                                    type: BootstrapDialog.TYPE_DEFAULT,
                                    title: "Error",
                                    message: "Error occurred. Please try again."
                                });
                                $("#spinnerDiv").html("");
                            }
                        });
                    },
                    error: function(error) {
                        errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1276");
                       BootstrapDialog.show({
                            type: BootstrapDialog.TYPE_DEFAULT,
                            title: "Error",
                            message: "Error occurred. Please try again."
                        });
                        $("#spinnerDiv").html("");
                    }
                });
              };
          }
      });

    });

});

function errorFunction(error, url, line) {
    var ErrorStructure = Parse.Object.extend("ErrorStructure");
    var theError = new ErrorStructure();
    theError.set("deviceToken", "Web Client");
    theError.set("nameString", "JavaScript Error");
    theError.set("infoString", "Message = " + error + " - File = " + url + " - Line = " + line);
    theError.set("version", "Latest web release.");
    theError.set("username", Parse.User.current().get("username"));
    theError.save();
}

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
		$("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
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

                            BootstrapDialog.confirm({
                                  title: 'Confirmation',
                                  message: 'Are you sure you want to approve this user?',
                                  type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: true, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  btnCancelLabel: 'No', // <-- Default value is 'Cancel',
                                  btnOKLabel: 'Yes', // <-- Default value is 'OK',
                                  btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
                                  callback: function(result) {
                                      // result will be true if button was click, while it will be false if users close the dialog directly.
                                      if(result) {
                                         $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

                                        var user = window.userArray[count];

                                        var password = user.get("password");
                                        var key = user.get("key");

                                        Parse.Cloud.run("decryptPassword", { "password" : password}, {
                                            success: function(here) {
                                                Parse.Cloud.run('registerUser', { "username" : user.get("username") , "password" : here , "email" : user.get("email") , "firstName" : user.get("firstName") , "lastName" : user.get("lastName"), "key" : key }, {
                                                  success: function() {
                                                    $("#spinnerDiv").html("");
                                                    var alertString = "User approved!";
                                                    localStorage.setItem("userAlertString", alertString);
                                                    $(document).ready(loadNewUserTable());
                                                    $(document).ready(loadExistingUserTable());
                                                  },
                                                  error: function(error) {
                                                    errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1431");
                                                   BootstrapDialog.show({
                                                        type: BootstrapDialog.TYPE_DEFAULT,
                                                        title: "Error",
                                                        message: "Error occurred. Please try again."
                                                    });
                                                    $("#spinnerDiv").html("");
                                                  }
                                                });
                                            },
                                            error: function(error) {
                                                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1442");
                                               BootstrapDialog.show({
                                                    type: BootstrapDialog.TYPE_DEFAULT,
                                                    title: "Error",
                                                    message: "Error occurred. Please try again."
                                                });
                                                $("#spinnerDiv").html("");
                                            }
                                        });
                                      };
                                  }
                              });
                        };
                    })();
                    tdFour.appendChild(button);

                    var buttonTwo =document.createElement("INPUT");
                    buttonTwo.type = "button";
                    buttonTwo.className = "btn btn-lg btn-primary";
                    buttonTwo.value = "Deny";
                    button.name = i;
                    buttonTwo.style.marginRight = "10px";
                    buttonTwo.style.backgroundColor = "red";
                    buttonTwo.style.borderColor = "red";
                    buttonTwo.onclick = (function() {
                        var count = i;

                        return function(e) {

                            BootstrapDialog.confirm({
                                  title: 'Confirmation',
                                  message: 'Are you sure you want to deny this user?',
                                  type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: true, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  btnCancelLabel: 'No', // <-- Default value is 'Cancel',
                                  btnOKLabel: 'Yes', // <-- Default value is 'OK',
                                  btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
                                  callback: function(result) {
                                      // result will be true if button was click, while it will be false if users close the dialog directly.
                                      if(result) {
                                         $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

                                            var user = window.userArray[count];

                                            var query = new Parse.Query("UserRegisterStructure");
                                            query.equalTo("username", user.get("username"));
                                            query.first({
                                                success: function(object) {
                                                    object.destroy({
                                                        success: function(object) {
                                                            $("#spinnerDiv").html("");
                                                            var alertString = "User successfully denied account request.";
                                                            localStorage.setItem("userAlertString", alertString);
                                                            $(document).ready(loadNewUserTable());
                                                            $(document).ready(loadExistingUserTable());
                                                        },
                                                        error: function(error) {
                                                            errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1500");
                                                           BootstrapDialog.show({
                                                                type: BootstrapDialog.TYPE_DEFAULT,
                                                                title: "Error",
                                                                message: "Error occurred. Please try again."
                                                            });
                                                            $("#spinnerDiv").html("");
                                                        }
                                                    });
                                                },
                                                error: function(error) {
                                                    errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1511");
                                                   BootstrapDialog.show({
                                                        type: BootstrapDialog.TYPE_DEFAULT,
                                                        title: "Error",
                                                        message: "Error occurred. Please try again."
                                                    });
                                                    $("#spinnerDiv").html("");
                                                }
                                            });
                                      };
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

        $('#userAlertDiv').css("display", "block");

        var alertString = localStorage.getItem("userAlertString");
        if (alertString && alertString.length > 0) {
            localStorage.setItem("userAlertString", "");
            $('#userAlertDiv').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">Close</a><strong>'+alertString+'</strong></div>');
            $('#userAlertDiv').delay(5000).fadeOut(500);
        };

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

                    var theArray = ["Developer", "Administration", "Faculty", "Lunch Manager"];

                    for (var j = 0; j < theArray.length; j++) {
                        var option = document.createElement("option");
                        option.value = j;
                        option.text = theArray[j];
                        selectList.appendChild(option);
                    }
                    selectList.onchange = (function() {

                        var count = i;

                        return function(e) {

                            var index = this.selectedIndex - 1;

                            BootstrapDialog.confirm({
                                  title: 'Confirmation',
                                  message: 'Are you sure you want to update this user?',
                                  type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: true, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  btnCancelLabel: 'No', // <-- Default value is 'Cancel',
                                  btnOKLabel: 'Yes', // <-- Default value is 'OK',
                                  btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
                                  callback: function(result) {
                                      // result will be true if button was click, while it will be false if users close the dialog directly.
                                      if(result) {
                                         var key = theArray[index];

                                        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

                                        Parse.Cloud.run('updateType', { "username" : structures[count].get("username") , "type" : key }, {
                                          success: function() {
                                            $("#spinnerDiv").html("");
                                            var alertString = "User successfully updated.";
                                            localStorage.setItem("userAlertString", alertString);
                                            $(document).ready(loadNewUserTable());
                                            $(document).ready(loadExistingUserTable());
                                          },
                                          error: function(error) {
                                            errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1659");
                                           BootstrapDialog.show({
                                                type: BootstrapDialog.TYPE_DEFAULT,
                                                title: "Error",
                                                message: "Error occurred. Please try again."
                                            });
                                            $("#spinnerDiv").html("");
                                          }
                                        });
                                      };
                                  }
                              });

                        };
                    })();
                    tdThree.appendChild(selectList);
                    tr.appendChild(tdThree);

					var tdFour = document.createElement("TD");
					var button =document.createElement("INPUT");
					button.type = "button";
					button.className = "btn btn-lg btn-primary";
					button.value = "Delete";
					button.name = i;
					button.style.marginRight = "10px";
                    button.style.backgroundColor = "red";
                    button.style.borderColor = "red";
					button.onclick = (function() {
					    var count = i;

					    return function(e) {

                            BootstrapDialog.confirm({
                                  title: 'Confirmation',
                                  message: 'Are you sure you want to delete this user?',
                                  type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: true, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  btnCancelLabel: 'No', // <-- Default value is 'Cancel',
                                  btnOKLabel: 'Yes', // <-- Default value is 'OK',
                                  btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
                                  callback: function(result) {
                                      // result will be true if button was click, while it will be false if users close the dialog directly.
                                      if(result) {
                                         var user = window.existingUserArray[count];

                                            if (user.get("username") != Parse.User.current().get("username").toString()) {
                                                $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

                                                Parse.Cloud.run('deleteUser', { "username" : user.get("username") }, {
                                                  success: function() {
                                                    $("#spinnerDiv").html("");
                                                        var alertString = "User successfully deleted.";
                                                        $('#userAlertDiv').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">Close</a><strong>'+alertString+'</strong></div>');
                                                        $('#userAlertDiv').delay(5000).fadeOut(500);
                                                        $(document).ready(loadNewUserTable());
                                                        $(document).ready(loadExistingUserTable());
                                                  },
                                                  error: function(error) {
                                                    errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1718");
                                                   BootstrapDialog.show({
                                                        type: BootstrapDialog.TYPE_DEFAULT,
                                                        title: "Error",
                                                        message: "Error occurred. Please try again."
                                                    });
                                                    $("#spinnerDiv").html("");
                                                  }
                                                });
                                            } else {
                                                BootstrapDialog.show({
                                                    type: BootstrapDialog.TYPE_DEFAULT,
                                                    title: "Error",
                                                    message: "Whoops! You cannot delete yourself as a user."
                                                });
                                                $("#spinnerDiv").html("");
                                            };
                                      };
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

function loadLunchTable() {
	return function() {

        $('#lunchAlertDiv').css("display", "block");

        var alertString = localStorage.getItem("lunchAlertString");
        if (alertString && alertString.length > 0) {
            localStorage.setItem("lunchAlertString", "");
            $('#lunchAlertDiv').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">Close</a><strong>'+alertString+'</strong></div>');
            $('#lunchAlertDiv').delay(5000).fadeOut(500);
        };

		$("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

		var query = new Parse.Query("SchoolDayStructure");
        query.equalTo("isActive", 1);
        query.ascending("schoolDayID");
        var structures = new Array();
        query.find({
            success: function(structures) {

                $("#titleLabel").html("Available School Days (" + structures.length+")");

                var tableDiv = document.getElementById("schedules");
                var table = document.createElement("TABLE");
                var tableBody = document.createElement("TBODY");

                table.appendChild(tableBody);
                table.className = "table table-striped";

                var heading = new Array();
                heading[0] = "Date";
                heading[1] = "Breakfast";
                heading[2] = "Lunch";

                //TABLE COLUMNS

                var tr = document.createElement("TR");
                tableBody.appendChild(tr);

                $("#schedules").html("");

                for (var i = 0; i < heading.length; i++) {
                    var th = document.createElement("TH");
                    if (i == 0) {
                        th.width = '20%';
                    } else {
                        th.width = '40%';
                    };
                    th.appendChild(document.createTextNode(heading[i]));
                    tr.appendChild(th);
                };

                for (var i = 0; i < structures.length; i++) {
                    var tr = document.createElement("TR");
                    var tdTwo = document.createElement("TD");
                    var parts = structures[i].get("schoolDate").split('-');
                    var date = new Date(parts[2], parts[0]-1,parts[1]);
                    var string = date.toString('dddd, MMMM d, yyyy');
                    tdTwo.appendChild(document.createTextNode(string));
                    tr.appendChild(tdTwo);

                    var tdOne = document.createElement("TD");
                    var breakfastText = document.createElement("TEXTAREA");
                    breakfastText.value = structures[i].get("breakfastString");
                    breakfastText.class = "form-control";
                    breakfastText.style.display = "block";
                    breakfastText.style.width = "100%";
                    breakfastText.style.overflowY = "scroll";
                    breakfastText.style.resize = "none";
                    breakfastText.id = "b_" + i;
                    breakfastText.maxLength = 80;
                    tdOne.appendChild(breakfastText);
                    tr.appendChild(tdOne);

                    var tdThree = document.createElement("TD");
                    var lunchText = document.createElement("TEXTAREA");
                    lunchText.value = structures[i].get("lunchString");
                    lunchText.class = "form-control";
                    lunchText.style.display = "block";
                    lunchText.style.width = "100%";
                    lunchText.style.overflowY = "scroll";
                    lunchText.style.resize = "none";
                    lunchText.id = "l_" + i;
                    lunchText.maxLength = 80;
                    tdThree.appendChild(lunchText);
                    tr.appendChild(tdThree);

                    tableBody.appendChild(tr);

                    tableDiv.appendChild(table);
                };

                $("#spinnerDiv").html("");

            },
            error: function(error) {
                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1845");
               BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_DEFAULT,
                    title: "Error",
                    message: "Error occurred. Please try again."
                });
                $("#spinnerDiv").html("");
            }
        });
	}
}

function loadNewsTable() {
    return function() {

        $('#newsAlertDiv').css("display", "block");

        var alertString = localStorage.getItem("newsAlertString");
        if (alertString && alertString.length > 0) {
            localStorage.setItem("newsAlertString", "");
            $('#newsAlertDiv').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">Close</a><strong>'+alertString+'</strong></div>');
            $('#newsAlertDiv').delay(5000).fadeOut(500);
        };

        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

        var query = new Parse.Query("NewsArticleStructure");
        query.equalTo("isApproved", 0);
        query.ascending("createdAt");
        var structures = new Array();
        query.find({
            success: function(structures) {

                $("#titleLabel").html("Pending Wildcat News Requests (" + structures.length+")");

                var tableDiv = document.getElementById("newsRequests");
                var table = document.createElement("TABLE");
                var tableBody = document.createElement("TBODY");

                table.appendChild(tableBody);
                table.className = "table table-striped";

                var heading = new Array();
                heading[0] = "Date Submitted";
                heading[1] = "Author";
                heading[2] = "Summary";
                heading[3] = "Content";
                heading[4] = "Action";

                //TABLE COLUMNS

                var tr = document.createElement("TR");
                tableBody.appendChild(tr);

                $("#newsRequests").html("");

                for (var i = 0; i < heading.length; i++) {
                    var th = document.createElement("TH");
                    if (i != 3) {
                        th.width = '10%';
                    } else {
                        th.width = '60%';
                    };
                    th.appendChild(document.createTextNode(heading[i]));
                    tr.appendChild(th);
                };

                for (var i = 0; i < structures.length; i++) {
                    var tr = document.createElement("TR");
                    var tdTwo = document.createElement("TD");
                    var date = structures[i].createdAt;
                    var string = date.toString('dddd, MMMM d, yyyy @ h:mm tt');
                    tdTwo.appendChild(document.createTextNode(string));
                    tr.appendChild(tdTwo);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("authorString")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("summaryString")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("contentURLString")));
                    tr.appendChild(tdOne);

                    var tdFour = document.createElement("TD");
                    var button =document.createElement("INPUT");
                    button.type = "button";
                    button.className = "approveUser btn btn-lg btn-primary";
                    button.value = "Approve";
                    button.name = i;
                    button.style.marginBottom = "10px";
                    button.onclick = (function() {
                        var count = i;

                        return function(e) {
                            
                            //Approve the user at i

                            BootstrapDialog.confirm({
                                  title: 'Confirmation',
                                  message: 'Are you sure you want to approve this Wildcat News Story? It will be live to all app users.',
                                  type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: true, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  btnCancelLabel: 'No', // <-- Default value is 'Cancel',
                                  btnOKLabel: 'Yes', // <-- Default value is 'OK',
                                  btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
                                  callback: function(result) {
                                      // result will be true if button was click, while it will be false if users close the dialog directly.
                                      if(result) {
                                         $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

                                        structures[count].set("isApproved", 1);
                                        structures[count].save({
                                            success: function() {
                                                $("#spinnerDiv").html("");
                                                var alertString = "Story successfully approved.";
                                                localStorage.setItem("newsAlertString", alertString);
                                                $(document).ready(loadNewsTable());
                                              },
                                              error: function(error) {
                                                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1969");
                                                   BootstrapDialog.show({
                                                        type: BootstrapDialog.TYPE_DEFAULT,
                                                        title: "Error",
                                                        message: "Error occurred. Please try again."
                                                    });
                                                    $("#spinnerDiv").html("");
                                              }
                                        });
                                      };
                                  }
                              });
                        };
                    })();
                    tdFour.appendChild(button);

                    var buttonTwo =document.createElement("INPUT");
                    buttonTwo.type = "button";
                    buttonTwo.className = "btn btn-lg btn-primary";
                    buttonTwo.value = "Deny";
                    button.name = i;
                    buttonTwo.style.marginRight = "10px";
                    buttonTwo.style.backgroundColor = "red";
                    buttonTwo.style.borderColor = "red";
                    buttonTwo.onclick = (function() {
                        var count = i;

                        return function(e) {

                            BootstrapDialog.confirm({
                                  title: 'Confirmation',
                                  message: 'Are you sure you want to deny this Wildcat News Story?',
                                  type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: true, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  btnCancelLabel: 'No', // <-- Default value is 'Cancel',
                                  btnOKLabel: 'Yes', // <-- Default value is 'OK',
                                  btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
                                  callback: function(result) {
                                      // result will be true if button was click, while it will be false if users close the dialog directly.
                                      if(result) {
                                         $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

                                        structures[count].destroy({
                                            success: function() {
                                                $("#spinnerDiv").html("");
                                                var alertString = "Story successfully denied.";
                                                localStorage.setItem("newsAlertString", alertString);
                                                $(document).ready(loadNewsTable());
                                              },
                                              error: function(error) {
                                                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 2020");
                                               BootstrapDialog.show({
                                                    type: BootstrapDialog.TYPE_DEFAULT,
                                                    title: "Error",
                                                    message: "Error occurred. Please try again."
                                                });
                                                $("#spinnerDiv").html("");
                                              }
                                        });
                                      };
                                  }
                              });

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
                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 2047");
               BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_DEFAULT,
                    title: "Error",
                    message: "Error occurred. Please try again."
                });
                $("#spinnerDiv").html("");
            }
        });
    }
}

function loadEventTable() {
    return function() {

        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

        var query = new Parse.Query("EventStructure");
        query.equalTo("isApproved", 0);
        query.ascending("createdAt");
        var structures = new Array();
        query.find({
            success: function(structures) {

                $("#titleLabel").html("Pending Event Requests (" + structures.length+")");

                var tableDiv = document.getElementById("eventRequests");
                var table = document.createElement("TABLE");
                var tableBody = document.createElement("TBODY");

                table.appendChild(tableBody);
                table.className = "table table-striped";

                var heading = new Array();
                heading[0] = "Title";
                heading[1] = "Date";
                heading[2] = "Location";
                heading[3] = "Message";
                heading[4] = "User";
                heading[5] = "Action";

                //TABLE COLUMNS

                var tr = document.createElement("TR");
                tableBody.appendChild(tr);

                $("#eventRequests").html("");

                for (var i = 0; i < heading.length; i++) {
                    var th = document.createElement("TH");
                    if (i != 3) {
                        th.width = '12%';
                    } else {
                        th.width = '40%';
                    };
                    th.appendChild(document.createTextNode(heading[i]));
                    tr.appendChild(th);
                };

                for (var i = 0; i < structures.length; i++) {
                    var tr = document.createElement("TR");

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("titleString")));
                    tr.appendChild(tdOne);

                    var tdTwo = document.createElement("TD");
                    var date = structures[i].get("eventDate");
                    var string = date.toString('dddd, MMMM d, yyyy @ h:mm tt');
                    tdTwo.appendChild(document.createTextNode(string));
                    tr.appendChild(tdTwo);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("locationString")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("messageString")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("userString")));
                    tr.appendChild(tdOne);

                    var tdFour = document.createElement("TD");
                    var button =document.createElement("INPUT");
                    button.type = "button";
                    button.className = "approveUser btn btn-lg btn-primary";
                    button.value = "Approve";
                    button.name = i;
                    button.style.marginBottom = "10px";
                    button.onclick = (function() {
                        var count = i;

                        return function(e) {
                            
                            //Approve the user at i

                            BootstrapDialog.confirm({
                                  title: 'Confirmation',
                                  message: 'Are you sure you want to approve this event? It will be live to all app users.?',
                                  type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: true, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  btnCancelLabel: 'No', // <-- Default value is 'Cancel',
                                  btnOKLabel: 'Yes', // <-- Default value is 'OK',
                                  btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
                                  callback: function(result) {
                                      // result will be true if button was click, while it will be false if users close the dialog directly.
                                      if(result) {
                                         $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

                                        structures[count].set("isApproved", 1);
                                        structures[count].save({
                                            success: function() {
                                                $("#spinnerDiv").html("");
                                                var alertString = "Event successfully approved.";
                                                localStorage.setItem("eventAlertString", alertString);
                                                $(document).ready(loadEventTable());
                                                $(document).ready(loadExistingEventTable());
                                              },
                                              error: function(error) {
                                                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 2169");
                                                   BootstrapDialog.show({
                                                        type: BootstrapDialog.TYPE_DEFAULT,
                                                        title: "Error",
                                                        message: "Error occurred. Please try again."
                                                    });
                                                    $("#spinnerDiv").html("");
                                              }
                                        });
                                      };
                                  }
                              });
                        };
                    })();
                    tdFour.appendChild(button);

                    var buttonTwo =document.createElement("INPUT");
                    buttonTwo.type = "button";
                    buttonTwo.className = "btn btn-lg btn-primary";
                    buttonTwo.value = "Deny";
                    button.name = i;
                    buttonTwo.style.marginRight = "10px";
                    buttonTwo.style.backgroundColor = "red";
                    buttonTwo.style.borderColor = "red";
                    buttonTwo.onclick = (function() {
                        var count = i;

                        return function(e) {

                            BootstrapDialog.confirm({
                                  title: 'Confirmation',
                                  message: 'Are you sure you want to deny this event?',
                                  type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: true, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  btnCancelLabel: 'No', // <-- Default value is 'Cancel',
                                  btnOKLabel: 'Yes', // <-- Default value is 'OK',
                                  btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
                                  callback: function(result) {
                                      // result will be true if button was click, while it will be false if users close the dialog directly.
                                      if(result) {
                                         $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

                                        structures[count].destroy({
                                            success: function() {
                                                $("#spinnerDiv").html("");
                                                var alertString = "Event successfully denied.";
                                                localStorage.setItem("eventAlertString", alertString);
                                                $(document).ready(loadEventTable());
                                                $(document).ready(loadExistingEventTable());
                                              },
                                              error: function(error) {
                                                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 2221");
                                                   BootstrapDialog.show({
                                                        type: BootstrapDialog.TYPE_DEFAULT,
                                                        title: "Error",
                                                        message: "Error occurred. Please try again."
                                                    });
                                                    $("#spinnerDiv").html("");
                                              }
                                        });
                                      };
                                  }
                              });

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
                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 2248");
               BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_DEFAULT,
                    title: "Error",
                    message: "Error occurred. Please try again."
                });
                $("#spinnerDiv").html("");
            }
        });
    }
}

function loadExistingEventTable() {
    return function() {

        $('#eventAlertDiv').css("display", "block");

        var alertString = localStorage.getItem("eventAlertString");
        if (alertString && alertString.length > 0) {
            localStorage.setItem("eventAlertString", "");
            $('#eventAlertDiv').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">Close</a><strong>'+alertString+'</strong></div>');
            $('#eventAlertDiv').delay(5000).fadeOut(500);
        };

        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

        var query = new Parse.Query("EventStructure");
        query.equalTo("isApproved", 1);
        query.ascending("eventDate");
        var structures = new Array();
        query.find({
            success: function(structures) {

                $("#existingLabel").html("Current Active Events (" + structures.length+")");

                var tableDiv = document.getElementById("currentEvents");
                var table = document.createElement("TABLE");
                var tableBody = document.createElement("TBODY");

                table.appendChild(tableBody);
                table.className = "table table-striped";
                table.id = "eventTable";

                var heading = new Array();
                heading[0] = "Title";
                heading[1] = "Date";
                heading[2] = "Location";
                heading[3] = "Message";
                heading[4] = "User";
                heading[5] = "Action";

                //TABLE COLUMNS

                var tr = document.createElement("TR");
                tableBody.appendChild(tr);

                $("#currentEvents").html("");

                for (var i = 0; i < heading.length; i++) {
                    var th = document.createElement("TH");
                    if (i != 3) {
                        th.width = '12%';
                    } else {
                        th.width = '40%';
                    };
                    th.appendChild(document.createTextNode(heading[i]));
                    tr.appendChild(th);
                };

                for (var i = 0; i < structures.length; i++) {
                    var tr = document.createElement("TR");

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("titleString")));
                    tr.appendChild(tdOne);

                    var tdTwo = document.createElement("TD");
                    var date = structures[i].get("eventDate");
                    var string = date.toString('dddd, MMMM d, yyyy @ h:mm tt');
                    tdTwo.appendChild(document.createTextNode(string));
                    tr.appendChild(tdTwo);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("locationString")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("messageString")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("userString")));
                    tr.appendChild(tdOne);

                    var tdFour = document.createElement("TD");

                    var buttonTwo =document.createElement("INPUT");
                    buttonTwo.type = "button";
                    buttonTwo.className = "btn btn-lg btn-primary";
                    buttonTwo.value = "Delete";
                    buttonTwo.style.marginRight = "10px";
                    buttonTwo.style.backgroundColor = "red";
                    buttonTwo.style.borderColor = "red";
                    buttonTwo.onclick = (function() {
                        var count = i;

                        return function(e) {

                            BootstrapDialog.confirm({
                                  title: 'Confirmation',
                                  message: 'Are you sure you want to delete this event?',
                                  type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: true, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  btnCancelLabel: 'No', // <-- Default value is 'Cancel',
                                  btnOKLabel: 'Yes', // <-- Default value is 'OK',
                                  btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
                                  callback: function(result) {
                                      // result will be true if button was click, while it will be false if users close the dialog directly.
                                      if(result) {
                                         $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

                                        structures[count].destroy({
                                            success: function() {
                                                $("#spinnerDiv").html("");
                                                var alertString = "Event successfully deleted.";
                                                localStorage.setItem("eventAlertString", alertString);
                                                $(document).ready(loadEventTable());
                                                $(document).ready(loadExistingEventTable());
                                              },
                                              error: function(error) {
                                                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 2379");
                                               BootstrapDialog.show({
                                                    type: BootstrapDialog.TYPE_DEFAULT,
                                                    title: "Error",
                                                    message: "Error occurred. Please try again."
                                                });
                                                $("#spinnerDiv").html("");
                                              }
                                        });
                                      };
                                  }
                              });

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
                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 2406");
               BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_DEFAULT,
                    title: "Error",
                    message: "Error occurred. Please try again."
                });
                $("#spinnerDiv").html("");
            }
        });
    }
}

function loadGroupTable() {
    return function() {

        $('#groupAlertDiv').css("display", "block");

        var alertString = localStorage.getItem("groupAlertString");
        if (alertString && alertString.length > 0) {
            localStorage.setItem("groupAlertString", "");
            $('#groupAlertDiv').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">Close</a><strong>'+alertString+'</strong></div>');
            $('#groupAlertDiv').delay(5000).fadeOut(500);
        };

        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

        var query = new Parse.Query("ExtracurricularStructure");
        query.ascending("titleString");
        var structures = new Array();
        query.find({
            success: function(structures) {

                $("#titleLabel").html("Currently Registered Groups (" + structures.length+")");

                var tableDiv = document.getElementById("groups");
                var table = document.createElement("TABLE");
                var tableBody = document.createElement("TBODY");

                table.appendChild(tableBody);
                table.className = "table table-striped";
                table.id = "groupTable";

                var heading = new Array();
                heading[0] = "Title";
                heading[1] = "Message";
                heading[2] = "Action";

                //TABLE COLUMNS

                var tr = document.createElement("TR");
                tableBody.appendChild(tr);

                $("#groups").html("");

                for (var i = 0; i < heading.length; i++) {
                    var th = document.createElement("TH");
                    th.width = '33%';
                    th.appendChild(document.createTextNode(heading[i]));
                    tr.appendChild(th);
                };

                for (var i = 0; i < structures.length; i++) {
                    var tr = document.createElement("TR");

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("titleString")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("descriptionString")));
                    tr.appendChild(tdOne);

                    var tdFour = document.createElement("TD");

                    var buttonTwo =document.createElement("INPUT");
                    buttonTwo.type = "button";
                    buttonTwo.className = "btn btn-lg btn-primary";
                    buttonTwo.value = "Delete";
                    buttonTwo.style.marginRight = "10px";
                    buttonTwo.style.backgroundColor = "red";
                    buttonTwo.style.borderColor = "red";
                    buttonTwo.onclick = (function() {
                        var count = i;

                        return function(e) {

                            BootstrapDialog.confirm({
                                  title: 'Confirmation',
                                  message: 'Are you sure you want to delete this group?',
                                  type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: true, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  btnCancelLabel: 'No', // <-- Default value is 'Cancel',
                                  btnOKLabel: 'Yes', // <-- Default value is 'OK',
                                  btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
                                  callback: function(result) {
                                      // result will be true if button was click, while it will be false if users close the dialog directly.
                                      if(result) {
                                         $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

                                        structures[count].destroy({
                                            success: function() {
                                                $("#spinnerDiv").html("");
                                                var alertString = "Group successfully deleted.";
                                                localStorage.setItem("groupAlertString", alertString);
                                                $(document).ready(loadGroupTable());
                                              },
                                              error: function(error) {
                                               errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 2514");
                                               BootstrapDialog.show({
                                                    type: BootstrapDialog.TYPE_DEFAULT,
                                                    title: "Error",
                                                    message: "Error occurred. Please try again."
                                                });
                                                $("#spinnerDiv").html("");
                                              }
                                        });
                                      };
                                  }
                              });

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
                $("#spinnerDiv").html("");
                alert(error);
            }
        });
    }
}

function loadErrorTable() {
    return function() {

        $('#errorAlertDiv').css("display", "block");

        var alertString = localStorage.getItem("errorAlertString");
        if (alertString && alertString.length > 0) {
            localStorage.setItem("errorAlertString", "");
            $('#errorAlertDiv').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">Close</a><strong>'+alertString+'</strong></div>');
            $('#errorAlertDiv').delay(5000).fadeOut(500);
        };

        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

        var query = new Parse.Query("ErrorStructure");
        query.descending("createdAt");
        query.find({
            success: function(structures) {

                $("#titleLabel").html("Recent iOS/Web App Errors and Crashes (" + structures.length+")");

                var tableDiv = document.getElementById("errors");
                var table = document.createElement("TABLE");
                var tableBody = document.createElement("TBODY");

                table.appendChild(tableBody);
                table.className = "table table-striped";

                var heading = new Array();
                heading[0] = "Date";
                heading[1] = "Name";
                heading[2] = "Message";
                heading[3] = "Device Token";
                heading[4] = "Username";
                heading[5] = "Version";
                heading[6] = "Action";

                //TABLE COLUMNS

                var tr = document.createElement("TR");
                tableBody.appendChild(tr);

                $("#errors").html("");

                for (var i = 0; i < heading.length; i++) {
                    var th = document.createElement("TH");
                    th.width = '14%';
                    th.appendChild(document.createTextNode(heading[i]));
                    tr.appendChild(th);
                };

                for (var i = 0; i < structures.length; i++) {
                    var tr = document.createElement("TR");
                    var tdTwo = document.createElement("TD");
                    var date = structures[i].createdAt;
                    var string = date.toString('dddd, MMMM d, yyyy @ h:mm tt');
                    tdTwo.appendChild(document.createTextNode(string));
                    tr.appendChild(tdTwo);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("nameString")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("infoString")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("deviceToken")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("username")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("version")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    var button =document.createElement("INPUT");
                    button.type = "button";
                    button.className = "btn btn-lg btn-primary";
                    button.value = "Delete";
                    button.name = i;
                    button.style.marginBottom = "10px";
                    button.style.backgroundColor = "red";
                    button.style.borderColor = "red";
                    button.onclick = (function() {

                        var count = i;

                        return function(e) {

                            structures[count].destroy({
                                success: function() {
                                    $("#spinnerDiv").html("");
                                    var alertString = "Error successfully deleted.";
                                    localStorage.setItem("errorAlertString", alertString);
                                    $(document).ready(loadErrorTable());
                                },
                                error: function(error) {
                                    errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 2639");
                                   BootstrapDialog.show({
                                        type: BootstrapDialog.TYPE_DEFAULT,
                                        title: "Error",
                                        message: "Error occurred. Please try again."
                                    });
                                    $("#spinnerDiv").html("");
                                }
                            });

                        };
                    })();
                    tdOne.appendChild(button);
                    tr.appendChild(tdOne);

                    tableBody.appendChild(tr);

                    tableDiv.appendChild(table);
                };

                $("#spinnerDiv").html("");

            },
            error: function(error) {
                $("#spinnerDiv").html("");
                alert(error);
            }
        });
    }
}

function loadLinksTable() {
    return function() {

        $('#linksAlertDiv').css("display", "block");

        var alertString = localStorage.getItem("linksAlertString");
        if (alertString && alertString.length > 0) {
            localStorage.setItem("linksAlertString", "");
            $('#linksAlertDiv').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">Close</a><strong>'+alertString+'</strong></div>');
            $('#linksAlertDiv').delay(5000).fadeOut(500);
        };

        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

        var query = new Parse.Query("UsefulLinkArray");
        query.ascending("index");
        query.find({
            success: function(structures) {

                var tableDiv = document.getElementById("links");

                $("#links").html("");

                for (var i = 0; i < structures.length; i++) {

                    var button = document.createElement("INPUT");
                    button.type = "button";
                    button.className = "btn btn-lg btn-primary";
                    button.value = "Delete Category";
                    button.name = i;
                    button.id = "deleteCategory_" + i;
                    button.style.float = "right";
                    button.style.backgroundColor = "red";
                    button.style.borderColor = "red";
                    button.onclick = (function() {

                        return function(e) {

                            var here = $(this);

                            BootstrapDialog.confirm({
                                  title: 'Confirmation',
                                  message: 'Are you sure you want to delete this category?',
                                  type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: true, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  btnCancelLabel: 'No', // <-- Default value is 'Cancel',
                                  btnOKLabel: 'Yes', // <-- Default value is 'OK',
                                  btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
                                  callback: function(result) {
                                      // result will be true if button was click, while it will be false if users close the dialog directly.
                                      if(result) {
                                         deleteCategoryFunction(here);
                                      };
                                  }
                              });

                        };
                    })();
                    tableDiv.appendChild(button);

                    var label = document.createElement("H4");
                    label.innerHTML = "Category Name";
                    label.style.float = "left";
                    label.style.marginRight = "10px";
                    label.id = "label_" + i;
                    tableDiv.appendChild(label);

                    var header = document.createElement("TEXTAREA");
                    header.value = structures[i].get("headerTitle");
                    header.class = "form-control";
                    header.style.display = "block";
                    header.id = "header_" + i;
                    header.width = "33%";
                    header.display = "block";
                    header.style.marginBottom = "10px";
                    tableDiv.appendChild(header);

                    var table = document.createElement("TABLE");
                    table.id = "bigTable_" + i;

                    var tableBody = document.createElement("TBODY");

                    tableBody.id = "table_" + i;

                    table.appendChild(tableBody);
                    table.className = "table table-striped";

                    var heading = new Array();
                    heading[0] = "Link Title";
                    heading[1] = "Hyperlink";
                    heading[2] = "Action";

                    //TABLE COLUMNS

                    var tr = document.createElement("TR");
                    tableBody.appendChild(tr);

                    for (var k = 0; k < heading.length; k++) {
                        var th = document.createElement("TH");
                        if (k < 2) {
                            th.width = "40%";
                        } else {
                            th.width = "20%";
                        };
                        th.appendChild(document.createTextNode(heading[k]));
                        tr.appendChild(th);
                    };

                    var links = structures[i].get("linksArray");

                    for (var j = 0; j < links.length; j++) {

                        var tr = document.createElement("TR");
                        tr.id = "row_" + i + "_" + j;

                        var object = links[j];

                        var tdOne = document.createElement("TD");

                        var titleTextArea = document.createElement("TEXTAREA");
                        titleTextArea.value = object["titleString"];
                        titleTextArea.class = "form-control";
                        titleTextArea.style.display = "block";
                        titleTextArea.style.width = "100%";
                        titleTextArea.style.overflowY = "scroll";
                        titleTextArea.style.resize = "none";
                        titleTextArea.id = "title_" + i + "_" + j;
                        tdOne.appendChild(titleTextArea);
                        tr.appendChild(tdOne);

                        var tdOne = document.createElement("TD");

                        var linkTextArea = document.createElement("TEXTAREA");
                        linkTextArea.value = object["URLString"];
                        linkTextArea.class = "form-control";
                        linkTextArea.style.display = "block";
                        linkTextArea.style.width = "100%";
                        linkTextArea.style.overflowY = "scroll";
                        linkTextArea.style.resize = "none";
                        linkTextArea.id = "link_" + i + "_" + j;
                        tdOne.appendChild(linkTextArea);
                        tr.appendChild(tdOne);

                        var tdOne = document.createElement("TD");
                        tdOne.id = "box_" + i + "_" + j;

                        var button = document.createElement("INPUT");
                        button.type = "button";
                        button.className = "btn btn-lg btn-primary";
                        button.value = "Delete";
                        button.name = i;
                        button.id = "delete_" + i + "_" + j;
                        button.style.marginRight = "10px";
                        button.style.backgroundColor = "red";
                        button.style.borderColor = "red";
                        button.onclick = (function() {

                            return function(e) {

                                var here = $(this);

                                BootstrapDialog.confirm({
                                      title: 'Confirmation',
                                      message: 'Are you sure you want to delete this link?',
                                      type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                      closable: true, // <-- Default value is false
                                      draggable: true, // <-- Default value is false
                                      btnCancelLabel: 'No', // <-- Default value is 'Cancel',
                                      btnOKLabel: 'Yes', // <-- Default value is 'OK',
                                      btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
                                      callback: function(result) {
                                          // result will be true if button was click, while it will be false if users close the dialog directly.
                                          if(result) {
                                             removeRowFunction(here);
                                          };
                                      }
                                  });

                            };
                        })();
                        tdOne.appendChild(button);

                        if (j == links.length - 1) {
                            var button = document.createElement("INPUT");
                            button.type = "button";
                            button.className = "btn btn-lg btn-primary";
                            button.value = "Add Link";
                            button.id = "add_" + i;
                            button.onclick = (function() {

                                return function(e) {

                                    addRowFunction($(this));

                                };
                            })();
                            tdOne.appendChild(button);

                            tr.appendChild(tdOne);

                            tableBody.appendChild(tr);
                        };

                        tr.appendChild(tdOne);

                        tableBody.appendChild(tr);

                        tableDiv.appendChild(table);
                    };
                };

                var button = document.createElement("INPUT");
                button.type = "button";
                button.className = "btn btn-lg btn-primary";
                button.value = "Add a New Category";
                button.name = i;
                button.style.marginBottom = "10px";
                button.id = "addCategory";
                button.onclick = (function() {

                    var count = i;
                    var little = j;

                    return function(e) {

                        addCategoryFunction();

                    };
                })();
                tableDiv.appendChild(button);

                $("#spinnerDiv").html("");

            },
            error: function(error) {
                $("#spinnerDiv").html("");
                alert(error);
            }
        });
    }
}

function getDesiredIndex(string, type) {
    //type = 0 = bigRow
    //type = 1 = littleRow

    if (type == 0) {
        var firstIndex = string.indexOf("_");
        var firstSubstring = string.substring(firstIndex + 1);
        var secondIndex = firstSubstring.indexOf("_");
        var secondSubstring;
        if (secondIndex == -1) {
            secondSubstring = firstSubstring;
        } else {
            secondSubstring = firstSubstring.substring(0, secondIndex);
        };
        var integer = parseInt(secondSubstring);
        return integer;
    } else if (type == 1) {
        var firstIndex = string.indexOf("_");
        var firstSubstring = string.substring(firstIndex + 1);
        var secondIndex = firstSubstring.indexOf("_");
        var secondSubstring = firstSubstring.substring(secondIndex + 1);
        var integer = parseInt(secondSubstring);
        return integer;
    } else {
        return -1;
    };
}

function deleteCategoryFunction(button) {

    var string = button.attr('id');

    var bigRow = getDesiredIndex(string, 0);

    var bigTable = document.getElementById("bigTable_" + bigRow);

    var everything = document.getElementById("links");

    var text = everything.getElementsByTagName('textarea');

    for (var n = 0; n < text.length; n++) {
        var ID = text[n].id;
        if (ID) {
            if (ID.indexOf("title") == 0) {
                var lastInt = getDesiredIndex(ID, 0);
                var littleRow = getDesiredIndex(ID, 1);
                if (lastInt > bigRow) {
                    text[n].id = "title_" + (lastInt - 1).toString() + "_" + littleRow.toString();
                };
            } else if (ID.indexOf("link") == 0) {
                var lastInt = getDesiredIndex(ID, 0);
                var littleRow = getDesiredIndex(ID, 1);
                if (lastInt > bigRow) {
                    text[n].id = "link_" + (lastInt - 1).toString() + "_" + littleRow.toString();
                };
            } else if (ID.indexOf("header") == 0) {
                var lastInt = getDesiredIndex(ID, 0);
                if (lastInt > bigRow) {
                    text[n].id = "header_" + (lastInt - 1).toString();
                };
            };
        };
    };

    var labels = everything.getElementsByTagName('h4');

    for (var m = 0; m < labels.length; m++) {
        var ID = labels[m].id;
        if (ID) {
            if (ID.indexOf("label") == 0) {
                var lastInt = getDesiredIndex(ID, 0);
                if (lastInt > bigRow) {
                    labels[m].id = "label_" + (lastInt - 1).toString();
                };
            };
        };
    };

    var tables = everything.getElementsByTagName('table');

    for (var o = 0; o < tables.length; o++) {
        var ID = tables[o].id;
        if (ID) {
            if (ID.indexOf("bigTable") == 0) {
                var lastInt = getDesiredIndex(ID, 0);
                if (lastInt > bigRow) {
                    tables[o].id = "bigTable_" + (lastInt - 1).toString();
                };
            };
        };
    };

    var bodies = everything.getElementsByTagName('tbody');

    for (var p = 0; p < bodies.length; p++) {
        var ID = bodies[p].id;
        if (ID) {
            if (ID.indexOf("table") == 0) {
                var lastInt = getDesiredIndex(ID, 0);
                if (lastInt > bigRow) {
                    bodies[p].id = "table_" + (lastInt - 1).toString();
                };
            };
        };
    };

    var rows = everything.getElementsByTagName('tr');

    for (var q = 0; q < rows.length; q++) {
        var ID = rows[q].id;
        if (ID) {
            if (ID.indexOf("row") > -1) {
                var lastInt = getDesiredIndex(ID, 0);
                var littleRow = getDesiredIndex(ID, 1);
                if (lastInt > bigRow) {
                    rows[q].id = "row_" + (lastInt - 1).toString() + "_" + littleRow.toString();
                };
            };
        };
    };

    var hold = everything.getElementsByTagName('td');

    for (var r = 0; r < hold.length; r++) {
        var ID = hold[r].id;
        if (ID) {
            if (ID.indexOf("box") > -1) {
                var lastInt = getDesiredIndex(ID, 0);
                var littleRow = getDesiredIndex(ID, 1);
                if (lastInt > bigRow) {
                    hold[r].id = "box_" + (lastInt - 1).toString() + "_" + littleRow.toString();
                };
            };
        };
    };

    var buttons = everything.getElementsByTagName('input');

    for (var s = 0; s < buttons.length; s++) {
        var ID = buttons[s].id;
        if (ID) {
            if (ID.indexOf("deleteCategory") == 0) {
                var lastInt = getDesiredIndex(ID, 0);
                if (lastInt > bigRow) {
                    buttons[s].id = "deleteCategory_" + (lastInt - 1).toString();
                };
            } else if (ID.indexOf("delete") == 0) {
                var lastInt = getDesiredIndex(ID, 0);
                var littleRow = getDesiredIndex(ID, 1);
                if (lastInt > bigRow) {
                    buttons[s].id = "delete_" + (lastInt - 1).toString() + "_" + littleRow.toString();
                };
            } else if (ID.indexOf("add") == 0) {
                var lastInt = getDesiredIndex(ID, 0);
                if (lastInt > bigRow) {
                    buttons[s].id = "add_" + (lastInt - 1).toString();
                };
            };
        };
    };

    var bigHeader = document.getElementById("header_" + bigRow);
    var bigText = document.getElementById("label_" + bigRow);
    var theButton = document.getElementById("deleteCategory_" + bigRow);
    bigTable.parentNode.removeChild(bigTable);
    bigHeader.parentNode.removeChild(bigHeader);
    bigText.parentNode.removeChild(bigText);
    theButton.parentNode.removeChild(theButton);
}

function addCategoryFunction() {

    var theButton = document.getElementById("addCategory");

    theButton.parentNode.removeChild(theButton);

    var bigDiv = document.getElementById("links");

    var count = bigDiv.getElementsByTagName('table').length;

    var button = document.createElement("INPUT");
    button.type = "button";
    button.className = "btn btn-lg btn-primary";
    button.value = "Delete Category";
    button.name = count;
    button.id = "deleteCategory_" + count;
    button.style.float = "right";
    button.style.backgroundColor = "red";
    button.style.borderColor = "red";
    button.onclick = (function() {

        return function(e) {

            var here = $(this);

            BootstrapDialog.confirm({
              title: 'Confirmation',
              message: 'Are you sure you want to delete this category?',
              type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
              closable: true, // <-- Default value is false
              draggable: true, // <-- Default value is false
              btnCancelLabel: 'No', // <-- Default value is 'Cancel',
              btnOKLabel: 'Yes', // <-- Default value is 'OK',
              btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
              callback: function(result) {
                  // result will be true if button was click, while it will be false if users close the dialog directly.
                  if(result) {
                     deleteCategoryFunction($(this));
                  };
              }
          });

        };
    })();
    bigDiv.appendChild(button);

    var label = document.createElement("H4");
    label.innerHTML = "Category Name";
    label.style.float = "left";
    label.style.marginRight = "10px";
    label.id = "label_" + count;
    bigDiv.appendChild(label);

    var header = document.createElement("TEXTAREA");
    header.class = "form-control";
    header.style.display = "block";
    header.id = "header_" + count;
    header.width = "33%";
    header.display = "block";
    header.style.marginBottom = "10px";
    bigDiv.appendChild(header);

    var table = document.createElement("TABLE");
    table.id = "bigTable_" + count;

    var tableBody = document.createElement("TBODY");

    tableBody.id = "table_" + count;

    table.appendChild(tableBody);
    table.className = "table table-striped";

    var heading = new Array();
    heading[0] = "Link Title";
    heading[1] = "Hyperlink";
    heading[2] = "Action";

    //TABLE COLUMNS

    var tr = document.createElement("TR");
    tableBody.appendChild(tr);

    for (var k = 0; k < heading.length; k++) {
        var th = document.createElement("TH");
        if (k < 2) {
            th.width = "40%";
        } else {
            th.width = "20%";
        };
        th.appendChild(document.createTextNode(heading[k]));
        tr.appendChild(th);
    };

    var tr = document.createElement("TR");
    tr.id = "row_" + count + "_" + 0;

    var tdOne = document.createElement("TD");

    var titleTextArea = document.createElement("TEXTAREA");
    titleTextArea.class = "form-control";
    titleTextArea.style.display = "block";
    titleTextArea.style.width = "100%";
    titleTextArea.style.overflowY = "scroll";
    titleTextArea.style.resize = "none";
    titleTextArea.id = "title_" + count + "_" + 0;
    tdOne.appendChild(titleTextArea);
    tr.appendChild(tdOne);

    var tdOne = document.createElement("TD");

    var linkTextArea = document.createElement("TEXTAREA");
    linkTextArea.class = "form-control";
    linkTextArea.style.display = "block";
    linkTextArea.style.width = "100%";
    linkTextArea.style.overflowY = "scroll";
    linkTextArea.style.resize = "none";
    linkTextArea.id = "link_" + count + "_" + 0;
    tdOne.appendChild(linkTextArea);
    tr.appendChild(tdOne);

    var tdOne = document.createElement("TD");
    tdOne.id = "box_" + count + "_" + 0;

    var button = document.createElement("INPUT");
    button.type = "button";
    button.className = "btn btn-lg btn-primary";
    button.value = "Delete";
    button.name = count;
    button.id = "delete_" + count + "_" + 0;
    button.style.marginRight = "10px";
    button.style.backgroundColor = "red";
    button.style.borderColor = "red";
    button.onclick = (function() {
        return function(e) {

            var here = $(this);

            BootstrapDialog.confirm({
              title: 'Confirmation',
              message: 'Are you sure you want to delete this link?',
              type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
              closable: true, // <-- Default value is false
              draggable: true, // <-- Default value is false
              btnCancelLabel: 'No', // <-- Default value is 'Cancel',
              btnOKLabel: 'Yes', // <-- Default value is 'OK',
              btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
              callback: function(result) {
                  // result will be true if button was click, while it will be false if users close the dialog directly.
                  if(result) {
                     removeRowFunction(here);
                  };
              }
          });

        };
    })();
    tdOne.appendChild(button);
    var button = document.createElement("INPUT");
    button.type = "button";
    button.className = "btn btn-lg btn-primary";
    button.value = "Add Link";
    button.id = "add_" + count;
    button.onclick = (function() {

        return function(e) {

            addRowFunction($(this));

        };
    })();
    tdOne.appendChild(button);

    tr.appendChild(tdOne);

    tableBody.appendChild(tr);

    bigDiv.appendChild(table);

    bigDiv.appendChild(theButton);
}

function removeRowFunction(button) {

    var string = button.attr('id');

    var bigRow = getDesiredIndex(string, 0);

    var littleRow = getDesiredIndex(string, 1);

    var tableBody = document.getElementById("table_" + bigRow);

    var count = tableBody.getElementsByTagName('tr').length;

    if (littleRow == 0 && count == 2) {
            var here = $(this);

            BootstrapDialog.confirm({
              title: 'Confirmation',
              message: 'Deleting this link will delete the entire category, since it is the last one left. Are you sure?',
              type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
              closable: true, // <-- Default value is false
              draggable: true, // <-- Default value is false
              btnCancelLabel: 'No', // <-- Default value is 'Cancel',
              btnOKLabel: 'Yes', // <-- Default value is 'OK',
              btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
              callback: function(result) {
                  // result will be true if button was click, while it will be false if users close the dialog directly.
                  if(result) {
                     var button = document.createElement('input');
                    button.id = "deleteCategory_" + bigRow;
                    var element = $(button);
                    deleteCategoryFunction(element);
                  };
              }
          });
    } else {

        var rows = tableBody.getElementsByTagName('tr');

        for (var k = 0; k < rows.length; k++) {
            var ID = rows[k].id;
            if (ID) {
                var lastInt = getDesiredIndex(ID, 1);
                if (lastInt > littleRow) {
                    rows[k].id = "row_" + bigRow + "_" + (lastInt - 1).toString();
                };
            };
        };

        var boxes = tableBody.getElementsByTagName('td');

        for (var m = 0; m < boxes.length; m++) {
            var ID = boxes[m].id;
            if (ID) {
                var lastInt = getDesiredIndex(ID, 1);
                if (lastInt > littleRow) {
                    boxes[m].id = "box_" + bigRow + "_" + (lastInt - 1).toString();
                };
            };
        };

        var text = tableBody.getElementsByTagName('textarea');

        for (var n = 0; n < text.length; n++) {
            var ID = text[n].id;
            if (ID) {
                if (ID.indexOf("title") == 0) {
                    var lastInt = getDesiredIndex(ID, 1);
                    if (lastInt > littleRow) {
                        text[n].id = "title_" + bigRow + "_" + (lastInt - 1).toString();
                    };
                } else if (ID.indexOf("link") == 0) {
                    var lastInt = getDesiredIndex(ID, 1);
                    if (lastInt > littleRow) {
                        text[n].id = "link_" + bigRow + "_" + (lastInt - 1).toString();
                    };
                };
            };
        };

        var buttons = tableBody.getElementsByTagName('input');

        for (var o = 0; o < buttons.length; o++) {
            var ID = buttons[o].id;
            if (ID) {
                if (ID.indexOf("delete") > -1) {
                    var lastInt = getDesiredIndex(ID, 1);
                    if (lastInt > littleRow) {
                        buttons[o].id = "delete_" + bigRow + "_" + (lastInt - 1).toString();
                    };
                };
            };
        };

        var row = document.getElementById("row_" + bigRow + "_" + littleRow);

        row.parentNode.removeChild(row);

        if (littleRow == tableBody.rows.length - 1) {
            var box = document.getElementById("box_" + bigRow + "_" + (littleRow - 1));

            var button = document.createElement("INPUT");
            button.type = "button";
            button.className = "btn btn-lg btn-primary";
            button.value = "Add Link";
            button.id = "add_" + bigRow;
            button.onclick = (function() {

                return function(e) {

                    addRowFunction($(this));

                };
            })();
            box.appendChild(button);
        };
    };
    
}

function addRowFunction(button) {

    var string = button.attr('id');

    var bigRow = getDesiredIndex(string, 0);

    var tableBody = document.getElementById("table_" + bigRow);

    var button = document.getElementById("add_" + bigRow);

    button.parentNode.removeChild(button);

    var littleRow = tableBody.getElementsByTagName('tr').length - 1;

    var tr = document.createElement("TR");
    tr.id = "row_" + bigRow + "_" + littleRow;

    var tdOne = document.createElement("TD");

    var titleTextArea = document.createElement("TEXTAREA");
    titleTextArea.class = "form-control";
    titleTextArea.style.display = "block";
    titleTextArea.style.width = "100%";
    titleTextArea.style.overflowY = "scroll";
    titleTextArea.style.resize = "none";
    titleTextArea.id = "title_" + bigRow + "_" + littleRow;
    tdOne.appendChild(titleTextArea);
    tr.appendChild(tdOne);

    var tdOne = document.createElement("TD");

    var linkTextArea = document.createElement("TEXTAREA");
    linkTextArea.class = "form-control";
    linkTextArea.style.display = "block";
    linkTextArea.style.width = "100%";
    linkTextArea.style.overflowY = "scroll";
    linkTextArea.style.resize = "none";
    linkTextArea.id = "link_" + bigRow + "_" + littleRow;
    tdOne.appendChild(linkTextArea);
    tr.appendChild(tdOne);

    var tdOne = document.createElement("TD");
    tdOne.id = "box_" + bigRow + "_" + littleRow;

    var button = document.createElement("INPUT");
    button.type = "button";
    button.className = "btn btn-lg btn-primary";
    button.value = "Delete";
    button.id = "delete_" + bigRow + "_" + littleRow;
    button.style.marginRight = "10px";
    button.style.backgroundColor = "red";
    button.style.borderColor = "red";
    button.onclick = (function() {

        return function(e) {

            var here = $(this);

            BootstrapDialog.confirm({
                  title: 'Confirmation',
                  message: 'Are you sure you want to delete this link?',
                  type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                  closable: true, // <-- Default value is false
                  draggable: true, // <-- Default value is false
                  btnCancelLabel: 'No', // <-- Default value is 'Cancel',
                  btnOKLabel: 'Yes', // <-- Default value is 'OK',
                  btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
                  callback: function(result) {
                      // result will be true if button was click, while it will be false if users close the dialog directly.
                      if(result) {
                         removeRowFunction(here);
                      };
                  }
              });

        };
    })();
    tdOne.appendChild(button);

    var button = document.createElement("INPUT");
    button.type = "button";
    button.className = "btn btn-lg btn-primary";
    button.value = "Add Link";
    button.id = "add_" + bigRow;
    button.onclick = (function() {

        return function(e) {

            addRowFunction($(this));

        };
    })();
    tdOne.appendChild(button);

    tr.appendChild(tdOne);

    tableBody.appendChild(tr);
}

function loadScheduleTable() {
    return function() {

        $('#scheduleAlertDiv').css("display", "block");

        var alertString = localStorage.getItem("scheduleAlertString");
        if (alertString && alertString.length > 0) {
            localStorage.setItem("scheduleAlertString", "");
            $('#scheduleAlertDiv').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">Close</a><strong>'+alertString+'</strong></div>');
            $('#scheduleAlertDiv').delay(5000).fadeOut(500);
        };

        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

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

                                structures.push(day);

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

                                for (var i = 0; i < structures.length; i++) {
                                    var tr = document.createElement("TR");
                                    var tdTwo = document.createElement("TD");
                                    var parts = structures[i].get("schoolDate").split('-');
                                    var date = new Date(parts[2], parts[0]-1,parts[1]);
                                    var string = date.toString('dddd, MMMM d, yyyy');
                                    var today = new Date();
                                    today = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
                                    if (date < today || (i == 0 && structures[i].get("isActive") == 0)) {
                                        tdTwo.appendChild(document.createTextNode("INACTIVE SCHOOL DAY - "));
                                    } else if (date.toDateString() === today.toDateString()) {
                                        tdTwo.style.color = "red";
                                    };
                                    tdTwo.appendChild(document.createTextNode(string));
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

                                    if (! date < today && (i != 0 || structures[i].get("isActive") == 1)) {

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

                                                var index = this.selectedIndex - 1;

                                                BootstrapDialog.confirm({
                                                      title: 'Confirmation',
                                                      message: "Are you sure you want to edit this day's schedule?",
                                                      type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                                      closable: true, // <-- Default value is false
                                                      draggable: true, // <-- Default value is false
                                                      btnCancelLabel: 'No', // <-- Default value is 'Cancel',
                                                      btnOKLabel: 'Yes', // <-- Default value is 'OK',
                                                      btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
                                                      callback: function(result) {
                                                          // result will be true if button was click, while it will be false if users close the dialog directly.
                                                          if(result) {
                                                             var key = reverseDictionary[index];

                                                            structures[count].set("scheduleType", key);
                                                            structures[count].set("customSchedule", "None.");
                                                            structures[count].set("customString", "");
                                                            structures[count].save(null, {
                                                                success: function(object) {
                                                                    $("#spinnerDiv").html("");
                                                                    var alertString = "Schedule successfully updated.";
                                                                    localStorage.setItem("scheduleAlertString", alertString);
                                                                    $(document).ready(loadScheduleTable());
                                                                },
                                                                error: function(error) {
                                                                    errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 3628");
                                                                    BootstrapDialog.show({
                                                                        type: BootstrapDialog.TYPE_DEFAULT,
                                                                        title: "Error",
                                                                        message: "Error occurred. Please try again."
                                                                    });
                                                                    $("#spinnerDiv").html("");
                                                                }
                                                            });
                                                          };
                                                      }
                                                  });

                                            };
                                        })();
                                        tdThree.appendChild(selectList);
                                        tr.appendChild(tdThree);
                                    } else {
                                        var tdThree = document.createElement("TD");
                                        tdThree.appendChild(document.createTextNode("No actions available."));
                                        tr.appendChild(tdThree);
                                    };

                                    var tdFour = document.createElement("TD");

                                    if (i < 2) {
                                        var button =document.createElement("INPUT");
                                        button.type = "button";
                                        button.className = "btn btn-lg btn-primary";
                                        button.value = "Snow Day";
                                        button.name = i;
                                        button.style.marginBottom = "10px";
                                        button.onclick = (function() {

                                            var count = i;

                                            return function(e) {

                                                if (count != structures.length - 1) {

                                                    BootstrapDialog.confirm({
                                                      title: 'Confirmation',
                                                      message: "Are you sure you want to make this day a snow day? This will affect all schedules after this date.",
                                                      type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                                      closable: true, // <-- Default value is false
                                                      draggable: true, // <-- Default value is false
                                                      btnCancelLabel: 'No', // <-- Default value is 'Cancel',
                                                      btnOKLabel: 'Yes', // <-- Default value is 'OK',
                                                      btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
                                                      callback: function(result) {
                                                          // result will be true if button was click, while it will be false if users close the dialog directly.
                                                          if(result) {
                                                             if (count === 0) {
                                                                window.showYesterday = false;
                                                            };
                                                            $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
                                                            Parse.Cloud.run('snowDay', { "ID" : structures[count].get("schoolDayID") }, {
                                                              success: function() {
                                                                $("#spinnerDiv").html("");
                                                                    var alertString = "Schedule successfully updated.";
                                                                    localStorage.setItem("scheduleAlertString", alertString);
                                                                    $(document).ready(loadScheduleTable());
                                                              },
                                                              error: function(error) {
                                                                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 3692");
                                                                BootstrapDialog.show({
                                                                    type: BootstrapDialog.TYPE_DEFAULT,
                                                                    title: "Error",
                                                                    message: "Error occurred. Please try again."
                                                                });
                                                                $("#spinnerDiv").html("");
                                                              }
                                                            });
                                                          };
                                                      }
                                                  });
                                                } else {
                                                    BootstrapDialog.show({
                                                        type: BootstrapDialog.TYPE_DEFAULT,
                                                        title: "Whoops!",
                                                        message: "You can't go back one day from here! This is the last day in the available queue."
                                                    });
                                                };

                                            };
                                        })();
                                        tdFour.appendChild(button);
                                        tr.appendChild(tdFour);
                                    };

                                    if (! date < today && (i != 0 || structures[i].get("isActive") == 1)) {
                                        var buttonTwo =document.createElement("INPUT");
                                        buttonTwo.type = "button";
                                        buttonTwo.className = "btn btn-lg btn-primary";
                                        buttonTwo.value = "Edit Custom Schedule";
                                        buttonTwo.name = i;
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

                                                window.location.replace("./custom");                       

                                            };
                                        })();
                                        tdFour.appendChild(buttonTwo);
                                    };

                                    tr.appendChild(tdFour);
                                    tableBody.appendChild(tr);

                                    tableDiv.appendChild(table);
                                };

                                $("#spinnerDiv").html("");
                            },
                            error: function(error) {
                                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 3758");
                                BootstrapDialog.show({
                                    type: BootstrapDialog.TYPE_DEFAULT,
                                    title: "Error",
                                    message: "Error occurred. Please try again."
                                });
                                $("#spinnerDiv").html("");
                            }
                        });
                    },
                    error: function(error) {
                        errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 3769");
                        BootstrapDialog.show({
                            type: BootstrapDialog.TYPE_DEFAULT,
                            title: "Error",
                            message: "Error occurred. Please try again."
                        });
                        $("#spinnerDiv").html("");
                    }
                });
            },
            error: function(error) {
                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 3780");
                BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_DEFAULT,
                    title: "Error",
                    message: "Error occurred. Please try again."
                });
                $("#spinnerDiv").html("");
            }
        });
    }
}