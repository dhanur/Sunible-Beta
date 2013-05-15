<?php

include 'sunible_fn.php';

$conn = mysql_connect('localhost', 'torrohol_nik', 'installers') or die(mysql_error());
mysql_select_db('torrohol_ca_csi', $conn) or die(mysql_error());

// Update county totals - works

set_time_limit(1200);
mysql_query("call totalCountyArrays");
mysql_query("update county_ca z set z.total_install_number = 0 where z.total_install_number is null") or die(mysql_error());
mysql_query("call totalCountyInstallers");
mysql_query("update county_ca z set z.total_installers = 0 where z.total_installers is null") or die(mysql_error());
mysql_query("call totalCountyLeases");
mysql_query("update county_ca z set z.total_lease = 0 where z.total_lease is null") or die(mysql_error());

// Update zip totals - works

set_time_limit(2400);
mysql_query("call totalZipArrays");
mysql_query("update zipcode z set z.total_install_number = 0 where z.total_install_number is null") or die(mysql_error());
mysql_query("call totalZipInstallers");
mysql_query("update zipcode z set z.total_installers = 0 where z.total_installers is null") or die(mysql_error());
mysql_query("call totalZipLeases");
mysql_query("update zipcode z set z.total_lease = 0 where z.total_lease is null")  or die(mysql_error());

// Update installer totals - Only totalZipArrays used for now

set_time_limit(1200);
mysql_query("call totalZipArrays");
mysql_query("update installer z set z.total_installs = 0 where z.total_installs is null") or die(mysql_error());
mysql_query("call totalZipInstallers");
mysql_query("call totalZipLeases");
mysql_query("call avgPriceDC");

// Update Yelp ratings

$yelp_search = array();
$php_errormsg = "";

$data = mysql_query("SELECT contractor_license, yelp_search FROM installer") 
 or die(mysql_error()); 

 while($yelp_search = mysql_fetch_array( $data )) 
    { 
    if ($yelp_search['yelp_search'] == "-") { continue; }
    $yelp_result = getYelpData($yelp_search['yelp_search']);
    $r = $yelp_result->rating;
    $cl = $yelp_search['contractor_license'];
    mysql_query("UPDATE installer SET yelp_rating = $r WHERE contractor_license = $cl") 
 or die(mysql_error());
    }

mysql_close($conn); 

?>