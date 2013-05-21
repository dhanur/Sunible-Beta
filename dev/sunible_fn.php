<?php

function getSocial($zip){

include 'db_vars.php';
$res_return = array(); 
$group = array();
$ho_geodata = array();
$county_totals = array();

// New Connection
$db = new mysqli($host,$uid,$pw,$dbs);
if(mysqli_connect_errno()){echo mysqli_connect_error();}

// get county that zip is located in
$result = $db->query("SELECT county FROM zipcode WHERE zip = $zip"); 
$group = $result->fetch_object();
//$gr = $group->group;
$gr = $group->county;
$result->close();

// get geodata
$result = $db->query("call getSocialProofData('$gr')");
if($result){
    // Cycle through results
    while ($row = $result->fetch_object()){
        $user_arr[] = ($row);
    }
    $result->close();
    $db->next_result();
}
else echo($db->error);

$result = $db->query("SELECT zip, latitude, longitude  FROM zipcode WHERE zip = $zip");
$data = $result->fetch_object();
$ho_geodata = objectToArray($data);
$result->close();

// get social proof data
$result = $db->query("call getCountyTotals('$gr')");
$data = $result->fetch_object();
$county_totals = objectToArray($data);
$result->close();

//if($data->total_installers == 0){
//  $data->total_installers = $data->total_installers_county;}

// Close connection  
$db->close();

$data = array_merge($ho_geodata,$county_totals);
$res_return['geodata'] = $user_arr;
return(json_encode(array($data,$res_return)));
}

function getInstallers($zip){

include 'db_vars.php';
$res = array();
$res_return = array();

$db = new mysqli($host,$uid,$pw,$dbs);
if(mysqli_connect_errno()){echo mysqli_connect_error();}

// get county that zip is located in
$result = $db->query("SELECT county FROM zipcode WHERE zip = $zip"); 
$group = $result->fetch_object();
$gr = $group->county;
$result->close();

// get installers serving homeowner's area
$result = $db->query("call getDashboardData('$gr')");
if($result){
    while($res = $result->fetch_object())
        {
        $res_return[] = $res;
    }
    $result->close();
    $db->next_result();
}

return json_encode($res_return);
}

function submitSignUp(
$first_name,
$last_name,
$email,
$reason){
$req  = "&first_name=". urlencode($first_name);
$req .= "&last_name=" . urlencode($last_name);
$req .= "&email=" . urlencode($email);
$req .= "&Contact_Request__c=" . urlencode($reason);
$req .= "&Lead_Type__c=" . urlencode("Contact Request");
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
$req .= "&Lead_Type__c=" . urlencode("Solar RFQ");
//$req .= "&LeadSource=" . urlencode("Web");
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
                $d = get_object_vars($d);
        }
 
        if (is_array($d)) {
                return array_map(__FUNCTION__, $d);
        }
        else {
                return $d;
        }
}
 
//
// Gets Yelp ratings for installers where they exist
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

function sendEmailForm($name,$email,$comments) {
include 'db_vars.php';

$db = new mysqli($host,$uid,$pw,$dbs);
if(mysqli_connect_errno()){echo mysqli_connect_error();}

$sql="INSERT INTO contact_us (name, email, comments) VALUES ('$name', '$email', '$comments')";

if (!mysqli_query($db,$sql))
  {
  die('Error: ' . mysqli_error($con));
  }

mysqli_close($db);

$email_to = "info@sunible.com";
$email_message = "Name: ".$name."\n";
$email_message .= "Email: ".$email."\n";
$email_message .= "Comments: ".$comments."\n";
$email_subject = "Contact request from " . $name;    
     
// create email headers
$headers = 'From: '.$email."\r\n".
'Reply-To: '.$email."\r\n" .
'X-Mailer: PHP/' . phpversion();
@mail($email_to, $email_subject, $email_message, $headers);  

return("1");
}

?>