<?php

include 'db_vars.php';
include 'sunible_fn.php';

$conn = mysql_connect($host, $uid, $pw) or die(mysql_error());
mysql_select_db($dbs, $conn) or die(mysql_error());

// Update county totals

set_time_limit(2400);
mysql_query("call totalCountyArrays");
mysql_query("update county_ca z set z.total_install_number = 0 where z.total_install_number is null") or die(mysql_error());
mysql_query("call totalCountyInstallers");
mysql_query("update county_ca z set z.total_installers_county = 0 where z.total_installers_county is null") or die(mysql_error());
mysql_query("call totalCountyLeases");
mysql_query("update county_ca z set z.total_lease = 0 where z.total_lease is null") or die(mysql_error());

echo "done with county totals";

//Update zip totals

set_time_limit(4800);
mysql_query("call totalZipArrays");
mysql_query("update zipcode z set z.total_install_number = 0 where z.total_install_number is null") or die(mysql_error());
mysql_query("call totalZipLeases");
mysql_query("update zipcode z set z.total_lease = 0 where z.total_lease is null") or die(mysql_error());

echo "done with zip totals";

// Update installer totals - 

set_time_limit(2400);
mysql_query("call totalInstallerInstalls");
mysql_query("update installer_county i set i.total_installs = 0 where i.total_installs is null") or die(mysql_error());

echo "done with installer totals";

//Update Yelp ratings

$yelp_search = array();
$php_errormsg = "";

$data = mysql_query("SELECT contractor_license, yelp_search FROM installer WHERE yelp_search <> '-'" ) or die(mysql_error()); 

 while($yelp_search = mysql_fetch_array($data)) 
    { 
    $yelp_result = getYelpData($yelp_search['yelp_search']);
    if($yelp_result->rating == NULL){$r = "-";} else {$r = $yelp_result->rating;}
    if($yelp_result->review_count == NULL){$s = "-";} else {$s = $yelp_result->review_count;}
    $cl = $yelp_search['contractor_license'];
    mysql_query("UPDATE installer SET yelp_rating = $r, yelp_review_count = $s WHERE contractor_license = $cl") or die(mysql_error());
    }

mysql_close($conn); 

echo "done with Yelp";

?>