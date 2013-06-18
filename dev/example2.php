<?php

//
// From http://non-diligent.com/articles/yelp-apiv2-php-example/
//


// Enter the path that the oauth library is in relation to the php file

require_once ('lib/OAuth.php');


$unsigned_url = "http://api.yelp.com/v2/business/nextenergy-concord";


// Set your keys here
$consumer_key = "v4YmP_9dARZiJI2FDqWRhA";
$consumer_secret = "e3adN4sIQdgiuCsoSpUY0p1zzZI";
$token = "T60Ybdyz46bcChL4cH93Uzn9UbgfNG9_";
$token_secret = "SvN3fYjSYZ03ePyztYfgYajk7Os";

// Token object built using the OAuth library
$token = new OAuthToken($token, $token_secret);

// Consumer object built using the OAuth library
$consumer = new OAuthConsumer($consumer_key, $consumer_secret);

// Yelp uses HMAC SHA1 encoding
$signature_method = new OAuthSignatureMethod_HMAC_SHA1();

// Build OAuth Request using the OAuth PHP library. Uses the consumer and token object created above.
$oauthrequest = OAuthRequest::from_consumer_and_token($consumer, $token, 'GET', $unsigned_url);

// Sign the request
$oauthrequest->sign_request($signature_method, $consumer, $token);

// Get the signed URL
$signed_url = $oauthrequest->to_url();

// Send Yelp API Call
$ch = curl_init($signed_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, 0);
$data = curl_exec($ch); // Yelp response
curl_close($ch);

// Handle Yelp response data
//$response = json_decode($data);

// Print it for debugging
//print_r($response);
print_r($data);
return $data;

?>
