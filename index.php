<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8"/>
		<title>Sunible</title>
		<link rel="shortcut icon" href="favicon.ico"/>
		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="css/bootstrap.css"/>
		<link rel="stylesheet" type="text/css" href="css/bootstrap-modal.css"/>
		<link rel="stylesheet" type="text/css" href="css/flat-ui.css"/>
		<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.5/leaflet.css" />
		<!--[if lte IE 8]>
			<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.5/leaflet.ie.css" />
		<![endif]-->
		<link rel="stylesheet" type="text/css" href="css/nanoscroller.css"/>
		<link rel="stylesheet" type="text/css" href="css/general.css"/>
		<link rel="stylesheet" type="text/css" href="css/fonts.css"/>
		<link rel="stylesheet" type="text/css" href="css/forms.css"/>
		<link rel="stylesheet" type="text/css" href="css/layout.css"/>
		<link rel="stylesheet" type="text/css" href="css/pages.css"/>
		<!-- IE code -->
		<script type="text/javascript">var ie;</script>
		<!-- HTML5 shim, for IE6-8 support of HTML5 elements.  All other JS at the end of file.  -->
		<!--[if IE 8]>
			<link rel="stylesheet" type="text/css" href="css/ie8.css"/>
			<script type="text/javascript">ie = 8;</script>
		<![endif]-->
		<!--[if IE 9]>
			<link rel="stylesheet" type="text/css" href="css/ie9.css"/>
			<script type="text/javascript">ie = 9;</script>
		<![endif]-->
		<!--[if lt IE 9]>
			<script type="text/javascript" src="js/html5shiv.js"></script>
		<![endif]-->
	
		<!--GOOGLE ANALYTICS TRACKING SCRIPT-->
		<script type="text/javascript">
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-38493701-1']);
			_gaq.push(['_setDomainName', 'sunible.com']);
			_gaq.push(['_setAllowLinker', true]);
			_gaq.push(['_trackPageview', 'vpv/landing.html']);

			(function() {
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				// ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
				ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		</script>
	</head>
	<body>
		<div class="pages">
			<!-- HEADER -->
			<header class="page_header homepage dashboard social_proof registration message thank_you thank_you_reg"> <!-- header has those classes to be toggled with those pages.  With that approach, no need to duplicate the header on each page we have it-->
				<div class="questions">
					<span class="question why_solar" data-toggle="tooltip" data-placement="bottom" onMouseover="_gaq.push(['_trackEvent', 'Tooltips', 'Mouseover', 'Why Solar', 1, false]);" title="A solar-powered home can lower your electricity bills from day one, which is why over 300,000 homeowners in the U.S. have gone solar! Also, the Sun is the cleanest, most abundant source of energy on earth.">Why solar?</span><span class="question why_sunible" onMouseover="_gaq.push(['_trackEvent', 'Tooltips', 'Mouseover', 'Why Sunible', 1, false]);" data-toggle="tooltip" data-placement="bottom" title="There are a lot of solar installers to choose from, but there is no easy way to find, compare and select the right one. We will help you from start to finish, and answer every question you have along the way (and yes, for free!)">Why Sunible?</span>
				</div>
				<a href="/" class="logo sunible" onMouseover="_gaq.push(['_trackEvent', 'Links', 'Mouseover', 'Landing Page Logo', 1, false]);" onClick="_gaq.push(['_trackEvent', 'Links', 'Click', 'Landing Page Logo', 1, false]);"><img src="images/logo_sunible.png"/></a>
			</header>
            
            
<!-- Our Phone Number -->
<div id="contactnumber">
<table width="250" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td><img border="0" src="images/phonenumber.png" alt="call us"/></td>
    <td width="30px">&nbsp;</td>
  </tr>
</table>
</div>
<!-- End Our Phone Number -->   

   
			<!-- PAGES -->
			<?php include ("templates/pages/home.php"); ?>
			<?php include ("templates/pages/social_proof.php"); ?>
			<?php include ("templates/pages/dashboard.php"); ?>
			<?php include ("templates/pages/registration.php"); ?>
			<?php include ("templates/pages/thank_you.php"); ?>
			<?php include ("templates/pages/registration_thank_you.php"); ?>
			<?php include ("templates/pages/sign_up.php"); ?>
			<?php include ("templates/pages/contact_us.php"); ?>
			<?php include ("templates/pages/faq.php"); ?>
			<?php include ("templates/pages/page_message.php"); ?>
			<?php include ("templates/pages/modal_message.php"); ?>
			<?php include ("templates/pages/tos.php"); ?>
			<?php include ("templates/pages/pp.php"); ?>
			<?php include ("templates/pages/about_us.php"); ?>
			<?php include ("templates/pages/jobs.php"); ?>
			<!-- FOOTER -->
			<div class="footer-margin"></div>
			<footer class="page_footer homepage social_proof dashboard registration message thank_you thank_you_reg"> <!-- footer has those classes to be toggled with those pages.  With that approach, no need to duplicate the footer on each page we have it-->
					<nav class="bottom navigation">
						<a href="#" onMouseover="_gaq.push(['_trackEvent', 'Links', 'Mouseover', 'Footer FAQ', 1, false]);" onClick="_gaq.push(['_trackEvent', 'Links', 'Click', 'Footer FAQ', 1, false]);" class="launcher open faqs">FAQs</a>
						<a href="http://blog.sunible.com" target="_blank" onMouseover="_gaq.push(['_trackEvent', 'Links', 'Mouseover', 'Footer Blog', 1, false]);" onClick="_gaq.push(['_trackPageview', 'vpv/blog.html']);">Blog</a>
						<a href="#" onMouseover="_gaq.push(['_trackEvent', 'Links', 'Mouseover', 'Footer Contact Form', 1, false]);" onClick="_gaq.push(['_trackEvent', 'Links', 'Click', 'Footer Contact Form', 1, false]);" class="launcher open contact_us">Contact</a>
						<a href="#" onMouseover="_gaq.push(['_trackEvent', 'Links', 'Mouseover', 'Footer About Us', 1, false]);" onClick="_gaq.push(['_trackEvent', 'Links', 'Click', 'Footer About Us', 1, false]);" class="launcher open about_us">About Us</a>
						<a href="#" onMouseover="_gaq.push(['_trackEvent', 'Links', 'Mouseover', 'Footer Terms of Service', 1, false]);" onClick="_gaq.push(['_trackEvent', 'Links', 'Click', 'Footer Terms of Service', 1, false]);" class="launcher open terms_of_service">Terms</a>
						<!--  <a href="#" class="launcher open jobs">Jobs</a> -->
					</nav>
					<span class="copyright">&copy; Sunible Inc.  2013</span>
			</footer>
		</div>
		<!-- JS -->
		<script type="text/javascript" src="js/jquery/jquery-1.9.1.min.js"></script>
		<script type="text/javascript" src="js/jquery/jquery.placeholder.js"></script>
		<script type="text/javascript" src="js/jquery/jquery.validate.min.js"></script>
		<script type="text/javascript" src="js/jquery/additional-methods.min.js"></script>
		<script type="text/javascript" src="js/jquery/jquery.dropkick-1.0.0.js"></script>
		<script type="text/javascript" src="js/jquery/jquery.dataTables.min.js"></script>
		<script type="text/javascript" src="js/jquery/jquery.nanoscroller.min.js"></script>
		<script type="text/javascript" src="js/jquery/jquery.json-2.4.min.js"></script>
		<script type="text/javascript" src="js/bootstrap/bootstrap-tooltip.js"></script>
		<script type="text/javascript" src="js/bootstrap/bootstrap-modalmanager.js"></script>
		<script type="text/javascript" src="js/bootstrap/bootstrap-modal.js"></script>
		<script type="text/javascript" src="js/leaflet.js"></script>
		<script type="text/javascript" src="js/custom_checkbox_and_radio.js"></script>
		<script type="text/javascript" src="js/global_methods.js"></script>
		<script type="text/javascript" src="js/server_calls.js"></script>
		<script type="text/javascript" src="js/validation.js"></script>
		<script type="text/javascript" src="js/pages.js"></script>
		<script type="text/javascript" src="js/dashboard.js"></script>
		<script type="text/javascript" src="js/application_init.js"></script>

		<!-- CLICKY TRACKING SCRIPT -->
		<script src="//static.getclicky.com/js" type="text/javascript"></script>
	</body>
</html>