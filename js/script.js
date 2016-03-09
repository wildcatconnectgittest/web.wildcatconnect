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
var textArray = new Array();

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
                    var approveNumber = 0;
                    if (Parse.User.current() && (Parse.User.current().get("userType") === "Developer" || Parse.User.current().get("userType") === "Administration")) {
                        approveNumber = 1;
                    } else {
                        approveNumber = 0;
                    }
                    var userString = Parse.User.current().get("firstName") + " " + Parse.User.current().get("lastName");
                    var email = Parse.User.current().get("email");
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
                            'isApproved' : approveNumber,
                            'userString' : userString,
                            'email' : email
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
                            'isApproved' : approveNumber,
                            'userString' : userString,
                            'email' : email
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
                        var now = new Date();
                        object.set({
                            'extracurricularUpdateID' : theID + i,
                            'extracurricularID' : IDarray[i],
                            'messageString' : message,
                            'postDate' : now
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
    create: function(title, message) {
        var startDateDate = $("#startDateDate").datepicker("getDate");
        var startDateTime = $("#startDateTime").timepicker("getTime", startDateDate);
        var endDateDate = $("#endDateDate").datepicker("getDate");
        var endDateTime = $("#endDateTime").timepicker("getTime", endDateDate);
        var startString = startDateDate.toString();
        var endString = endDateDate.toString();
        var now = new Date();
        if (! title || ! message) {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "Please ensure you have filled out all required fields!"
            });
        } else if (startString === endString && startDateTime >= endDateTime) {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "The start time cannot be greater than or equal to the end time. Please try again."
            });
        } else if (startDateTime < now || endDateTime < now) {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "This opportunity cannot occur in the past. Please try again."
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
                    var approveNumber = 0;
                    if (Parse.User.current() && (Parse.User.current().get("userType") === "Developer" || Parse.User.current().get("userType") === "Administration")) {
                        approveNumber = 1;
                    } else {
                        approveNumber = 0;
                    }
                    var userString = Parse.User.current().get("firstName") + " " + Parse.User.current().get("lastName");
                    var email = Parse.User.current().get("email");
                    object.save({
                        'communityServiceID' : theID,
                        'commTitleString' : title,
                        'commSummaryString' : message,
                        'startDate' : startDateTime,
                        'endDate' : endDateTime,
                        'isApproved' : approveNumber,
                        'userString' : userString,
                        'email' : email
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
    create: function(title, location, message) {
        var eventDate = $("#eventDate").datepicker("getDate");
        var eventTime = $("#eventTime").timepicker("getTime", eventDate);
        var now = new Date();
        if (! title || ! location || ! message) {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "Please ensure you have filled out all required fields!"
            });
        } else if (eventTime < now) {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "This event cannot occur in the past. Please try again."
            });
        } else {
            $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
            var object = new EventStructure();
            var approveNumber = 0;
            if (Parse.User.current() && (Parse.User.current().get("userType") === "Developer" || Parse.User.current().get("userType") === "Administration")) {
                approveNumber = 1;
            } else {
                approveNumber = 0;
            } 
            var email = Parse.User.current().get("email");
            var query = new Parse.Query("EventStructure");
            query.descending("ID");
            var theID = 0;
            query.first().then(function(theEvent) {
                if (theEvent) {
                    theID = theEvent.get("ID") + 1;
                };
                object.save({
                    "titleString" : title,
                    "locationString" : location,
                    "eventDate" : eventTime,
                    "messageString" : message,
                    "isApproved" : approveNumber,
                    "userString" : Parse.User.current().get("firstName") + " " + Parse.User.current().get("lastName"),
                    'email' : email,
                    'ID' : theID
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
            }), function(error) {
                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 333");
                BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_DEFAULT,
                    title: "Error",
                    message: "Error occurred. Please try again."
                });
                $("#spinnerDiv").html("");
            }
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

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

var ScholarshipStructure = Parse.Object.extend("ScholarshipStructure", {
    create: function(title, creator, content) {
        var dueDate = $("#dueDate").datepicker("getDate");
        var now = new Date();
        if (! title || ! author || ! dueDate || ! content) {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "Please ensure you have filled out all required fields!"
            });
        } else if (dueDate < now) {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "This scholarship cannot be due in the past! Please try again."
            });
        } else {
            $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
            var object = new ScholarshipStructure();
            var email = Parse.User.current().get("email");
            var query = new Parse.Query("ScholarshipStructure");
            query.descending("ID");
            var theID = 0;
            query.first().then(function(theSchol) {
                if (theSchol) {
                    theID = theSchol.get("ID") + 1;
                };
                object.save({
                    "dueDate" : dueDate,
                    "email": email,
                    "messageString" : content,
                    "titleString" : title,
                    "userString" : creator,
                    "ID" : theID
                }, {
                    success: function() {
                        $("#spinnerDiv").html("");
                        localStorage.setItem("scholAlertString", "Scholarship successfully posted.");
                        window.location.replace("./scholarshipManage");
                    },
                    error: function(theObject, error) {
                        errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 546");
                        BootstrapDialog.show({
                            type: BootstrapDialog.TYPE_DEFAULT,
                            title: "Error",
                            message: "Error occurred. Please try again."
                        });
                        $("#spinnerDiv").html("");
                    }
                });
            }), function(error) {
                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 546");
                BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_DEFAULT,
                    title: "Error",
                    message: "Error occurred. Please try again."
                });
                $("#spinnerDiv").html("");
            }
        }
    }
});

