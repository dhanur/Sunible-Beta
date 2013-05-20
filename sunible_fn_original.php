<?php

function getSocial($zip){
$res_return = array(); 
$group = array();

// New Connection
$db = new mysqli('localhost','root','','sunible');

// Check for errors
if(mysqli_connect_errno()){
 echo mysqli_connect_error();
}

//$data = mysql_query("SELECT DISTINCT zipcode.group FROM zipcode WHERE zipcode.zip = $zip") 
 or die(mysql_error()); 
//$group = mysql_fetch_assoc($data);
//$gr = ($group['group']);
$gr = 1;
// 1st Query
$result = $db->query("call getSocialProofData($gr)");
if($result){
     // Cycle through results
    while ($row = $result->fetch_object()){
        $user_arr[] = $row;
    }
    // Free result set
    $result->close();
    $db->next_result();
}
else echo($db->error);

// Close connection
$db->close();

return($user_arr);



// 2nd Query
$result = $db->query("call getGroups()");
if($result){
     // Cycle through results
    while ($row = $result->fetch_object()){
        $group_arr[] = $row;
    }
     // Free result set
     $result->close();
     $db->next_result();
}








function getInstallers($zip){
$res = array();
$res_return = array();
$conn = mysql_connect('localhost', 'root', '');
mysql_select_db('sunible', $conn);
$result = mysql_query("call getDashboardData($zip)")
 or die(mysql_error()); 

while($res = mysql_fetch_assoc($result))
    {
    $res_return[] = $res;
    }
mysql_close($conn);
return json_encode($res_return);
}

function submitRegisterUser(
$first_name,
$last_name,
$street,
$city,
$state,
$zip,
$email,
$phone,
$Utility_Bill__c,
$Utility_Company__c,
$Roof_Type__c,
$Own_Rent__c,
$Utility_Rating__c,
$Choice_1__c,
$Choice_2__c,
$Choice_3__c,
$Choice_4__c,
$Choice_5__c,
$Choice_6__c,
$Choice_7__c,
$Choice_8__c,
$Choice_9__c,
$Choice_10__c,
$Choice_11__c,
$Choice_12__c,
$Choice_13__c,
$Choice_14__c,
$Choice_15__c,
$Choice_16__c,
$Choice_17__c,
$Choice_18__c,
$Choice_19__c,
$Choice_20__c,
$Choice_21__c,
$Choice_22__c,
$Choice_23__c,
$Choice_24__c,
$Choice_25__c,
$Choice_26__c,
$Choice_27__c,
$Choice_28__c,
$Choice_29__c,
$Choice_30__c){

//bundle the request and send it to Salesforce.com

$req  = "&first_name=". urlencode($first_name);
$req .= "&last_name=" . urlencode($last_name);
$req .= "&street=" . urlencode($street); 
$req .= "&city=" . urlencode($city);
$req .= "&state=" . urlencode($state);
$req .= "&zip=" . urlencode($zip);
$req .= "&email=" . urlencode($email);
$req .= "&phone=" . urlencode($phone);
$req .= "&Utility_Bill__c=" . urlencode($Utility_Bill__c); 
$req .= "&Utility_Company__c=" . urlencode($Utility_Company__c); 
$req .= "&Roof_Type__c=" . urlencode($Roof_Type__c); 
$req .= "&Own_Rent__c=" . urlencode($Own_Rent__c); 
$req .= "&Utility_Rating__c=" . urlencode($Utility_Rating__c); 
$req .= "&Choice_1__c=" . urlencode($Choice_1__c);
$req .= "&Choice_2__c=" . urlencode($Choice_2__c);
$req .= "&Choice_3__c=" . urlencode($Choice_3__c);
$req .= "&Choice_4__c=" . urlencode($Choice_4__c);
$req .= "&Choice_5__c=" . urlencode($Choice_5__c);
$req .= "&Choice_6__c=" . urlencode($Choice_6__c);
$req .= "&Choice_7__c=" . urlencode($Choice_7__c);
$req .= "&Choice_8__c=" . urlencode($Choice_8__c);
$req .= "&Choice_9__c=" . urlencode($Choice_9__c);
$req .= "&Choice_10__c=" . urlencode($Choice_10__c);
$req .= "&Choice_11__c=" . urlencode($Choice_11__c);
$req .= "&Choice_12__c=" . urlencode($Choice_12__c);
$req .= "&Choice_13__c=" . urlencode($Choice_13__c);
$req .= "&Choice_14__c=" . urlencode($Choice_14__c);
$req .= "&Choice_15__c=" . urlencode($Choice_15__c);
$req .= "&Choice_16__c=" . urlencode($Choice_16__c);
$req .= "&Choice_17__c=" . urlencode($Choice_17__c);
$req .= "&Choice_18__c=" . urlencode($Choice_18__c);
$req .= "&Choice_19__c=" . urlencode($Choice_19__c);
$req .= "&Choice_20__c=" . urlencode($Choice_20__c);
$req .= "&Choice_21__c=" . urlencode($Choice_21__c);
$req .= "&Choice_22__c=" . urlencode($Choice_22__c);
$req .= "&Choice_23__c=" . urlencode($Choice_23__c);
$req .= "&Choice_24__c=" . urlencode($Choice_24__c);
$req .= "&Choice_25__c=" . urlencode($Choice_25__c);
$req .= "&Choice_26__c=" . urlencode($Choice_26__c);
$req .= "&Choice_27__c=" . urlencode($Choice_27__c);
$req .= "&Choice_28__c=" . urlencode($Choice_28__c);
$req .= "&Choice_29__c=" . urlencode($Choice_29__c);
$req .= "&Choice_30__c=" . urlencode($Choice_30__c);
$req .= "&debug=" . urlencode("0");
$req .= "&oid=" . urlencode("00Di0000000JACU"); 
$req .= "&retURL=" . urlencode("www.sunible.com");
$req .= "&debugEmail=" . urlencode("john@sunible.com");

$header  = "POST /servlet/servlet.WebToLead?encoding=UTF-8 HTTP/1.0\r\n";
$header .= "Content-Type: application/x-www-form-urlencoded\r\n";
$header .= "Host: www.salesforce.com\r\n";
$header .= "Content-Length: " . strlen($req) . "\r\n\r\n";
$fp = fsockopen ('www.salesforce.com', 80, $errno, $errstr, 30);
if (!$fp) {
echo "No connection made";
} else {
fputs ($fp, $header . $req);
while (!feof($fp)) {
$res = fgets ($fp, 1024);
echo $res;
}
}
fclose($fp);
}

function objectToArray($d) {
        if (is_object($d)) {
                // Gets the properties of the given object
                // with get_object_vars function
                $d = get_object_vars($d);
        }
 
        if (is_array($d)) {
                /*
                * Return array converted to object
                * Using __FUNCTION__ (Magic constant)
                * for recursive call
                */
                return array_map(__FUNCTION__, $d);
        }
        else {
                // Return array
                return $d;
        }
}
 
//
// From http://non-diligent.com/articles/yelp-apiv2-php-example/
//

function getYelpData($ys) {

// Enter the path that the oauth library is in relation to the php file

require_once ('lib/OAuth.php');

$unsigned_url = "http://api.yelp.com/v2/business/" . $ys;

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

$response = json_decode($data);

// Print it for debugging
// print_r($response);
return $response;
}

?>