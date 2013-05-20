<?php
//do quality checks on the incoming data here.

//then bundle the request and send it to Salesforce.com
$req  = "&lead_source=". urlencode($_REQUEST["leadSource"]);
$req .= "&first_name=" . urlencode($_REQUEST["firstName"]);
$req .= "&last_name=" . urlencode($_REQUEST["lastName"]); 
$req .= "&title=" . urlencode($_REQUEST["title"]);
$req .= "&company=" . urlencode($_REQUEST["company"]);
$req .= "&email=" . urlencode($_REQUEST["email"]);
$req .= "&phone=" . urlencode($_REQUEST["phone"]);
$req .= "&street=" . urlencode($_REQUEST["street"]);
$req .= "&city=" . urlencode($_REQUEST["city"]); 
$req .= "&state=" . urlencode($_REQUEST["state"]);
$req .= "&zip=" . urlencode($_REQUEST["zip"]);
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
?>
