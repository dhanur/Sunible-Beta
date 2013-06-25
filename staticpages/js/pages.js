/*
	pages scripts
*/

// STATIC PAGES POINTERS

var pages = {
	// here we store pages to descrease DOM searches. You can dynamically add/remove pages with JS.
	homePage: $('#page-homepage'),
	socialProof: $('#page-social_proof'),
	dashboard: $('#page-dashboard'),
	registration: $('#page-registration'),
	message: $('#page-message'),
	thankYou: $('#page-thank_you')
}

function changePage($currentPage, $nextPage)
{ // used to move between pages and show-hide page specific content
	// parameters:
	// - $currentPage : current page div. jQuery obj
	// * $nextPage : page div we switch to. jQuery obj

	if ($nextPage == undefined)
	{
		showMessage('changePage(): $nextPage is required parameter');
		return;
	}
	if ($nextPage.length == 0)
	{
		showMessage('changePage(): Page you specified as $nextPage does not exist');
		return;
	}

	var currentPageClass;
	if ($currentPage != undefined && $currentPage.length > 0)
	{
		currentPageClass = $currentPage.attr('data-page');
		$('.' + currentPageClass).hide();
		$currentPage.removeClass('is_shown');
	}

	var nextPageClass = $nextPage.attr('data-page');
	$('.' + nextPageClass).show();
	$nextPage.addClass('is_shown');
}

// DYNAMIC PAGES

function composeDynamicMessagePage(options)
{
	// options:
	// * pageHtml : html we insert. Could be plain text
	// - pageClass : class we add to message page
	// - buttonText : text for OK button
	// - okCallback : callback launched when we hit OK button

	if (options == undefined)
	{
		showMessage('composeDynamicPage(): options is required parameter.');
		return;		
	}

	if (options.pageHtml == undefined)
	{
		showMessage('composeDynamicPage(): options.pageHtml is required parameter.');
		return;		
	}

	var $page = $('#page-message');
	$page.attr('class', '');
	$page.addClass('page message');
	if (options.pageClass != undefined && options.pageClass != '')
	{
		$page.addClass(options.pageClass);
	}

	$page.html(options.pageHtml);

	if (options.okCallback != undefined && typeof options.okCallback == 'function')
	{
		if (options.buttonText == undefined || options.buttonText == '')
		{
			options.buttonText = "Ok";
		}
		var $okButton = $('' + 
			'<button type="button" class="btn page_message_ok">' + 
				options.buttonText + 
			'</button>');
		$page.append($okButton);
		$okButton.click(function(){
			options.okCallback();
		});
	}

	return $page;
}

function showDynamicMessagePage(pageSource)
{
	var $messagePage = composeDynamicMessagePage(pageSource);
	var $currentPage = $('.page.is_shown');
	changePage($currentPage, $messagePage);
}

function showThankYouPage()
{
	var pageHtml = '' +
		'<h1>Thank you for registering</h1>' +
		'<p>Your data was saved.</p>';
	var messagePageOptions = {
		pageHtml: pageHtml,
		pageClass: 'registration_complete', 
		buttonText: 'Return to homepage',
		okCallback : function(){
			var $currentPage = $('.page.is_shown');
			changePage($currentPage, pages.homePage);
		}
	};
	showDynamicMessagePage(messagePageOptions);
}

function showNoDataFoundPage()
{
	var pageHtml = '' +
		'<h1>Sorry, no data found</h1>' +
		'<p>There is no data found for your request.</p>';
	var messagePageOptions = {
		pageHtml: pageHtml,
		pageClass: 'no_data_found', 
		buttonText: 'Return to homepage',
		okCallback : function(){
			var $currentPage = $('.page.is_shown');
			changePage($currentPage, pages.homePage);
		}
	};
	showDynamicMessagePage(messagePageOptions);
}

// HOMEPAGE
function initHomePage()
{
	changePage(null, pages.homePage);
	var $betaTooltip = $('.page_header .overlay_beta .text');
	$betaTooltip.tooltip('show');

	setTimeout(function () {
			$betaTooltip.tooltip('hide');
	}, 5000);

	var $form = $('#homepage-search_providers_by_zip-container');
	bindZipCodeFieldFocusOnTeaserClick();
	bindGetInstallersByZipCodeForm($form);
}

function bindZipCodeFieldFocusOnTeaserClick()
{
	var $teaser = $('#homepage_teaser_heading');
	var $zipCodeField = $('#homepage-field-zip_code');
	$teaser.click(function(){
		$zipCodeField.focus();
	});
}

