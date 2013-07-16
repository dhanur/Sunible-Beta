<?php

include 'sunible_fn.php';
$yelp_search = array();
$php_errormsg = "";

$conn = mysql_connect('localhost', 'torrohol_nik', 'installers') or die(mysql_error());
mysql_select_db('torrohol_ca_csi', $conn) or die(mysql_error());

$data = mysql_query("SELECT contractor_license, yelp_search FROM installer") 
 or die(mysql_error()); 

// works where yelp record found and rating exists.  
// need to add logic to catch errors and replace missing ratings with a -

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
