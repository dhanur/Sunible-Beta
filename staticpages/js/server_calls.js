/*
this file contains API calls 
*/

function getInstallersByZipCode(zip, callback)
{
	if (zip == undefined)
	{
		showMessage('getInstallersByZipCode(): Zip is required parameter.');
		return;
	}
	var options = {
		requestUrl: '/getInstallersByZipCode.php?zip=' + zip,
		opDescription: 'getting providers list',
		isAsync: true,
		callback: callback
	};
	getJsonData(options);
}

function getSocialProofDataByZipCode(zip, callback)
{
	if (zip == undefined)
	{
		showMessage('getSocialProofDataByZipCode(): Zip is required parameter.');
		return;
	}
	var options = {
		requestUrl: '/getSocialProofDataByZipCode.php?zip=' + zip,
		opDescription: 'getting social proof data',
		isAsync: true,
		callback: callback
	};
	getJsonData(options);	
}

function submitRegisterUserForm(options, callback){
	if (options == undefined)
	{
		showMessage('submitRegisterUserForm(): options is required parameter.');
		return;
	}
	if (options.formData == undefined)
	{
		showMessage('submitRegisterUserForm(): options.formData is required parameter.');
		return;
	}

	var url = '/sendLeadData.php';
	var registrationData = {
		requestUrl: url,
		objectData: options.formData,
		opDescription: 'sending user registration data',
		isAsync: options.isAsync,
		callback: callback
	};
	postForm(registrationData);
	//callback();
}

function submitContactUsForm(options, callback)
{
	if (options == undefined)
	{
		showMessage('submitContactUsForm(): options is required parameter.');
		return;
	}
	if (options.formData == undefined)
	{
		showMessage('submitContactUsForm(): options.formData is required parameter.');
		return;
	}

	var url = '/sendContactForm.php';
	var contactUsData = {
		requestUrl: url,
		objectData: options.formData,
		opDescription: 'sending contact us message data',
		isAsync: options.isAsync,
		callback: callback
	};
	postForm(contactUsData);
	//callback();
}

function submitSignUpForm(options, callback)
{
	if (options == undefined)
	{
		showMessage('submitRegisterUserForm(): options is required parameter.');
		return;
	}
	if (options.formData == undefined)
	{
		showMessage('submitRegisterUserForm(): options.formData is required parameter.');
		return;
	}

	var url = '/sendContactRequest.php';
	var signUpData = {
		requestUrl: url,
		objectData: options.formData,
		opDescription: 'sending user sign up data',
		isAsync: options.isAsync,
		callback: callback
	};
	postForm(signUpData);
	//callback();
}



// PROXY AJAX FUNCTIONS

function postForm(options)
{
	// options:
	// * requestUrl: url to Back-End method
	// * objectData: data to send in JSON format
	// - opDescription: operation description text
	// - isAsync: true if async, false if sync
	// - callback: callback function
	if (options == undefined) options = {};
	if (options.requestUrl == undefined && options.objectData == undefined) return;
	if (options.opDescription == undefined) options.opDescription = '';
	if (options.isAsync == undefined) options.isAsync = true;
	if (options.callback == undefined) options.callback = function(){};

	var objectCreated = null;
	$.ajax({
		async: options.isAsync,
		url: options.requestUrl,
		crossDomain: true,
		data: options.objectData,
		type: "POST",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success: function( response, textStatus, jqXHR ){
			if (response != null) {
				if (response.errors) {
					showMessage(response.errors + ". Error: " + options.opDescription + ": ");
					objectCreated = response;
				}
				else {
				  if (options.isAsync)
						options.callback.call(null, response);
				  else
						objectCreated = response;
				}
			}
	  },
	  error: function( jqXHR, textStatus, errorThrown ){
			//if (errorThrown || textStatus.indexOf('error') != -1) {
				showMessage("Error " + options.opDescription + ": " + errorThrown);
			//}
	  },
	  complete: function( jqXHR, textStatus ){}
	});
	return objectCreated;
}

function postJsonData(options)
{
	// options:
	// * requestUrl: url to Back-End method
	// * objectData: data to send in JSON format
	// - opDescription: operation description text
	// - isAsync: true if async, false if sync
	// - callback: callback function
	if (options == undefined) options = {};
	if (options.requestUrl == undefined && options.objectData == undefined) return;
	if (options.opDescription == undefined) options.opDescription = '';
	if (options.isAsync == undefined) options.isAsync = true;
	if (options.callback == undefined) options.callback = function(){};

	var objectCreated = null;
	$.ajax({
		async: options.isAsync,
		url: options.requestUrl,
		//dataType: "json",
		//dataType: 'jsonp',
		data: JSON.stringify(options.objectData),
		//data: options.objectData,
		type: "POST",
		contentType: "application/json",
		success: function( response, textStatus, jqXHR ){
			if (response != null) {
				if (response.errors) {
					showMessage(response.errors + ". Error: " + options.opDescription + ": ");
					objectCreated = response;
				}
				else {
				  if (options.isAsync)
						options.callback.call(null, response);
				  else
						objectCreated = response;
				}
			}
	  },
	  error: function( jqXHR, textStatus, errorThrown ){
			if (errorThrown || textStatus.indexOf('error') != -1) {
				showMessage("Error " + options.opDescription + ": " + errorThrown);
				objectCreated = { errors: errorThrown };
			}
	  },
	  complete: function( jqXHR, textStatus ){}
	});
	return objectCreated;
}

function getJsonData(options)
{
	// options:
	// * requestUrl: url to Back-End method
	// - opDescription: operation description text
	// - isAsync: true if async, false if sync
	// - callback: callback function
	if (options == undefined) options = {};
	if (options.requestUrl == undefined) return;
	if (options.opDescription == undefined) options.opDescription = '';
	if (options.isAsync == undefined) options.isAsync = true;
	if (options.callback == undefined) options.callback = function(){};

	var objectOfGet = null;
	var callbackArgs = null;
	var args = null;
	if (arguments.length > 4) {
		callbackArgs = [].slice.call(arguments, 4);
	}
	
	// Return ajax call here...
	var ajaxCall = $.ajax({
		async: options.isAsync,
		url: options.requestUrl,
		dataType: "json",
		type: "GET",
		contentType: "application/json",
		callbackArgList: callbackArgs,
		success: function( response, textStatus, jqXHR ){
			if (response != null) {
				var responseIsString = (typeof(response) == "string");
				if (responseIsString) { // if json is returned as string.
					response = jQuery.parseJSON(response);
				}
				if (response.errors) {
					showMessage(response.errors + ". Error:" + options.opDescription);
					objectOfGet = response;
				}
				else {
				  if (options.isAsync) {
						if (this.callbackArgList == null)
							options.callback(response);
						else {
							this.callbackArgList.splice(0, 0, response);
							options.callback.apply(options.callback, this.callbackArgList);
						}
					}
				  else {
						if (options.callback) {
							if (this.callbackArgList == null)
								options.callback(response);
							else {
								this.callbackArgList.splice(0, 0, response);
								options.callback.apply(options.callback, this.callbackArgList);
							}
						}
						objectOfGet = response;
				  }
				}
			}
	  },
	  error: function( jqXHR, textStatus, errorThrown ){
			if (errorThrown || textStatus.indexOf('error') != -1)
			{
				showMessage("Error " + options.opDescription + ": " + errorThrown);
			}
	  },
	  complete: function( jqXHR, textStatus ){}
	});
	if (!options.isAsync)
		return objectOfGet;
	else
		return ajaxCall; // Return the call if async so that it can be aborted if necessary because of user navigating away.
}