function bindGetInstallersByZipCodeForm($form)
{
	if ($form == undefined)
	{
		showMessage('bindGetInstallersByZipCode(): $form is required parameter.');
		return;
	}

	if ($form.length == 0)
	{
		showMessage('bindGetInstallersByZipCodeForm(): $form is not found.');
		return;
	}

	validation.init.form.getInstallersByZipCode($form);
	bindGetInstallersByZipCodeFormSubmit($form);
}

function bindGetInstallersByZipCodeFormSubmit($form)
{
	var $submit = $form.find('.search.providers.zip');
	$submit.click(function(){
		getInstallersByZipCodeFormSubmit($form);
	});
	var $zip = $form.find('input[type=text].zip');
	$zip.keypress(function (e) {
		if (e.which == 13)
		{
			e.preventDefault();
			getInstallersByZipCodeFormSubmit($form);
		}
	});
}

function getInstallersByZipCodeFormSubmit($form)
{
	if (!$form.valid()) return;
	var $currentPage = $form.closest('.page');
	var zipCode = $form.find('input[type="text"].zip').val();
	if (zipCode.charAt(0) == '9')
	{ // CALIFORNIA zip
		if (zipCode.charAt(1) == '3')
		{ // FRESNO zip
			// show social proof with view dashboard button
			getSocialProofDataByZipCode(zipCode, function(data){
				if (!data || !data[0])
				{
					showNoDataFoundPage();
				}
				else
				{
					changePage($currentPage, pages.socialProof);
					initSocialProof(data, 'fresno');
				}
			});
			// dashboard
			getInstallersByZipCode(zipCode, function(data){
				if (data != undefined && data.length > 0)
				{
					initDashboard(zipCode, data);
				}
			});
		}
		else
		{ // NON FRESNO, but California
			// show social proof with Sign Up button
			getSocialProofDataByZipCode(zipCode, function(data){
				if (!data || !data[0])
				{
					showNoDataFoundPage();
				}
				else
				{
					changePage($currentPage, pages.socialProof);
					initSocialProof(data, 'california');
				}
			});
		}
	}
	else
	{ // NON-CALIFORNIA zip
		// we show signup form
		initSignUpForm();
		showSignUpPopup();
	}
}

// SOCIAL PROOF
function initSocialProof(data, location)
{
	updateSocialCounters(data[0]);
	showSocialProofMap(data);
	var $button = pages.socialProof.find('.btn.next_action');
	var $areaName = pages.socialProof.find('.area_name');
	$areaName.text(data[0].county + ' County');
	switch(location){
		case 'fresno':
			$button.text('See Solar Providers!');
			bindButtonViewProviders($button);
			pages.socialProof.removeClass('california').addClass('fresno');
			break;
		case 'california':
			$button.text('Sign Me Up!');
			bindOpenSignUpPage($button);
			pages.socialProof.removeClass('fresno').addClass('california');
			break;
	};
}

function updateSocialCounters(data)
{
	var $totalInstallNumberCounter = $('.counter.total_install_number.by_zip');
	$totalInstallNumberCounter.text(data.total_install_number);
	var $totalLeaseCounter = $('.counter.total_lease.by_zip');
	$totalLeaseCounter.text(data.total_lease);
	var $totalInstallersCounter = $('.counter.total_installers.by_zip');
	$totalInstallersCounter.text(data.total_installers_county);
}

function showSocialProofMap(data)
{
	var markerSource = data[1].geodata;
	var zipGeo = [ data[0].latitude, data[0].longitude ];
	var $mapContainer = $('#page-social_proof-map');
	var mapInitialized = ($mapContainer.data('map') != undefined);
	var map;
	var layerMarkers;
	var layerPopups;
	var boundsCoordinates;
	if (mapInitialized)
	{
		map = $mapContainer.data('map');

		// markers
		//layerMarkers = $mapContainer.data('layerMarkers');
		//$mapContainer.data('layerMarkers', null); // clear marker layer data
		//layerMarkers.clearLayers();

		// popups
		layerPopups  = $mapContainer.data('layerPopups');
		$mapContainer.data('layerPopups', null); // clear popups layer data
		layerPopups.clearLayers();
	}
	else
	{
		map = L.map('page-social_proof-map', {
			center: zipGeo,
    	zoom: 12,
			closePopupOnClick: false
		});
		$mapContainer.data('map', map);

		L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
		}).addTo(map);
	}
	var bounds = composeMapBounds(markerSource);
	// adding markers to map
	//layerMarkers = L.layerGroup(bounds.markers);
	//layerMarkers.addTo(map);
	//$mapContainer.data('layerMarkers', layerMarkers);

	// adding popups to map
	layerPopups = L.layerGroup(bounds.popups);
	layerPopups.addTo(map);
	$mapContainer.data('layerPopups', layerPopups);

	// bounds coordinates
	//L.Bounds(bounds.coordinates);
	//map.fitBounds(bounds.coordinates);
}

