<!DOCTYPE html><html lang="en"><head> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags --> <meta name="description" content=""> <meta name="author" content=""> <link rel="apple-touch-icon" sizes="57x57" href="./../favicon/apple-touch-icon-57x57.png"> <link rel="apple-touch-icon" sizes="60x60" href="./../favicon/apple-touch-icon-60x60.png"> <link rel="apple-touch-icon" sizes="72x72" href="./../favicon/apple-touch-icon-72x72.png"> <link rel="apple-touch-icon" sizes="76x76" href="./../favicon/apple-touch-icon-76x76.png"> <link rel="apple-touch-icon" sizes="114x114" href="./../favicon/apple-touch-icon-114x114.png"> <link rel="apple-touch-icon" sizes="120x120" href="./..//favicon/apple-touch-icon-120x120.png"> <link rel="apple-touch-icon" sizes="144x144" href="./../favicon/apple-touch-icon-144x144.png"> <link rel="apple-touch-icon" sizes="152x152" href="./../favicon/apple-touch-icon-152x152.png"> <link rel="apple-touch-icon" sizes="180x180" href="./../favicon/apple-touch-icon-180x180.png"> <link rel="icon" type="image/png" href="./../favicon/favicon-32x32.png" sizes="32x32"> <link rel="icon" type="image/png" href="./../favicon/android-chrome-192x192.png" sizes="192x192"> <link rel="icon" type="image/png" href="./../favicon/favicon-96x96.png" sizes="96x96"> <link rel="icon" type="image/png" href="./../favicon/favicon-16x16.png" sizes="16x16"> <link rel="manifest" href="./../favicon/manifest.json"> <link rel="mask-icon" href="./../favicon/safari-pinned-tab.svg" color="#5bbad5"> <meta name="msapplication-TileColor" content="#da532c"> <meta name="msapplication-TileImage" content="/mstile-144x144.png"> <meta name="theme-color" content="#ffffff"> <title>WildcatConnect News</title> <!-- Bootstrap core CSS --> <link href="./../css/bootstrap.min.css" rel="stylesheet"> <link href="./../css/signin.css" rel="stylesheet"> <link href="./../css/sticky-footer-navbar.css" rel="stylesheet"> <!-- IE10 viewport hack for Surface/desktop Windows 8 bug --> <!--link href="./css/ie10-viewport-bug-workaround.css" rel="stylesheet"> <!-- Custom styles for this template --> <!--link href="navbar-static-top.css" rel="stylesheet"> <!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]--> <!--script src="../../assets/js/ie-emulation-modes-warning.js"></script> <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries --> <!--[if lt IE 9]> <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script> <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script> <![endif]--> </head> <body> <!-- Static navbar --> <nav class="navbar navbar-default navbar-static-top"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a><img src="./../logoTransparent.gif" alt="Logo" width="54" style="display: inline-block; vertical-align: middle;"/></a> <a class="navbar-brand">WildcatConnect</a> </div> <div id="navbar" class="navbar-collapse collapse"> <ul id="spinnerDiv" class="nav navbar-nav"> <!--li><a href="#about">About</a></li> <li><a href="#contact">Contact</a></li--> </ul> <!--ul class="nav navbar-nav navbar-right"> <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Account<span class="caret"></span></a> <ul class="dropdown-menu"> <li><a href="#">Change Password</a></li> <li><a href="#">Report an issue</a></li> <li role="separator" class="divider"></li> <li><a href="#">Log Out</a></li> </ul> </li> </ul--> </div--><!--/.nav-collapse --> </div> </nav>


<div class="main-container" style="padding-left:20px; padding-right:20px;">

	<?php

	//get a variable in URL

	$ID = $_GET["ID"];

	require 'vendor/autoload.php';
 
	use Parse\ParseClient;
 
	ParseClient::initialize('cLBOvwh6ZTQYex37DSwxL1Cvg34MMiRWYAB4vqs0', 'L64VH4MuWvrmawcx70vmsQAbmtWuVmxDuhvce1TW', 'iV7yfmTMWIfiMbzBWjNPlX0IWEyyMMNunzy89iSM');

	use Parse\ParseObject;
 
	//$testObject = ParseObject::create("TestObject");
	//$testObject->set("foo", "bar");
	//$testObject->save();

	use Parse\ParseQuery;
	use Parse\ParseACL;
	use Parse\ParsePush;
	use Parse\ParseUser;
	use Parse\ParseInstallation;
	use Parse\ParseException;
	use Parse\ParseAnalytics;
	use Parse\ParseFile;
	use Parse\ParseCloud;

	$query = new ParseQuery("NewsArchiveStructure");
	try {
		$article = $query->get($ID);
		echo "<h1>" . $article->get('titleString') . "</h1>";
		echo "<h4><i>" . $article->get('summaryString') . "</i></h4>";
		echo "<h5>" . $article->get('authorString') . " | " . $article->get('dateString') . "</h5>";
		if ($article->get('hasImage') == 1) {
			echo "<img src='" . $article->get('imageFile')->getURL() . "' style='width:50%;display:block;margin: 0 auto;'/>";
		}
		echo "<hr style='border-color:#561838'>";
		$content = str_replace(array("\n"), "<br>", $article->get('contentString'));
		$content = autolink($content);
		echo $content;
	} catch (ParseException $error) {
		echo "<h1 style='text-align:center;'>Whoops! We could not find this news article in our archives. :(</h1>";
	}

	function  autolink($message) { 
	    //Convert all urls to links
	    $message = preg_replace('#([\s|^])(www)#i', '$1http://$2', $message);
	    $pattern = '#((http|https|ftp|telnet|news|gopher|file|wais):\/\/[^\s]+)#i';
	    $replacement = '<a href="$1" target="_blank">$1</a>';
	    $message = preg_replace($pattern, $replacement, $message);

	    /* Convert all E-mail matches to appropriate HTML links */
	    $pattern = '#([0-9a-z]([-_.]?[0-9a-z])*@[0-9a-z]([-.]?[0-9a-z])*\\.';
	    $pattern .= '[a-wyz][a-z](fo|g|l|m|mes|o|op|pa|ro|seum|t|u|v|z)?)#i';
	    $replacement = '<a href="mailto:\\1">\\1</a>';
	    $message = preg_replace($pattern, $replacement, $message);
	    return $message;
	}

	?>

</div> <!-- /container --> <!-- Bootstrap core JavaScript ================================================== --> <!-- Placed at the end of the document so the pages load faster -->

<script src="./../js/jquery.min.js"></script>
<script src="./../js/parse-1.2.19.min.js">
</script> <script src="./../js/bootstrap.min.js">
</script> <script src="./../js/uglyScript.js"></script>
<script src="./../js/date.js"></script> <script src="./../js/dialog.js"></script>
</body>
</html>