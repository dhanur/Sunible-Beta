/*
	app init scrits
*/

$(document).ready(function() {
	// Custom selects
	transformToCustomSelect($('select'), true);
	autoHideCustomSelects();

	// Init tooltips
	initTooltips($("[data-toggle=tooltip]"));

	// JS input/textarea placeholder
	initPlaceholders($("input, textarea"));

	// phone fields autoformat
	phoneNumberAutoFormat($('input.phone_number'));

	// Disable link click not scroll top
	$("a[href='#']").click(function() {
		return false
	});

	bindContactUsPage( $('.open.contact_us.launcher') );
	bindTermsPopup( $('.open.terms_of_service.launcher') );
	bindPrivacyPolicyPopup($('.open.privacy_policy.launcher') );
	bindFaqsPopup( $('.open.faqs.launcher') );
	bindAboutUsPopup($('.open.about_us.launcher') );
	bindJobsPopup( $('.open.jobs.launcher') );
	
	initHomePage();

	if (isIe10())
	{
		targetIe10();
	}

	if (isSafari())
	{
		targetSafari();
	}

	// git test 2
	//addNiceScroll($('.nano'));

	window.onbeforeunload = function() {
		return "Your progress will not be saved.";
	};

	if (ie == 8)
	{
		ie8FixFooter();
	}
});