function composeMapBounds(source)
{
	//var markers = [];
	var popups  = [];
	var coordinates  = [];
	if (source == undefined && map == undefined) return [];
	for (var i = 0; i < source.length; i++)
	{
		//markers.push(createLeafletMarker(source[i]));
		popups.push(createLeafletMarkerPopup(source[i]));
		coordinates.push( [source[i].latitude, source[i].longitude] );
	};
	return {
		//markers: markers,
		popups: popups,
		coordinates: coordinates
	};
}

function createLeafletMarker(source)
{
	var myIcon = L.icon({
		iconUrl: 'images/marker.png',
		iconRetinaUrl: 'images/marker@2x.png',
		iconSize: [3, 3],
		iconAnchor: [22, 22],
		popupAnchor: [-6, -23],
		className: 'sunible_marker'
	});
	return L.marker( [source.latitude, source.longitude], {icon: myIcon} );
}

function createLeafletMarkerPopup(source)
{
	var popup = new L.Popup({closeButton: false});
	popup.setLatLng([source.latitude, source.longitude]);
	popup.setContent(composeMarkerPopupHtml(source));
	return popup;
}

function composeMarkerPopupHtml(markerSource)
{
	// composed popup has only digit
	return '<div class="marker_popup">' + markerSource.total_install_number + '</div>';
}

function bindButtonViewProviders($button){
	var $currentPage = $button.closest('.page');
	$button.click(function(){
		changePage($currentPage, pages.dashboard);
		// re-init the nanoScroll 'cause page was inserted dynamically
		var $nanoScrollWrapper = $('.page.dashboard .dataTables_scrollBody.nano');
		addNiceScroll($nanoScrollWrapper);
	});
}

// DASHBOARD
function initDashboard(zipCode, data)
{
	if (zipCode == undefined) return;
	var $counter = $('#dashboard-block-number_of_providers_selected');
	resetDashboardCounter($counter)
	var $container = $('#page-dashboard .providers.container .table.container');
	var $tableWrapper = $container.find('#dashboard-grid-providers-list-' + zipCode + '_wrapper');
	if ($tableWrapper.length > 0)
	{ // in case table is already created we remove it. Data from server is newer than table shows
		$tableWrapper.remove();
	}

	(new Dashboard({ // @NOTE: this call returns created $table. So feel free for var $table = (new Dashboard({...}));
		container: $container,
		zip: zipCode,
		source: data,
		callback: function(){
			initRegistration(this.zip);
		}
	}));
}

// REGISTRATION
function initRegistration(zip)
{
	var $button = $('#dashboard-open_registration_page');
	var $currentPage = $button.closest('.page');
	$button.click(function(){
		var $dashboard = $currentPage.find('.providers.list.grid ');
		$dashboard.data('zip', zip);
		var dashboardProviders = collectDashboardProvidersData($dashboard);
		var formData = {
			providers: dashboardProviders,
			zip: zip
		};
		initRegistrationForm(formData);
		changePage($currentPage, pages.registration);
	});
}

function collectDashboardProvidersData($dashboard)
{
	var $provider;
	var providerData;
	var $providers = $dashboard.find('.provider');
	var selectedProvidersSource = [];
	var allProvidersSource = [];
	for (var i = 0; i < $providers.length; i++) {
		$provider = $($providers[i]);
		providerData = $provider.data();
		providerData.selected = $provider.hasClass('selected');
		allProvidersSource.push(providerData);
	};
	return allProvidersSource;
}

function initRegistrationForm(formData)
{
	var $form = $('#page-registration-form-register');
	$form.data(formData);
	var $button = $('#registration-submit_registration_info');
	bindButtonRegisterUser($button, $form);
	validation.init.form.registration($form);
}

