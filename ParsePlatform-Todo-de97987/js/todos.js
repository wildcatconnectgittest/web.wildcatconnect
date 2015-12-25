// An example Parse.js Backbone application based on the todo app by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses Parse to persist
// the todo items and provide user authentication and sessions.

$(function() {

  Parse.$ = jQuery;

  // Initialize Parse with your Parse application javascript keys
  Parse.initialize("cLBOvwh6ZTQYex37DSwxL1Cvg34MMiRWYAB4vqs0",
                   "tTcV5Ns1GFdDda44FCcG5XHBDMbLA1sxRUzSnDgW");
});