var AlertStructure = Parse.Object.extend("AlertStructure", {
    create: function(title, author, alertTiming, content) {
        var alertDate = $("#alertDate").datepicker("getDate");
        var alertTime = $("#alertTime").timepicker("getTime", alertDate);
        var now = new Date();
        if (! title || ! author || ! alertTiming || ! content || (alertTiming === "time" && (! alertTime || ! alertTime))) {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "Please ensure you have filled out all required fields!"
            });
        } else if (alertTime < now && alertTiming === "time") {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "This alert cannot occur in the past! Please try again."
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
                    if (alertTiming === "now") {
                        var date =  moment();
                        var stringOne = date.format("MMMM ");
                        var stringTwo = date.format(", h:mm A");
                        var number = parseInt(date.format("D"));
                        var suffix = ordinal_suffix_of(number);
                        var dateString = stringOne + suffix + stringTwo;
                        console.log(dateString);
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
                        var date =  moment(alertTime);
                        var stringOne = date.format("MMMM ");
                        var stringTwo = date.format(", h:mm A");
                        var number = parseInt(date.format("d"));
                        var suffix = ordinal_suffix_of(number);
                        var dateString = stringOne + suffix + stringTwo;
                        object.save({
                            'alertID' : alertID + 1,
                            'titleString' : title,
                            'authorString' : author,
                            'dateString' : dateString,
                            'isReady' : 0,
                            'views' : 0,
                            'alertTime' : alertTime,
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
                                var userString = Parse.User.current().get("firstName") + " " + Parse.User.current().get("lastName");
                                object.save({
                                    'extracurricularID' : ECID + 1,
                                    'titleString' : title,
                                    'descriptionString' : content,
                                    'hasImage' : 0,
                                    'meetingIDs' : window.daysArray.join(""),
                                    'userString' : userString
                                },  {
                                    success: function(object) {
                                        Parse.User.current().fetch({
                                            success: function(user) {
                                                var ownedEC = user.get("ownedEC");
                                                ownedEC.push(ECID + 1);
                                                console.log(ownedEC);
                                                user.save({
                                                    'ownedEC' : ownedEC
                                                }, {
                                                    success : function(user) {
                                                        $("#spinnerDiv").html("");
                                                        localStorage.setItem("groupAlertString", "Group successfully registered.");
                                                        window.location.replace("./groupManage");
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
                $("#logIn").html("Sign In");
            }
        });
    });

    $('.form-forgot').submit(function() {
        event.preventDefault();

        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

        var data = $(this).serializeArray();

        var email = data[0].value;

        Parse.User.requestPasswordReset(email, {
            success: function() {
                $("#spinnerDiv").html("");
                BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_DEFAULT,
                    title: "Success",
                    message: "A recovery link has been sent to you at " + email + ". If you have any additional issues, <a href='mailto:support@wildcatconnect.org'>contact our support team</a>.",
                    onhide: function(dialogRef) {
                        window.location.replace("./login");
                    }
                });
            },
            error:function(error) {
                $("#spinnerDiv").html("");
                BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_DEFAULT,
                    title: "Error",
                    message: "An error occurred. Please try again.",
                    onhide: function(dialogRef) {
                        window.location.replace("./login");
                    }
                });
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

    $('.saveMessage').click(function() {
        event.preventDefault();

        var text = $("#message").val();

        var query = new Parse.Query("SpecialKeyStructure");
          query.equalTo("key", "appMessage");
          query.first({
            success: function(object) {
              object.set("value", text);
              object.save(null, {
                success: function() {
                    location.reload();
                },
                error: function(error) {
                    //
                }
              });
            },
            error: function(error) {
              //
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
                  window.location.replace("./index");
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

                    CS.create(data[0].value, data[1].value);
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

                    console.log(data);

                    theEvent.create(data[0].value, data[1].value, data[2].value);
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

                 console.log(data);
 
            var alert = new AlertStructure();

            alert.create(data[0].value, Parse.User.current().get("firstName") + " " + Parse.User.current().get("lastName"), data[1].value, data[2].value);
              };
          }
      });
    });

    $('.form-add-scholarship').submit(function() {
        event.preventDefault();

        var here = $(this);

        BootstrapDialog.confirm({
          title: 'Confirmation',
          message: 'Are you sure you want to submit this scholarship? It will be live to all app users.',
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

                 console.log(data);
 
            var schol = new ScholarshipStructure();

            schol.create(data[0].value, Parse.User.current().get("firstName") + " " + Parse.User.current().get("lastName"), data[1].value);
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

    $('.forgot').click(function() {
        event.preventDefault();
        window.location.href = "./forgot";
    });

    $('#dayGen').click(function() {
        event.preventDefault();
        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
        Parse.Cloud.run('SDSgen', null, {
          success: function() {
            $("#spinnerDiv").html("");
            var alertString = "Day successfully generated.";
            localStorage.setItem("scheduleAlertString", alertString);
            $(document).ready(loadScheduleTable());
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
    });

    $("#deleteErrors").click(function() {
        event.preventDefault();
        var query = new Parse.Query("ErrorStructure");
        query.find({
            success: function(objects) {
                Parse.Object.destroyAll(objects, {
                    success: function() {
                        $(document).ready(loadErrorTable());
                    },
                    error: function(objects, error) {
                        errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1203");
                        BootstrapDialog.show({
                            type: BootstrapDialog.TYPE_DEFAULT,
                            title: "Error",
                            message: "Error occurred. Please try again."
                        });
                        $("#spinnerDiv").html("");
                    }
                });
            }
        });
    });

    $("#noMail").click(function() {
        event.preventDefault();
        errorFunction("No confirmation e-mail maybe sent to " + Parse.User.current().get("email") + ".", "None.", "None.");
        BootstrapDialog.show({
          type: BootstrapDialog.TYPE_DEFAULT,
          closable: false,
          title: "Whoops!",
          message: "Our support team will look into this issue. We will contact you within 1-2 days to resolve this issue. Apologies for this inconvienence.",
          buttons: [
           {
            label: "Got it.",
            action: function(dialogItself) {
              window.location.replace("./login");
            }
            
          }]
        });
    });

    $("#commGen").click(function() {
        event.preventDefault();
        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
        var finalString = "";
        var query = new Parse.Query("CommunityServiceStructure");
        query.equalTo("isApproved", 1);
        query.ascending("startDate");
        var structures = new Array();
        query.find({
            success: function(structures) {
                for (var i = 0; i < structures.length; i++) {
                    if (i > 0) {
                        finalString = finalString + "\n\n";
                    };
                    finalString = finalString + structures[i].get("commTitleString").toUpperCase() + "\n";
                    var parts = structures[i].get("startDate");
                    var string = parts.toString('dddd, MMMM d, yyyy  @ h:mm');
                    finalString = finalString + "STARTS - " + string + "\n";
                    var parts = structures[i].get("endDate");
                    var string = parts.toString('dddd, MMMM d, yyyy @ h:mm');
                    finalString = finalString + "ENDS - " + string + "\n";
                    finalString = finalString + structures[i].get("commSummaryString");
                };
                BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_DEFAULT,
                    title: "Text Generation",
                    message: finalString
                });
                $("#spinnerDiv").html("");
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
    });

    $("#eventGen").click(function() {
        event.preventDefault();
        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
        var finalString = "";
        var query = new Parse.Query("EventStructure");
        query.equalTo("isApproved", 1);
        query.ascending("eventDate");
        var structures = new Array();
        query.find({
            success: function(structures) {
                for (var i = 0; i < structures.length; i++) {
                    if (i > 0) {
                        finalString = finalString + "\n\n";
                    };
                    finalString = finalString + structures[i].get("titleString").toUpperCase() + "\n";
                    finalString = finalString + structures[i].get("locationString") + "\n";
                    var parts = structures[i].get("eventDate");
                    var string = parts.toString('dddd, MMMM d, yyyy  @ h:mm');
                    finalString = finalString + string + "\n";
                    finalString = finalString + structures[i].get("messageString");
                };
                BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_DEFAULT,
                    title: "Text Generation",
                    message: finalString
                });
                $("#spinnerDiv").html("");
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
    });

    $("#scheduleGen").click(function() {
        event.preventDefault();
        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
        var finalString = "";
        var query = new Parse.Query("SchoolDayStructure");
        query.equalTo("isActive", 1);
        query.ascending("schoolDayID");
        query.find({
            success: function(objects) {
                var today = new Date();
                var now = moment();
                var nowString = now.format("MM-DD-YYYY");
                var index = 0;
                if (nowString == objects[0].get("schoolDate")) {
                    var hours = now.hour();
                    if (hours >= 15) {
                        index = 1;
                    };
                };
                var object = objects[index];
                var finalString = "";
                var parts = object.get("schoolDate").split('-');
                  var date = new Date(parts[2], parts[0]-1,parts[1]);
                  var theDate = moment(date);
                  var number = parseInt(date.toString("d"));
                    var suffix = ordinal_suffix_of(number);
                  var string = date.toString('dddd, MMMM ') + suffix + date.toString(', yyyy');
                finalString = finalString + string + "\n\n";
                if (object.get("scheduleType") === "*") {
                    finalString = finalString + object.get("customString") + "\n\n";
                    finalString = finalString + object.get("customSchedule");
                    BootstrapDialog.show({
                        type: BootstrapDialog.TYPE_DEFAULT,
                        title: "Schedule Generation",
                        message: finalString
                    });
                    $("#spinnerDiv").html("");
                } else {
                    var queryTwo = new Parse.Query("ScheduleType");
                    queryTwo.equalTo("typeID", object.get("scheduleType"));
                    queryTwo.first({
                        success: function(schedule) {
                            finalString = finalString + schedule.get("fullScheduleString") + "\n\n";
                            finalString = finalString + schedule.get("scheduleString");
                            BootstrapDialog.show({
                                type: BootstrapDialog.TYPE_DEFAULT,
                                title: "Schedule Generation",
                                message: finalString
                            });
                            $("#spinnerDiv").html("");
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
                };
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

    $('#selectSchol').click(function() {
        var title = $('#selectSchol').text();
        if (title === "Select All") {
            $('#selectSchol').text("Deselect All");
            $("input[class='scholarship']").each(function() {
                this.checked = true;
            });
        } else if (title === "Deselect All") {
            $('#selectSchol').text("Select All");
            $("input[class='scholarship']").each(function() {
                this.checked = false;
            });
        }; 
    });

    $('#selectComm').click(function() {
        var title = $('#selectComm').text();
        if (title === "Select All") {
            $('#selectComm').text("Deselect All");
            $("input[class='community']").each(function() {
                this.checked = true;
            });
        } else if (title === "Deselect All") {
            $('#selectComm').text("Select All");
            $("input[class='community']").each(function() {
                this.checked = false;
            });
        }; 
    });

    $('.generateA').click(function() {

        var dayString;
        var scheduleType;
        var scheduleName;
        var scheduleString;
        var theDay;
        var theNews;
        var theSchol;
        var theCommunity;
        var theEvents;

        BootstrapDialog.show({
          title: 'Generating your announcements...',
          size: BootstrapDialog.SIZE_SMALL,
          message: function(dialogItself) {
            var $form = $('<form></form>');
            $form.append('<a><img src="./../spinner.gif" alt="Logo" width="40" style="margin:0 auto;display:block;"/></a>');
            return $form;
          },// <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: false,
          onshow: function(dialog) {
            $("input[name='schoolDay']").each(function() {
                if (this.checked) {
                    var schoolDayID = parseInt(this.value);
                    var query = new Parse.Query("SchoolDayStructure");
                    query.equalTo("schoolDayID", schoolDayID);
                    query.first().then(function(day) {
                        theDay = day;
                        dayString = ($('label[for="' + day.get("schoolDayID") + '"]')).text();
                        scheduleType = day.get("scheduleType");
                        if (scheduleType === "*") {
                            scheduleName = day.get("customString");
                            scheduleString = day.get("customSchedule");
                            return;
                        } else {
                            var queryTwo = new Parse.Query("ScheduleType");
                            queryTwo.equalTo("typeID", scheduleType);
                            return queryTwo.first();
                        };
                    }).then(function(struct) {
                        if (! scheduleName && ! scheduleString) {
                            scheduleName = struct.get("fullScheduleString");
                            scheduleString = struct.get("scheduleString");
                        };
                    });
                };
            });
            var newsArray = [];
            $("input[class='news']").each(function() {
                if (this.checked) {
                    newsArray.push(parseInt(this.value));
                };
            });
            var query = new Parse.Query("NewsArticleStructure");
            query.containedIn("articleID", newsArray);
            query.find().then(function(ourNews) {
                theNews = ourNews;
                var scholArray = [];
                $("input[class='scholarship']").each(function() {
                    if (this.checked) {
                        scholArray.push(parseInt(this.value));
                    };
                });
                var query = new Parse.Query("ScholarshipStructure");
                query.containedIn("ID", scholArray);
                return query.find();
            }).then(function(ourSchol) {
                theSchol = ourSchol;
                var communityArray = [];
                $("input[class='community']").each(function() {
                    if (this.checked) {
                        communityArray.push(parseInt(this.value));
                    };
                });
                var query = new Parse.Query("CommunityServiceStructure");
                query.containedIn("communityServiceID", communityArray);
                return query.find();
            }).then(function(ourCommunity) {
                theCommunity = ourCommunity;
                var eventArray = [];
                $("input[class='event']").each(function() {
                    if (this.checked) {
                        eventArray.push(parseInt(this.value));
                    };
                });
                var query = new Parse.Query("EventStructure");
                query.containedIn("ID", eventArray);
                return query.find();
            }).then(function(ourEvents) {
                theEvents = ourEvents;
                dialog.close();
                BootstrapDialog.show({
                    title: 'Daily Announcements',
                    size: BootstrapDialog.SIZE_WIDE,
                    message: function(dialogItself) {
                        var $form = $('<form></form>');
                        var text = $("<i>These daily announcements are generated by WildcatConnect, Weymouth High School's official iPhone app. <a href='http://app.wildcatconnect.org' target='_blank'>Download today on the App Store!</a> Or, search \"Weymouth High\" ...</i>");
                        $form.append(text);
                        var header = $("<b><h3 style='text-align:center;'>" + dayString.toUpperCase() + ", " + scheduleName.toUpperCase() + ", DAILY ANNOUNCEMENTS</h3></b><h5 style='text-align:center;'>(All clubs/activities are held after school unless noted.)</h5>");
                        console.log(scheduleType);
                        if (scheduleType === "*") {
                            scheduleString = scheduleString.replace(/\r?\n/g, '<br />');
                            header = $("<b><h3 style='text-align:center;'>" + dayString.toUpperCase() + ", " + scheduleName.toUpperCase() + ", DAILY ANNOUNCEMENTS</h3></b><h5 style='text-align:center;'>(All clubs/activities are held after school unless noted.)</h5><div style='text-align:center;'>" + scheduleString + "</div><br>");
                        };
                        $form.append(header);
                        if (theNews.length > 0) {
                            var newsString = '<b><u><span style="background-color: yellow;">LATEST NEWS</span></u></b><br><br>';
                            for (var i = 0; i < theNews.length; i++) {
                                newsString = newsString + '<b>' + theNews[i].get("titleString") + '</b> - ' + theNews[i].get("authorString") + ' - ' + theNews[i].get("summaryString") + '<br>' + textArray[theNews[i].get("articleID")] + '<a href="'+theNews[i].get("archiveURL")+'" target="_blank"> Read more...</a><br><br>';
                            };
                            $form.append($(newsString));
                        };
                        if (theSchol.length > 0) {
                            var scholString = '<b><u><span style="background-color: yellow;">SCHOLARSHIP OPPORTUNITIES</span></u></b><br><br>';
                            for (var i = 0; i < theSchol.length; i++) {
                                scholString = scholString + '<b>' + theSchol[i].get("titleString") + '</b> - ' + linkifyStr(theSchol[i].get("messageString")) + '<br><br>';
                            };
                            //scholString = linkifyStr(scholString);
                            $form.append($(scholString));
                        };
                        if (theCommunity.length > 0) {
                            var commString = '<b><u><span style="background-color: yellow;">COMMUNITY SERVICE OPPORTUNITIES</span></u></b><br><br>';
                            for (var i = 0; i < theCommunity.length; i++) {
                                var date = theCommunity[i].get("startDate");
                                var string = date.toString('dddd, MMMM d @ h:mm tt');
                                commString = commString + '<b>' + theCommunity[i].get("commTitleString") + "</b> - " + string + " - " + linkifyStr(theCommunity[i].get("commSummaryString")) + '<br><br>';
                            };
                            //commString = linkifyStr(commString);
                            $form.append($(commString));
                        };
                        if (theEvents.length > 0) {
                            var eventString = '<b><u><span style="background-color: yellow;">UPCOMING EVENTS</span></u></b><br><br>';
                            for (var i = 0; i < theEvents.length; i++) {
                                var date = theEvents[i].get("eventDate");
                                var string = date.toString('dddd, MMMM d @ h:mm tt');
                                eventString = eventString + '<b>' + theEvents[i].get("titleString") + "</b> - " + string + " - " + linkifyStr(theEvents[i].get("messageString")) + '<br><br>';
                            };
                            //commString = linkifyStr(commString);
                            $form.append($(eventString));
                        };
                        return $form;
                    }
                });
            });
          }
        });
    });
    
});

function loadAnnouncements() {
    //Test...
    BootstrapDialog.show({
          title: 'Please wait as we load our database...',
          size: BootstrapDialog.SIZE_SMALL,
          message: function(dialogItself) {
            var $form = $('<form></form>');
            $form.append('<a><img src="./../spinner.gif" alt="Logo" width="40" style="margin:0 auto;display:block;"/></a>');
            return $form;
          },// <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: false,
          onshow: function(dialog) {
            var query = new Parse.Query("SchoolDayStructure");
            query.equalTo("isActive", 1);
            query.ascending("schoolDayID");
            query.limit(3);
            var schoolDays = new Array();
            var news = new Array();
            var scholarships = new Array();
            var community = new Array();
            var events = new Array();
            query.find().then(function(list) {
                schoolDays = list;
                var queryTwo = new Parse.Query("NewsArticleStructure");
                queryTwo.descending("createdAt");
                queryTwo.equalTo("isApproved", 1);
                queryTwo.limit(5);
                return queryTwo.find();
            }).then(function(list) {
                news = list;
                for (var i = 0; i < list.length; i++) {
                    textArray[list[i].get("articleID")] = list[i].get("contentURLString");
                };
                var queryThree = new Parse.Query("ScholarshipStructure");
                queryThree.ascending("dueDate");
                return queryThree.find();
            }).then(function(list) {
                scholarships = list;
                var queryFour = new Parse.Query("CommunityServiceStructure");
                queryFour.ascending("startDate");
                queryFour.equalTo("isApproved", 1);
                queryFour.limit(10);
                return queryFour.find();
            }).then(function(list) {
                community = list;
                var queryFive = new Parse.Query("EventStructure");
                queryFive.ascending("eventDate");
                queryFive.equalTo("isApproved", 1);
                queryFive.limit(5);
                return queryFive.find();
            }).then(function(list) {
                events = list;
                for (var i = 0; i < schoolDays.length; i++) {
                    var parts = schoolDays[i].get("schoolDate").split('-');
                    var date = new Date(parts[2], parts[0]-1,parts[1]);
                    var string = date.toString('dddd, MMMM d, yyyy');
                    var radioBtn = $("<input type='radio' name='schoolDay' value='" + schoolDays[i].get("schoolDayID") + "'/> <label for='" + schoolDays[i].get("schoolDayID") + "' value='" + string + "'>" + string + "</label><br>");
                    if (i == 0) {
                        radioBtn.attr("checked", "checked");
                    };
                    radioBtn.appendTo('#schoolDays');
                };
                for (var i = 0; i < news.length; i++) {
                    var string = news[i].get("titleString");
                    var radioBtn = $("<input type='checkbox' class='news' value='" + news[i].get("articleID") + "'/> <a href='javascript:loadArticle(" + news[i].get("articleID") + ");'><label>" + string + "</label></a><br>");
                    radioBtn.appendTo('#news');
                };
                if (news.length == 0) {
                    var text = $("<h5>No data available.</h5>");
                    text.appendTo('#news');
                };
                for (var i = 0; i < scholarships.length; i++) {
                    var string = scholarships[i].get("titleString");
                    var date = scholarships[i].get("dueDate");
                    string = string + " - DUE " + date.toString('dddd, MMMM d, yyyy');
                    var radioBtn = $("<input type='checkbox' class='scholarship' value=" + scholarships[i].get("ID") + "/> <a href='javascript:loadScholarship(" + scholarships[i].get("ID") + ");'><label>" + string + "</label></a><br>");
                    radioBtn.appendTo('#schols');
                };
                if (scholarships.length == 0) {
                    var text = $("<h5>No data available.</h5>");
                    text.appendTo('#schols');
                };
                for (var i = 0; i < community.length; i++) {
                    var string = community[i].get("commTitleString");
                    var radioBtn = $("<input type='checkbox' class='community' value=" + community[i].get("communityServiceID") + "/> <a href='javascript:loadCommunity(" + community[i].get("communityServiceID") + ");'><label>" + string + "</label></a><br>");
                    radioBtn.appendTo('#community');
                };
                if (community.length == 0) {
                    var text = $("<h5>No data available.</h5>");
                    text.appendTo('#community');
                };
                for (var i = 0; i < events.length; i++) {
                    var string = events[i].get("titleString");
                    var radioBtn = $("<input type='checkbox' class='event' value=" + events[i].get("ID") + "/> <a href='javascript:loadEvent(" + events[i].get("ID") + ");'><label>" + string + "</label></a><br>");
                    radioBtn.appendTo('#events');
                };
                if (events.length == 0) {
                    var text = $("<h5>No data available.</h5>");
                    text.appendTo('#events');
                };
                dialog.close();
            }, function(error) {
                dialog.close();
                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 4176");
                BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_DEFAULT,
                    title: "Error",
                    message: "Error occurred."
                });
            });
          }
      });
}

function loadArticle(ID) {
    var query = new Parse.Query("NewsArticleStructure");
    query.equalTo("articleID", ID);
    query.first().then(function(article) {
        var titleString = article.get("titleString");
        var summaryString = article.get("summaryString");
        var authorDate = article.get("authorString") + " | " + article.get("dateString");
        var url = null;
        if (article.get("imageFile")) {
            url = article.get("imageFile").url();
        };

        BootstrapDialog.show({
              title: 'Article Preview',
              size: BootstrapDialog.SIZE_WIDE,
              message: function(dialogItself) {
                var $form = $('<form></form>');
                $form.append('<h1 style="margin-top:0;">'+titleString+'</h1><h4><i>'+summaryString+'</i></h4><h5>'+authorDate+'</h5>');
                if (url) {
                    $form.append('<img src="'+url+'" style="width:50%;display:block;margin: 0 auto;">');
                };
                var textArea = $('<textarea rows="20" style="overflow-y: scroll; resize: none; width:100%;"></textarea>');
                textArea.val(window.textArray[ID]);
                $form.append('<hr style="border-color:#561838">').append(textArea);
                dialogItself.setData('text', textArea);
                return $form;
              },// <-- Default value is BootstrapDialog.TYPE_PRIMARY
              closable: true, // <-- Default value is false
              draggable: true,
              buttons: [{
                   label: 'SAVE',
                   cssClass: 'btn-primary',
                    action: function (dialogItself) {
                        var text = dialogItself.getData('text').val();
                        console.log(text);
                        window.textArray[ID] = text;
                        dialogItself.close();
                    } 
                }]
          });
    }), function(error) {
        console.log(error);
    }
}

function loadScholarship(ID) {
    var query = new Parse.Query("ScholarshipStructure");
    query.equalTo("ID", ID);
    query.first().then(function(schol) {
        var date = schol.get("dueDate");
        var string = "DUE - " + date.toString("dddd, MMMM d");
        BootstrapDialog.show({
            title: 'Scholarship Preview',
            message: function(dialogItself) {
                var $form = $('<form></form>');
                $form.append("<h1 style='margin-top:0px;'>" + schol.get("titleString") + "</h1>" + string + "<hr style='border-color:#561838';></hr>" + linkifyStr(schol.get("messageString")));
                return $form;
            }
        });
    }), function(error) {
        console.log(error);
    }
}

function loadCommunity(ID) {
    var query = new Parse.Query("CommunityServiceStructure");
    query.equalTo("communityServiceID", ID);
    query.first().then(function(comm) {
        var date = comm.get("startDate");
        var string = "STARTS - " + date.toString("dddd, MMMM d @ h:mm tt");
        var date = comm.get("endDate");
       string = string + "<br>ENDS - " + date.toString("dddd, MMMM d @ h:mm tt");
        BootstrapDialog.show({
            title: 'Community Service Opportunity Preview',
            message: function(dialogItself) {
                var $form = $('<form></form>');
                $form.append("<h1 style='margin-top:0px;'>" + comm.get("commTitleString") + "</h1>" + string + "<hr style='border-color:#561838';></hr>" + linkifyStr(comm.get("commSummaryString")));
                return $form;
            }
        });
    }), function(error) {
        console.log(error);
    }
}

function loadEvent(ID) {
    var query = new Parse.Query("EventStructure");
    query.equalTo("ID", ID);
    query.first().then(function(theEvent) {
        var date = theEvent.get("eventDate");
        var string = date.toString("dddd, MMMM d @ h:mm tt");
        BootstrapDialog.show({
            title: 'Event Preview',
            message: function(dialogItself) {
                var $form = $('<form></form>');
                $form.append("<h1 style='margin-top:0px;'>" + theEvent.get("titleString") + "</h1>" + string + "<hr style='border-color:#561838';></hr>" + linkifyStr(theEvent.get("messageString")));
                return $form;
            }
        });
    }), function(error) {
        console.log(error);
    }
}

function errorFunction(error, url, line) {
    var ErrorStructure = Parse.Object.extend("ErrorStructure");
    var theError = new ErrorStructure();
    theError.set("deviceToken", "Web Client");
    theError.set("nameString", "JavaScript Error");
    theError.set("infoString", "Message = " + error + " - File = " + url + " - Line = " + line);
    theError.set("version", "Latest web release.");
    if (Parse.User.current()) {
        theError.set("username", Parse.User.current().get("username"));
    } else {
        theError.set("No username.");
    };
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
                heading[2] = "Username";
				heading[3] = "E-Mail";
                heading[4] = "User Type";
                heading[5] = "Change Type";
				heading[6] = "Action";

				//TABLE COLUMNS

				var tr = document.createElement("TR");
				tableBody.appendChild(tr);

				$("#existingUsers").html("");

				for (var i = 0; i < heading.length; i++) {
					var th = document.createElement("TH");
					th.width = '15%';
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

                    var tdOne = document.createElement("TD");
                    if (structures[i].get("verified") === 0) {
                        tdOne.appendChild(document.createTextNode(structures[i].get("username") + " - UNVERIFIED"));
                        tdOne.style.color = "red";
                    } else {
                        tdOne.appendChild(document.createTextNode(structures[i].get("username")));
                    }
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

                    var theArray = ["Developer", "Administration", "Faculty", "Lunch Manager", "Student"];

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

function loadExistingNewsTable() {
    return function() {

        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

        var query = new Parse.Query("NewsArticleStructure");
        query.equalTo("isApproved", 1);
        query.descending("createdAt");
        var structures = new Array();
        query.find({
            success: function(structures) {

                $("#existingLabel").html("Current Active Wildcat News Stories (" + structures.length+")");

                var tableDiv = document.getElementById("currentNews");
                var table = document.createElement("TABLE");
                var tableBody = document.createElement("TBODY");

                table.appendChild(tableBody);
                table.className = "table table-striped";
                table.id = "newsTable";

                var heading = new Array();
                heading[0] = "Date Submitted";
                heading[1] = "Author";
                heading[2] = "Title";
                heading[3] = "Content";
                heading[4] = "Likes";
                heading[5] = "Action";

                //TABLE COLUMNS

                var tr = document.createElement("TR");
                tableBody.appendChild(tr);

                $("#currentNews").html("");

                for (var i = 0; i < heading.length; i++) {
                    var th = document.createElement("TH");
                    th.width = "15%";
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
                    tdOne.appendChild(document.createTextNode(structures[i].get("titleString")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");

                    var contentButton =document.createElement("INPUT");
                    contentButton.type = "button";
                    contentButton.className = "btn btn-lg btn-primary";
                    contentButton.value = "View Content";
                    contentButton.name = i;
                    contentButton.style.marginRight = "10px";
                    contentButton.onclick = (function() {
                        var count = i;

                        return function(e) {

                            var url = structures[count].get("archiveURL");

                            var win = window.open(url, '_blank');
                            win.focus();

                        };
                    })();
                    tdOne.appendChild(contentButton);
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("likes")));
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
                                  message: 'Are you sure you want to delete this story?',
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
                                                var alertString = "Story successfully deleted.";
                                                localStorage.setItem("newsAlertString", alertString);
                                                $(document).ready(loadNewsTable());
                                                $(document).ready(loadExistingNewsTable());
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
        query.descending("createdAt");
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
                heading[2] = "Title";
                heading[3] = "Content";
                heading[4] = "Action";

                //TABLE COLUMNS

                var tr = document.createElement("TR");
                tableBody.appendChild(tr);

                $("#newsRequests").html("");

                for (var i = 0; i < heading.length; i++) {
                    var th = document.createElement("TH");
                    th.width = "15%";
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
                    tdOne.appendChild(document.createTextNode(structures[i].get("titleString")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");

                    var contentButton =document.createElement("INPUT");
                    contentButton.type = "button";
                    contentButton.className = "btn btn-lg btn-primary";
                    contentButton.value = "View Content";
                    contentButton.name = i;
                    contentButton.style.marginRight = "10px";
                    contentButton.onclick = (function() {
                        var count = i;

                        return function(e) {

                            var titleString = structures[count].get("titleString");
                            var summaryString = structures[count].get("summaryString");
                            var authorDate = structures[count].get("authorString") + " | " + structures[count].get("dateString");
                            var content = structures[count].get("contentURLString");
                            content = linkifyStr(content);
                            content = content.replace(/\r?\n/g, '<br />');
                            var url = null;
                            if (structures[count].get("imageFile")) {
                                url = structures[count].get("imageFile").url();
                            };

                            BootstrapDialog.show({
                                  title: 'Article Preview',
                                  size: BootstrapDialog.SIZE_WIDE,
                                  message: function(dialogItself) {
                                    var $form = $('<form></form>');
                                    $form.append('<h1 style="margin-top:0;">'+titleString+'</h1><h4><i>'+summaryString+'</i></h4><h5>'+authorDate+'</h5>');
                                    if (url) {
                                        $form.append('<img src="'+url+'" style="width:50%;display:block;margin: 0 auto;">');
                                    };
                                    $form.append('<hr style="border-color:#561838">' + content);
                                    return $form;
                                  },// <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: true, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  buttons: [{
                                       label: 'OK',
                                        action: function (dialogItself) {
                                            dialogItself.close();
                                        } 
                                    }]
                              });

                        };
                    })();
                    tdOne.appendChild(contentButton);
                    tr.appendChild(tdOne);

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
                                                $(document).ready(loadExistingNewsTable());
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

                            var name = structures[count].get("userString");
                            var e = structures[count].get("email");
                            var title = structures[count].get("titleString");
                            var admin = Parse.User.current().get("firstName") + " " + Parse.User.current().get("lastName");
                            var adminMail = Parse.User.current().get("email");

                            BootstrapDialog.show({
                                  title: 'Confirmation',
                                  message: function(dialogItself) {
                                    var $form = $('<form></form>');
                                    var $message = $('<textarea maxlength="400" rows="4" style="overflow-y: scroll; resize: none; width:100%;"></textarea>');
                                    dialogItself.setData('message', $message);
                                    $form.append('Are you sure you want to deny this Wildcat News Story? Please enter a brief message explaining the reason for the denial. This will be sent in an e-mail to the story\'s creator, '+name+', as well as to your e-mail for reference.<br><br><label>Message</label><br>').append($message);
                                    return $form;
                                  },// <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: false, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  buttons: [{
                                       label: 'Cancel',
                                        action: function (dialogItself) {
                                            dialogItself.close();
                                        } 
                                    }, {
                                        label: 'Deny',
                                        cssClass: 'btn-primary',
                                        action: function (dialogItself) {
                                            var text = dialogItself.getData('message').val();

                                            $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

                                            Parse.Cloud.run('denyStructure', { "name" : name , "type" : "news" , "email" : e , "message" : text , "title" : title , "admin" : admin , "adminMail" : adminMail }, {
                                              success: function() {
                                                structures[count].destroy({
                                                    success: function() {
                                                        $("#spinnerDiv").html("");
                                                        dialogItself.close();
                                                        var alertString = "Story successfully denied. You will receive an e-mail with the denial message, for your reference.";
                                                        localStorage.setItem("newsAlertString", alertString);
                                                        $(document).ready(loadNewsTable());
                                                        $(document).ready(loadExistingNewsTable());
                                                      },
                                                      error: function(error) {
                                                        dialogItself.close();
                                                        errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 2020");
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
                                                dialogItself.close();
                                                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1659");
                                               BootstrapDialog.show({
                                                    type: BootstrapDialog.TYPE_DEFAULT,
                                                    title: "Error",
                                                    message: "Error occurred. Please try again."
                                                });
                                                $("#spinnerDiv").html("");
                                              }
                                            });
                                        }
                                    }]
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
        query.descending("createdAt");
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
                                  message: 'Are you sure you want to approve this event? It will be live to all app users.',
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

                            var name = structures[count].get("userString");
                            var e = structures[count].get("email");
                            var title = structures[count].get("titleString");
                            var admin = Parse.User.current().get("firstName") + " " + Parse.User.current().get("lastName");
                            var adminMail = Parse.User.current().get("email");

                            BootstrapDialog.show({
                                  title: 'Confirmation',
                                  message: function(dialogItself) {
                                    var $form = $('<form></form>');
                                    var $message = $('<textarea maxlength="400" rows="4" style="overflow-y: scroll; resize: none; width:100%;"></textarea>');
                                    dialogItself.setData('message', $message);
                                    $form.append('Are you sure you want to deny this event? Please enter a brief message explaining the reason for the denial. This will be sent in an e-mail to the event\'s creator, '+name+', as well as to your e-mail for reference.<br><br><label>Message</label><br>').append($message);
                                    return $form;
                                  },// <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: false, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  buttons: [{
                                       label: 'Cancel',
                                        action: function (dialogItself) {
                                            dialogItself.close();
                                        } 
                                    }, {
                                        label: 'Deny',
                                        cssClass: 'btn-primary',
                                        action: function (dialogItself) {
                                            var text = dialogItself.getData('message').val();

                                            $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

                                            Parse.Cloud.run('denyStructure', { "name" : name , "type" : "event" , "email" : e , "message" : text , "title" : title , "admin" : admin , "adminMail" : adminMail }, {
                                              success: function() {
                                                structures[count].destroy({
                                                    success: function() {
                                                        $("#spinnerDiv").html("");
                                                        dialogItself.close();
                                                        var alertString = "Event successfully denied. You will receive an e-mail with the denial message, for your reference.";
                                                        localStorage.setItem("eventAlertString", alertString);
                                                        $(document).ready(loadEventTable());
                                                        $(document).ready(loadExistingEventTable());
                                                      },
                                                      error: function(error) {
                                                        dialogItself.close();
                                                        errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 2020");
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
                                                dialogItself.close();
                                                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1659");
                                               BootstrapDialog.show({
                                                    type: BootstrapDialog.TYPE_DEFAULT,
                                                    title: "Error",
                                                    message: "Error occurred. Please try again."
                                                });
                                                $("#spinnerDiv").html("");
                                              }
                                            });
                                        }
                                    }]
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

function loadCommunityTable() {
    return function() {

        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

        var query = new Parse.Query("CommunityServiceStructure");
        query.equalTo("isApproved", 0);
        query.ascending("startDate");
        var structures = new Array();
        query.find({
            success: function(structures) {

                $("#titleLabel").html("Pending Community Service Requests (" + structures.length+")");

                var tableDiv = document.getElementById("communityRequests");
                var table = document.createElement("TABLE");
                var tableBody = document.createElement("TBODY");

                table.appendChild(tableBody);
                table.className = "table table-striped";

                var heading = new Array();
                heading[0] = "Title";
                heading[1] = "Start Date";
                heading[2] = "End Date";
                heading[3] = "Message";
                heading[4] = "User";
                heading[5] = "Action";

                //TABLE COLUMNS

                var tr = document.createElement("TR");
                tableBody.appendChild(tr);

                $("#communityRequests").html("");

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
                    tdOne.appendChild(document.createTextNode(structures[i].get("commTitleString")));
                    tr.appendChild(tdOne);

                    var tdTwo = document.createElement("TD");
                    var date = structures[i].get("startDate");
                    var string = date.toString('dddd, MMMM d, yyyy @ h:mm tt');
                    tdTwo.appendChild(document.createTextNode(string));
                    tr.appendChild(tdTwo);

                    var tdTwo = document.createElement("TD");
                    var date = structures[i].get("endDate");
                    var string = date.toString('dddd, MMMM d, yyyy @ h:mm tt');
                    tdTwo.appendChild(document.createTextNode(string));
                    tr.appendChild(tdTwo);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("commSummaryString")));
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
                                  message: 'Are you sure you want to approve this opportunity? It will be live to all app users.',
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
                                                var alertString = "Opportunity successfully approved.";
                                                localStorage.setItem("commAlertString", alertString);
                                                $(document).ready(loadCommunityTable());
                                                $(document).ready(loadExistingCommunityTable());
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

                            var name = structures[count].get("userString");
                            var e = structures[count].get("email");
                            var title = structures[count].get("commTitleString");
                            var admin = Parse.User.current().get("firstName") + " " + Parse.User.current().get("lastName");
                            var adminMail = Parse.User.current().get("email");

                            BootstrapDialog.show({
                                  title: 'Confirmation',
                                  message: function(dialogItself) {
                                    var $form = $('<form></form>');
                                    var $message = $('<textarea maxlength="400" rows="4" style="overflow-y: scroll; resize: none; width:100%;"></textarea>');
                                    dialogItself.setData('message', $message);
                                    $form.append('Are you sure you want to deny this opportunity? Please enter a brief message explaining the reason for the denial. This will be sent in an e-mail to the opportunity\'s creator, '+name+', as well as to your e-mail for reference.<br><br><label>Message</label><br>').append($message);
                                    return $form;
                                  },// <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: false, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  buttons: [{
                                       label: 'Cancel',
                                        action: function (dialogItself) {
                                            dialogItself.close();
                                        } 
                                    }, {
                                        label: 'Deny',
                                        cssClass: 'btn-primary',
                                        action: function (dialogItself) {
                                            var text = dialogItself.getData('message').val();

                                            $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

                                            Parse.Cloud.run('denyStructure', { "name" : name , "type" : "comm" , "email" : e , "message" : text , "title" : title , "admin" : admin , "adminMail" : adminMail }, {
                                              success: function() {
                                                structures[count].destroy({
                                                    success: function() {
                                                        $("#spinnerDiv").html("");
                                                        dialogItself.close();
                                                        var alertString = "Opportunity successfully denied. You will receive an e-mail with the denial message, for your reference.";
                                                        localStorage.setItem("commAlertString", alertString);
                                                        $(document).ready(loadCommunityTable());
                                                        $(document).ready(loadExistingCommunityTable());
                                                      },
                                                      error: function(error) {
                                                        dialogItself.close();
                                                        errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 2020");
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
                                                dialogItself.close();
                                                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1659");
                                               BootstrapDialog.show({
                                                    type: BootstrapDialog.TYPE_DEFAULT,
                                                    title: "Error",
                                                    message: "Error occurred. Please try again."
                                                });
                                                $("#spinnerDiv").html("");
                                              }
                                            });
                                        }
                                    }]
                              });

                        };
                    })();
                    tdFour.appendChild(buttonTwo);

                    var buttonTwo = document.createElement("INPUT");
                    buttonTwo.type = "button";
                    buttonTwo.className = "btn btn-lg btn-primary";
                    buttonTwo.value = "Send to ILT";
                    button.name = i;
                    buttonTwo.style.marginTop = "10px";
                    buttonTwo.style.backgroundColor = "green";
                    buttonTwo.style.borderColor = "green";
                    buttonTwo.onclick = (function() {
                        var count = i;

                        return function(e) {

                            var name = structures[count].get("userString");
                            var e = structures[count].get("email");
                            var title = structures[count].get("commTitleString");
                            var admin = Parse.User.current().get("firstName") + " " + Parse.User.current().get("lastName");
                            var adminMail = Parse.User.current().get("email");
                            var fullText = structures[count].get("commSummaryString");

                            BootstrapDialog.show({
                                  title: 'Confirmation',
                                  message: function(dialogItself) {
                                    var $form = $('<form></form>');
                                    var $message = $('<textarea maxlength="400" rows="4" style="overflow-y: scroll; resize: none; width:100%;"></textarea>');
                                    dialogItself.setData('message', $message);
                                    $form.append('Are you sure you want to send this opportunity to ILT for review? Please enter a brief message explaining the reason for this decision. This will be sent in an e-mail to the opportunity\'s creator, '+name+', as well as to your e-mail for reference.<br><br><label>Message</label><br>').append($message);
                                    return $form;
                                  },// <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: false, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  buttons: [{
                                       label: 'Cancel',
                                        action: function (dialogItself) {
                                            dialogItself.close();
                                        } 
                                    }, {
                                        label: 'Send to ILT',
                                        cssClass: 'btn-primary',
                                        action: function (dialogItself) {
                                            var text = dialogItself.getData('message').val();

                                            $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

                                            Parse.Cloud.run('denyStructure', { "name" : name , "type" : "ILT" , "email" : e , "message" : text , "title" : title , "admin" : admin , "adminMail" : adminMail , "fullText" : fullText }, {
                                              success: function() {
                                                structures[count].destroy({
                                                    success: function() {
                                                        $("#spinnerDiv").html("");
                                                        dialogItself.close();
                                                        var alertString = "Opportunity successfully set to ILT status. You will receive an e-mail with the message, for your reference.";
                                                        localStorage.setItem("commAlertString", alertString);
                                                        $(document).ready(loadCommunityTable());
                                                        $(document).ready(loadExistingCommunityTable());
                                                      },
                                                      error: function(error) {
                                                        dialogItself.close();
                                                        errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 2020");
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
                                                dialogItself.close();
                                                errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1659");
                                               BootstrapDialog.show({
                                                    type: BootstrapDialog.TYPE_DEFAULT,
                                                    title: "Error",
                                                    message: "Error occurred. Please try again."
                                                });
                                                $("#spinnerDiv").html("");
                                              }
                                            });
                                        }
                                    }]
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

function loadExistingCommunityTable() {
    return function() {

        $('#communityAlertDiv').css("display", "block");

        var alertString = localStorage.getItem("commAlertString");
        if (alertString && alertString.length > 0) {
            localStorage.setItem("commAlertString", "");
            $('#communityAlertDiv').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">Close</a><strong>'+alertString+'</strong></div>');
            $('#communityAlertDiv').delay(5000).fadeOut(500);
        };

        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

        var query = new Parse.Query("CommunityServiceStructure");
        query.equalTo("isApproved", 1);
        query.ascending("startDate");
        var structures = new Array();
        query.find({
            success: function(structures) {

                $("#existingLabel").html("Current Active Community Service Opportunities (" + structures.length+")");

                var tableDiv = document.getElementById("currentCommunity");
                var table = document.createElement("TABLE");
                var tableBody = document.createElement("TBODY");

                table.appendChild(tableBody);
                table.className = "table table-striped";
                table.id = "communityTable";

                var heading = new Array();
                heading[0] = "Title";
                heading[1] = "Start Date";
                heading[2] = "End Date";
                heading[3] = "Message";
                heading[4] = "User";
                heading[5] = "Action";

                //TABLE COLUMNS

                var tr = document.createElement("TR");
                tableBody.appendChild(tr);

                $("#currentCommunity").html("");

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
                    tdOne.appendChild(document.createTextNode(structures[i].get("commTitleString")));
                    tr.appendChild(tdOne);

                    var tdTwo = document.createElement("TD");
                    var date = structures[i].get("startDate");
                    var string = date.toString('dddd, MMMM d, yyyy @ h:mm tt');
                    tdTwo.appendChild(document.createTextNode(string));
                    tr.appendChild(tdTwo);

                    var tdTwo = document.createElement("TD");
                    var date = structures[i].get("endDate");
                    var string = date.toString('dddd, MMMM d, yyyy @ h:mm tt');
                    tdTwo.appendChild(document.createTextNode(string));
                    tr.appendChild(tdTwo);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("commSummaryString")));
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
                                  message: 'Are you sure you want to delete this opportunity?',
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
                                                var alertString = "Opportunity successfully deleted.";
                                                localStorage.setItem("commAlertString", alertString);
                                                $(document).ready(loadCommunityTable());
                                                $(document).ready(loadExistingCommunityTable());
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
        if (Parse.User.current() && (Parse.User.current().get("userType") === "Developer" || Parse.User.current().get("userType") === "Administration")) {
            //
          } else {
            var array = Parse.User.current().get("ownedEC");
            query.containedIn("extracurricularID", array);
          };
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
                heading[1] = "Owner";
                heading[2] = "Description";
                heading[3] = "Action";

                //TABLE COLUMNS

                var tr = document.createElement("TR");
                tableBody.appendChild(tr);

                $("#groups").html("");

                for (var i = 0; i < heading.length; i++) {
                    var th = document.createElement("TH");
                    if (i == 2)
                        th.width = '40%';
                    else
                        th.width = '20%';
                    th.appendChild(document.createTextNode(heading[i]));
                    tr.appendChild(th);
                };

                for (var i = 0; i < structures.length; i++) {
                    var tr = document.createElement("TR");

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("titleString")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("userString")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("descriptionString")));
                    tr.appendChild(tdOne);

                    var tdFour = document.createElement("TD");

                    var button =document.createElement("INPUT");
                    button.type = "button";
                    button.className = "btn btn-lg btn-primary";
                    button.value = "Edit";
                    button.name = i;
                    button.style.marginRight = "10px";
                    button.onclick = (function() {
                        var count = i;

                        return function(e) {

                            var titleString = structures[count].get("titleString");
                            var descriptionString = structures[count].get("descriptionString");

                            BootstrapDialog.show({
                                  title: 'Edit Group',
                                  message: function(dialogItself) {
                                    var $form = $('<form></form>');
                                    var $title = $('<input type="text" style="width:80%;" maxlength="40">');
                                    $title.val(titleString);
                                    dialogItself.setData('title', $title);
                                    $form.append('Group Title  ').append($title);
                                    var $message = $('<textarea maxlength="400" rows="4" style="overflow-y: scroll; resize: none; width:100%;"></textarea>');
                                    $message.val(descriptionString);
                                    dialogItself.setData('message', $message);
                                    $form.append('<br><br>Group Description<br><br>').append($message);
                                    return $form;
                                  },// <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: false, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  buttons: [{
                                       label: 'Cancel',
                                        action: function (dialogItself) {
                                            dialogItself.close();
                                        } 
                                    }, {
                                        label: 'Save',
                                        cssClass: 'btn-primary',
                                        action: function (dialogItself) {
                                            var title = dialogItself.getData('title').val();
                                            var message = dialogItself.getData('message').val();

                                            $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

                                            structures[count].set("titleString", title);
                                            structures[count].set("descriptionString", message);
                                            structures[count].save(null, {
                                                success: function(object) {
                                                    dialogItself.close();
                                                    $("#spinnerDiv").html("");
                                                    var alertString = "Group successfully updated.";
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
                                        }
                                    }]
                              });

                        };
                    })();
                    tdFour.appendChild(button);

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

function backFunction() {
    BootstrapDialog.show({
          title: 'Developer Access',
          message: function(dialogItself) {
            var $form = $('<form></form>');
            var $password = $('<input type="password" style="width:100%;">');
            $form.append('Developer Password<br><br>').append($password);
            dialogItself.setData('password', $password);
            return $form;
          },// <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: false, // <-- Default value is false
          draggable: true, // <-- Default value is false
          buttons: [{
                label: 'Cancel',
                action: function (dialogItself) {
                    dialogItself.close();
                } 
            }, {
                label: 'Enter',
                cssClass: 'btn-primary',
                action: function (dialogItself) {

                    var password = dialogItself.getData('password').val();

                    var query = new Parse.Query("SpecialKeyStructure");
                    query.equalTo("key", "appActive");
                    query.first({
                      success: function(object) {
                        if (object.get("password") === password) {
                            $("#spinnerDiv").html("");
                            dialogItself.close();
                            localStorage.setItem("bypass", 1);
                            location.reload();
                        } else {
                            $("#spinnerDiv").html("");
                            dialogItself.close();
                        };
                      },
                      error: function(error) {
                        alert(error.code + " - " + error.message);
                        dialogItself.close();
                      }
                    });
                }
            }]
      });
}

function startFunction() {
    $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
    if (Parse.User.current()) {
        var query = new Parse.Query("SpecialKeyStructure");
        query.equalTo("key", "appActive");
        query.first({
          success: function(object) {
            if (object.get("value") === "0" && localStorage.getItem("bypass") != 1) {
                if (Parse.User.current().get("userType") === "Developer") {
                    $('.main-container').html($("#appInactive").html() + $("#pureDev").html());
                } else {
                    $('.main-container').html($("#appInactive").html());
                };
                $("#messageLabel").html("MESSAGE - " + object.get("message"));
                $("#spinnerDiv").html("");
            } else {
                $('.main-container').html($("#main-login").html());
                $("#spinnerDiv").html("");
                homeFunction();
                $("#spinnerDiv").html("");
            };
          },
          error: function(error) {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "Error occurred."
            });
          }
        });
    } else {
        window.location.replace("./login");
    }; 
}

function homeFunction() {
    localStorage.setItem("bypass", 0);
    if (Parse.User.current()) {
        if (Parse.User.current().get("userType") === "Administration" || Parse.User.current().get("userType") === "Developer") {
          if (Parse.User.current().get("userType") === "Administration") {
            $('.main-container').html($("#admin").html());
          } else {
            $('.main-container').html($("#dev").html());
          };
          $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
          var query = new Parse.Query("UserRegisterStructure");
          query.count({
            success: function(count) {
              if (count == 1) {
                $("#newButton").html("User Management (" + count + ")");
                $("#newButton").css('background-color', 'red');
                $("#newButton").css('border-color', 'red');
              } else if (count > 1) {
                $("#newButton").html("User Management (" + count + ")");
                $("#newButton").css('background-color', 'red');
                $("#newButton").css('border-color', 'red');
              };
              $("#spinnerDiv").html("");
            },
            error: function(error) {
              if (error.code != 100) {
                alert(error.code + " - " + error.message);
              };
              $("#spinnerDiv").html("");
            }
          });
          var queryTwo = new Parse.Query("ErrorStructure");
          queryTwo.count({
            success: function(count) {
              if (count == 1) {
                $("#errorButton").html("Error Management (" + count + ")");
                $("#errorButton").css('background-color', 'red');
                $("#errorButton").css('border-color', 'red');
              } else if (count > 1) {
                $("#errorButton").html("Error Management (" + count + ")");
                $("#errorButton").css('background-color', 'red');
                $("#errorButton").css('border-color', 'red');
              };
              $("#spinnerDiv").html("");
            },
            error: function(error) {
              if (error.code != 100) {
                alert(error.code + " - " + error.message);
              };
              $("#spinnerDiv").html("");
            }
          });
          var queryThree = new Parse.Query("NewsArticleStructure");
          queryThree.equalTo("isApproved", 0);
          queryThree.count({
            success: function(count) {
              if (count == 1) {
                $("#newsApproveButton").html("News Management (" + count + ")");
                $("#newsApproveButton").css('background-color', 'red');
                $("#newsApproveButton").css('border-color', 'red');
              } else if (count > 1) {
                $("#newsApproveButton").html("News Management (" + count + ")");
                $("#newsApproveButton").css('background-color', 'red');
                $("#newsApproveButton").css('border-color', 'red');
              };
              $("#spinnerDiv").html("");
            },
            error: function(error) {
              if (error.code != 100) {
                alert(error.code + " - " + error.message);
              };
              $("#spinnerDiv").html("");
            }
          });
          var queryFour = new Parse.Query("EventStructure");
          queryFour.equalTo("isApproved", 0);
          queryFour.count({
            success: function(count) {
              if (count == 1) {
                $("#eventApproveButton").html("Event Management (" + count + ")");
                $("#eventApproveButton").css('background-color', 'red');
                $("#eventApproveButton").css('border-color', 'red');
              } else if (count > 1) {
                $("#eventApproveButton").html("Event Management (" + count + ")");
                $("#eventApproveButton").css('background-color', 'red');
                $("#eventApproveButton").css('border-color', 'red');
              };
              $("#spinnerDiv").html("");
            },
            error: function(error) {
              if (error.code != 100) {
                alert(error.code + " - " + error.message);
              };
              $("#spinnerDiv").html("");
            }
          });
          var queryFive = new Parse.Query("CommunityServiceStructure");
          queryFive.equalTo("isApproved", 0);
          queryFive.count({
            success: function(count) {
              if (count > 0) {
                $("#commButton").html("Community Management (" + count + ")");
                $("#commButton").css('background-color', 'red');
                $("#commButton").css('border-color', 'red');
              };
              $("#spinnerDiv").html("");
            },
            error: function(error) {
              if (error.code != 100) {
                alert(error.code + " - " + error.message);
              };
              $("#spinnerDiv").html("");
            }
          });
        } else if (Parse.User.current().get("userType") === "Faculty") {
          $('.main-container').html($("#faculty").html());
        } else if (Parse.User.current().get("userType") === "Student") {
          $('.main-container').html($("#student").html());
        } else if (Parse.User.current().get("userType") === "Lunch Manager") {
          $('.main-container').html($("#lunch").html());
        };
        $('#welcomeLabel').html("Welcome, " + Parse.User.current().get("firstName") + "!");
        $('#nameLabel').html("Logged in as " + Parse.User.current().get("firstName") + " " + Parse.User.current().get("lastName") + " - " + Parse.User.current().get("userType"));
        var query = new Parse.Query("SpecialKeyStructure");
        query.equalTo("key", "appMessage");
        query.first({
          success: function(object) {
            if (object.get("value") != "None.") {
                var alertString = object.get("value");
                  if (alertString && alertString.length > 0) {
                    $("#messageDiv").html('<div class="alert alert-danger fade in"><strong>MESSAGE - '+alertString+'</strong></div>');
                  };
            };
          },
          error: function(error) {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                title: "Error",
                message: "Error occurred."
            });
          }
        });
      } else {
        window.location.replace("./login");
      };
}

function changeFunction() {
    var selected = $("select[name='modeSelect'] option:selected").index();
    if (selected == 0) {
      BootstrapDialog.show({
          title: 'Deactivate Application',
          message: function(dialogItself) {
            var $form = $('<form></form>');
            var $password = $('<input type="password" style="width:100%;">');
            $form.append('Application Password<br><br>').append($password);
            var $message = $('<textarea maxlength="200" rows="3" style="overflow-y: scroll; resize: none; width:100%;"></textarea>');
            dialogItself.setData('message', $message);
            dialogItself.setData('password', $password);
            $form.append('<br><br>Deactivation Message/Reason<br><br>').append($message);
            return $form;
          },// <-- Default value is BootstrapDialog.TYPE_PRIMARY
          closable: false, // <-- Default value is false
          draggable: true, // <-- Default value is false
          buttons: [{
                label: 'Cancel',
                action: function (dialogItself) {
                    dialogItself.close();
                } 
            }, {
                label: 'Deactivate',
                cssClass: 'btn-primary',
                action: function (dialogItself) {

                    BootstrapDialog.confirm({
                        title: 'Confirmation',
                        message: 'Are you sure you want to deactivate the application? This will go into effect immediately and disable both the iOS and web clients.',
                        type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                        closable: true, // <-- Default value is false
                        draggable: true, // <-- Default value is false
                        btnCancelLabel: 'No', // <-- Default value is 'Cancel',
                        btnOKLabel: 'Yes', // <-- Default value is 'OK',
                        btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
                        callback: function(result) {
                            // result will be true if button was click, while it will be false if users close the dialog directly.
                            if(result) {

                                var password = dialogItself.getData('password').val();
                                var message = dialogItself.getData('message').val();

                                if (message.length == 0) {
                                    BootstrapDialog.show({
                                            type: BootstrapDialog.TYPE_DEFAULT,
                                            title: "Error",
                                            message: "You must enter a valid deactivation message for users."
                                        });
                                } else {
                                    var query = new Parse.Query("SpecialKeyStructure");
                                query.equalTo("key", "appActive");
                                query.first({
                                  success: function(object) {
                                        if (object.get("password") === password) {
                                            object.set("value", selected.toString());
                                            object.set("message", message);
                                            object.save(null, {
                                              success: function() {
                                                $("#modeLabel").html(arrayList[selected]);
                                                $("#spinnerDiv").html("");
                                                dialogItself.close();
                                              },
                                              error: function(error) {
                                                alert(error.code + " - " + error.message);
                                                dialogItself.close();
                                              }
                                            });
                                        } else {
                                            BootstrapDialog.show({
                                                type: BootstrapDialog.TYPE_DEFAULT,
                                                title: "Error",
                                                message: "Invalid password."
                                            });
                                            $("#spinnerDiv").html("");
                                            dialogItself.close();
                                        };
                                      },
                                      error: function(error) {
                                        alert(error.code + " - " + error.message);
                                        dialogItself.close();
                                      }
                                    });
                                };
                            };
                        }
                    });
                }
            }]
      });
    } else {
        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');
        var query = new Parse.Query("SpecialKeyStructure");
        query.equalTo("key", "appActive");
        query.first({
          success: function(object) {
            object.set("value", selected.toString());
            object.save(null, {
              success: function() {
                $("#modeLabel").html(arrayList[selected]);
                $("#spinnerDiv").html("");
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
    }
}

function loadScholarshipTable() {
    return function() {

        $('#scholAlertDiv').css("display", "block");

        var alertString = localStorage.getItem("scholAlertString");
        if (alertString && alertString.length > 0) {
            localStorage.setItem("scholAlertString", "");
            $('#scholAlertDiv').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">Close</a><strong>'+alertString+'</strong></div>');
            $('#scholAlertDiv').delay(5000).fadeOut(500);
        };

        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

        var query = new Parse.Query("ScholarshipStructure");
        query.ascending("dueDate");
        var structures = new Array();
        query.find({
            success: function(structures) {

                $("#titleLabel").html("Currently Active Scholarships (" + structures.length+")");

                var tableDiv = document.getElementById("scholarships");
                var table = document.createElement("TABLE");
                var tableBody = document.createElement("TBODY");

                table.appendChild(tableBody);
                table.className = "table table-striped";
                table.id = "scholTable";

                var heading = new Array();
                heading[0] = "Due Date";
                heading[1] = "Title";
                heading[2] = "Creator";
                heading[3] = "Content";
                heading[4] = "Action";

                //TABLE COLUMNS

                var tr = document.createElement("TR");
                tableBody.appendChild(tr);

                $("#scholarships").html("");

                for (var i = 0; i < heading.length; i++) {
                    var th = document.createElement("TH");
                    th.width = '19%';
                    th.appendChild(document.createTextNode(heading[i]));
                    tr.appendChild(th);
                };

                for (var i = 0; i < structures.length; i++) {
                    var tr = document.createElement("TR");

                    var tdTwo = document.createElement("TD");
                    var date = structures[i].get("dueDate");
                    string = date.toString('dddd, MMMM d, yyyy');
                    tdTwo.appendChild(document.createTextNode(string));
                    tr.appendChild(tdTwo);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("titleString")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("userString")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    var contentButton =document.createElement("INPUT");
                    contentButton.type = "button";
                    contentButton.className = "btn btn-lg btn-primary";
                    contentButton.value = "View Content";
                    contentButton.name = i;
                    contentButton.style.marginRight = "10px";
                    contentButton.onclick = (function() {
                        var count = i;

                        return function(e) {

                            var titleString = structures[count].get("titleString");
                            var date = structures[count].get("dueDate");
                            string = "DUE - " + date.toString('dddd, MMMM d, yyyy');
                            var content = structures[count].get("messageString");

                            content = linkifyStr(content);

                            content = content.replace(/\r?\n/g, '<br />');

                            BootstrapDialog.show({
                                  title: 'Scholarship Preview',
                                  size: BootstrapDialog.SIZE_WIDE,
                                  message: function(dialogItself) {
                                    var $form = $('<form></form>');
                                    $form.append('<h1 style="margin-top:0;">'+titleString+'</h1><h5>'+string+'</h5>');
                                    $form.append('<hr style="border-color:#561838">' + content);
                                    return $form;
                                  },// <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: true, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  buttons: [{
                                       label: 'OK',
                                        action: function (dialogItself) {
                                            dialogItself.close();
                                        } 
                                    }]
                              });

                        };
                    })();
                    tdOne.appendChild(contentButton);
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
                                  message: 'Are you sure you want to delete this scholarship?',
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
                                                var alertString = "Scholarship successfully deleted.";
                                                localStorage.setItem("scholAlertString", alertString);
                                                $(document).ready(loadScholarshipTable());
                                              },
                                              error: function(error) {
                                               errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 4213");
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

function loadAlertTable() {
    return function() {

        $('#theAlertDiv').css("display", "block");

        var alertString = localStorage.getItem("theAlertString");
        if (alertString && alertString.length > 0) {
            localStorage.setItem("theAlertString", "");
            $('#theAlertDiv').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">Close</a><strong>'+alertString+'</strong></div>');
            $('#theAlertDiv').delay(5000).fadeOut(500);
        };

        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

        var query = new Parse.Query("AlertStructure");
        query.descending("createdAt");
        query.equalTo("isReady", 1);
        var structures = new Array();
        query.find({
            success: function(structures) {

                $("#titleLabel").html("Recently Posted Alerts (" + structures.length+")");

                var tableDiv = document.getElementById("alerts");
                var table = document.createElement("TABLE");
                var tableBody = document.createElement("TBODY");

                table.appendChild(tableBody);
                table.className = "table table-striped";
                table.id = "alertTable";

                var heading = new Array();
                heading[0] = "Date Posted";
                heading[1] = "Title";
                heading[2] = "Author";
                heading[3] = "Content";
                heading[4] = "Views";
                heading[5] = "Action";

                //TABLE COLUMNS

                var tr = document.createElement("TR");
                tableBody.appendChild(tr);

                $("#alerts").html("");

                for (var i = 0; i < heading.length; i++) {
                    var th = document.createElement("TH");
                    th.width = '19%';
                    th.appendChild(document.createTextNode(heading[i]));
                    tr.appendChild(th);
                };

                for (var i = 0; i < structures.length; i++) {
                    var tr = document.createElement("TR");

                    var tdTwo = document.createElement("TD");
                    var date = structures[i].createdAt;
                    string = date.toString('dddd, MMMM d, yyyy @ h:mm tt');
                    tdTwo.appendChild(document.createTextNode(string));
                    tr.appendChild(tdTwo);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("titleString")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("authorString")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    var contentButton =document.createElement("INPUT");
                    contentButton.type = "button";
                    contentButton.className = "btn btn-lg btn-primary";
                    contentButton.value = "View Content";
                    contentButton.name = i;
                    contentButton.style.marginRight = "10px";
                    contentButton.onclick = (function() {
                        var count = i;

                        return function(e) {

                            var titleString = structures[count].get("titleString");
                            var authorDate = structures[count].get("authorString") + " | " + structures[count].get("dateString");
                            var content = structures[count].get("contentString");
                            content = content.replace(/\r?\n/g, '<br />');

                            BootstrapDialog.show({
                                  title: 'Alert Preview',
                                  size: BootstrapDialog.SIZE_WIDE,
                                  message: function(dialogItself) {
                                    var $form = $('<form></form>');
                                    $form.append('<h1 style="margin-top:0;">'+titleString+'</h1><h5>'+authorDate+'</h5>');
                                    $form.append('<hr style="border-color:#561838">' + content);
                                    return $form;
                                  },// <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: true, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  buttons: [{
                                       label: 'OK',
                                        action: function (dialogItself) {
                                            dialogItself.close();
                                        } 
                                    }]
                              });

                        };
                    })();
                    tdOne.appendChild(contentButton);
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("views")));
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
                                  message: 'Are you sure you want to delete this alert?',
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
                                                var alertString = "Alert successfully deleted.";
                                                localStorage.setItem("theAlertString", alertString);
                                                $(document).ready(loadAlertTable());
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

function loadPollTable() {
    return function() {

        $('#pollAlertDiv').css("display", "block");

        var alertString = localStorage.getItem("pollAlertString");
        if (alertString && alertString.length > 0) {
            localStorage.setItem("pollAlertString", "");
            $('#pollAlertDiv').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">Close</a><strong>'+alertString+'</strong></div>');
            $('#pollAlertDiv').delay(5000).fadeOut(500);
        };

        $("#spinnerDiv").html('<a><img src="./../spinner.gif" alt="Logo" width="40" style="vertical-align: middle; padding-top:12px; padding-left:10px;"/></a>');

        var query = new Parse.Query("PollStructure");
        query.descending("createdAt");
        var structures = new Array();
        query.find({
            success: function(structures) {

                $("#titleLabel").html("Recently Posted Polls (" + structures.length+")");

                var tableDiv = document.getElementById("polls");
                var table = document.createElement("TABLE");
                var tableBody = document.createElement("TBODY");

                table.appendChild(tableBody);
                table.className = "table table-striped";
                table.id = "pollTable";

                var heading = new Array();
                heading[0] = "Date Posted";
                heading[1] = "Title";
                heading[2] = "Question";
                heading[3] = "Total Votes";
                heading[4] = "View Content";
                heading[5] = "Action";

                //TABLE COLUMNS

                var tr = document.createElement("TR");
                tableBody.appendChild(tr);

                $("#polls").html("");

                for (var i = 0; i < heading.length; i++) {
                    var th = document.createElement("TH");
                    th.width = '19%';
                    th.appendChild(document.createTextNode(heading[i]));
                    tr.appendChild(th);
                };

                for (var i = 0; i < structures.length; i++) {
                    var tr = document.createElement("TR");

                    var tdTwo = document.createElement("TD");
                    var date = structures[i].createdAt;
                    string = date.toString('dddd, MMMM d, yyyy @ h:mm tt');
                    tdTwo.appendChild(document.createTextNode(string));
                    tr.appendChild(tdTwo);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("pollTitle")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("pollQuestion")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    tdOne.appendChild(document.createTextNode(structures[i].get("totalResponses")));
                    tr.appendChild(tdOne);

                    var tdOne = document.createElement("TD");
                    var contentButton =document.createElement("INPUT");
                    contentButton.type = "button";
                    contentButton.className = "btn btn-lg btn-primary";
                    contentButton.value = "View Responses";
                    contentButton.name = i;
                    contentButton.style.marginRight = "10px";
                    contentButton.onclick = (function() {
                        var count = i;

                        return function(e) {

                            var titleString = structures[count].get("pollTitle");
                            var question = structures[count].get("pollQuestion");
                            var finalString = "";

                            var total = structures[count].get("totalResponses");

                            var choices = structures[count].get("pollMultipleChoices");

                            for (var key in choices) {
                                var percent = Math.round((parseInt(choices[key]) / total * 100 * 10)) / 10;
                                finalString = finalString + key + " - " + percent.toString() + "%" + "\n";
                            };

                            finalString = finalString.replace(/\n/g, '<br />');

                            BootstrapDialog.show({
                                  title: 'Poll Preview',
                                  size: BootstrapDialog.SIZE_WIDE,
                                  message: function(dialogItself) {
                                    var $form = $('<form></form>');
                                    $form.append('<h1 style="margin-top:0;">'+titleString+'</h1><h3><i>'+question+'</i></h3>');
                                    $form.append('<hr style="border-color:#561838">' + finalString);
                                    return $form;
                                  },// <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                  closable: true, // <-- Default value is false
                                  draggable: true, // <-- Default value is false
                                  buttons: [{
                                       label: 'OK',
                                        action: function (dialogItself) {
                                            dialogItself.close();
                                        } 
                                    }]
                              });

                        };
                    })();
                    tdOne.appendChild(contentButton);
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
                                  message: 'Are you sure you want to delete this poll?',
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
                                                var alertString = "Poll successfully deleted.";
                                                localStorage.setItem("pollAlertString", alertString);
                                                $(document).ready(loadPollTable());
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

                                    if (structures[i].get("isSnow") == 1) {
                                        var tdOne = document.createElement("TD");
                                        tdOne.appendChild(document.createTextNode("SNOW DAY"));
                                        tdOne.style.fontWeight = 'bold';
                                        tr.appendChild(tdOne);
                                    } else {
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

                                    if (i < 3 && structures[i].get("isSnow") == 0) {
                                        var button = document.createElement("INPUT");
                                        button.type = "button";
                                        button.className = "btn btn-lg btn-primary";
                                        button.value = "Snow Day";
                                        button.name = i;
                                        button.style.backgroundColor = "red";
                                        button.style.borderColor = "red";
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

                                                var parts = structures[count].get("schoolDate").split('-');
                                                var date = new Date(parts[2], parts[0]-1,parts[1]);
                                                var string = date.toString('dddd, MMMM d, yyyy');
                                                var ID = structures[count].get("schoolDayID");

                                                BootstrapDialog.show({
                                                  title: 'Edit Custom Schedule',
                                                  message: function(dialogItself) {
                                                    var $form = $('<form></form>');
                                                    var $title = $('<input type="text" style="width:100%;">');
                                                    $form.append(string+'<br><br>Schedule Name (i.e. "Day D, Wildcat Way Period")').append($title);
                                                    var $schedule = $('<textarea rows="14" style="overflow-y: scroll; resize: none; width:100%;"></textarea>');
                                                    if (structures[count].get("scheduleType") === "*") {
                                                        $title.val(structures[count].get("customString"));
                                                        $schedule.val(structures[count].get("customSchedule"));
                                                    } else {
                                                        $schedule.val("Period 1: \nPeriod 2: \nPeriod 3: \nPeriod 4: \n1st: \n2nd: \n3rd: \nPeriod 6: \nPeriod 7: ");
                                                    };
                                                    dialogItself.setData('schedule', $schedule);
                                                    dialogItself.setData('title', $title);
                                                    $form.append('<br><br>Schedule<br><br>').append($schedule);
                                                    return $form;
                                                  },// <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                                  closable: false, // <-- Default value is false
                                                  draggable: true, // <-- Default value is false
                                                  buttons: [{
                                                        label: 'Cancel',
                                                        action: function (dialogItself) {
                                                            dialogItself.close();
                                                        } 
                                                    }, {
                                                        label: 'Save',
                                                        cssClass: 'btn-primary',
                                                        action: function (dialogItself) {

                                                            var title = dialogItself.getData('title').val();
                                                            var schedule = dialogItself.getData('schedule').val();

                                                            if (! title || ! schedule) {
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
                                                                            query.equalTo("schoolDayID", ID);
                                                                            query.first({
                                                                                success: function(object) {
                                                                                    object.set("customString", title);
                                                                                    object.set("customSchedule", schedule);
                                                                                    object.set("scheduleType", "*");
                                                                                    object.save(null, {
                                                                                        success: function() {
                                                                                            $("#spinnerDiv").html("");
                                                                                            localStorage.setItem("scheduleAlertString", "Schedule successfully updated.");
                                                                                            dialogItself.close();
                                                                                            $(document).ready(loadScheduleTable());
                                                                                        },
                                                                                        error: function(error) {
                                                                                            errorFunction(error.code.toString() + " - " + error.message.toString(), "ParseError", "Script 1002");
                                                                                            BootstrapDialog.show({
                                                                                                type: BootstrapDialog.TYPE_DEFAULT,
                                                                                                title: "Error",
                                                                                                message: "Error occurred. Please try again."
                                                                                            });
                                                                                            $("#spinnerDiv").html("");
                                                                                            dialogItself.close();
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
                                                                                    dialogItself.close();
                                                                                }
                                                                            });

                                                                        };
                                                                    }
                                                                });
                                                            };
                                                        }
                                                    }]
                                              });                       

                                            };
                                        })();
                                        tdFour.appendChild(buttonTwo);
                                    } else if (i < 2 && structures[i].get("isSnow") === 1) {
                                        tdFour.appendChild(document.createTextNode("No actions available."));
                                    }

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