function bindButtonRegisterUser($button, $form, providers)
{
	$button.click(function(){
		registerUser($form);
	});
}

function registerUser($form)
{
	if (!$form.valid()) return;

	var formData = getRegistrationFormData($form);
	var options = {
		isAsync: true,
		formData: formData
	};
	submitRegisterUserForm(options, function(){
		showThankYouPage();
	});
}

function getRegistrationFormData($form)
{
	var dataToSend = getFormFields($form);
	// zip
	dataToSend.zip = $form.data('zip');
	// providers selected
	var providers = $form.data('providers');
	var provider;
	var providerFieldName;
	var numberOfSelected = 0;
	for (i = 0; i < providers.length; i++)
	{
		if (providers[i].selected)
		{
			provider = providers[i];
			providerFieldName = 'Choice_' + (numberOfSelected+1) + '__c';
			dataToSend[providerFieldName] = provider.source.name;
			numberOfSelected++;
		}
	}
	// empty providers
	for (i = numberOfSelected; i < 30; i++)
	{
		// This part is driven by Salesforce restrictions.
		// We should send 20 providers no matter how much of them are selected by user
		// so we populate the selected providers and then add empty, so populated + empty = 20
		providerFieldName = 'Choice_' + (i+1) + '__c';
		dataToSend[providerFieldName] = '-';
	};

	return dataToSend;
}

// CONTACT US

function bindContactUsPage($launcher)
{
	$launcher.click(function(){
		openContactUsPage();
		initContactUsForm();
	});
}

function openContactUsPage()
{
	var $contactUsPopup = $('#modal-page-contact_us');
	$contactUsPopup.modal('show');
}

function initContactUsForm()
{
	var $form = $('#modal-page-contact_us-form');
	var $button = $('#modal-page-contact_us-form-send_message');
	bindButtonSendContactUsMessage($button, $form);
	validation.init.form.contact_us($form);
}

function bindButtonSendContactUsMessage($button, $form)
{
	$button.click(function(){
		sendContactUsMessage($form);
	});
}

function sendContactUsMessage($form)
{
	if (!$form.valid()) return;
	var $modal = $form.closest('.modal');
	var formData = getFormFields($form);
	var options = {
		isAsync: true,
		formData: formData
	};
	submitContactUsForm(options, function(data){
		console.log(data);
		$modal.modal('hide');
		showPopupWithDynamicText('<h1>Thanks</h1><p>Your feedback is sent!</p>');
	});
}

// SIGN UP FORM

function bindOpenSignUpPage($button)
{
	$button.click(function(){
		initSignUpForm();
		showSignUpPopup();
	});
}

function showSignUpPopup()
{
	var $popup = $('#modal-page-sign_up');
	$popup.modal();	
}

function initSignUpForm()
{
	var $form = $('#modal-page-sign_up-form');
	var $button = $form.find('.btn.sign_up');
	bindButtonSignUp($button);
	validation.init.form.signup($form);
}

function bindButtonSignUp($button)
{
	var $form = $('#modal-page-sign_up-form');
	$button.click(function(){
		signUpUser($form);
	});
}

function signUpUser($form)
{
	if (!$form.valid()) return;
	var $modal = $form.closest('.modal');
	var formData = getFormFields($form);
	var options = {
		isAsync: true,
		formData: formData
	};
	submitSignUpForm(options, function(){
		$modal.modal('hide');
		var $currentPage = $('.page.is_shown');
		changePage($currentPage, pages.thankYou);
		//showPopupWithDynamicText('<h1>Thank you for Sign Up.</h1><p>Your information is saved!</p>');
	});
}

// TERMS OF SERVICE

function bindTermsPopup($launcher)
{
	$launcher.click(function(){
		showTermsPopup();
	});
}

function showTermsPopup()
{
	var $termsPopup = $('#modal-terms_of_service');
	$termsPopup.modal();
	addNiceScroll($termsPopup.find('.nano'));
}

// PRIVACY POLICY

function bindPrivacyPolicyPopup($launcher)
{
	$launcher.click(function(){
		openPrivacyPolicyPopup();
	});	
}

function openPrivacyPolicyPopup()
{
	var $privacyPopup = $('#modal-privacy_policy');
	$privacyPopup.modal();
	addNiceScroll($privacyPopup.find('.nano'));
}

function showPopupWithDynamicText(html)
{
	$modal = $('#modal-message');
	$modal.find('.modal-body').html(html);
	$modal.modal('show');
}