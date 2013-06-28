<?php

include 'sunible_fn.php';

$conn = mysql_connect('localhost', 'root', '') or die(mysql_error());
mysql_select_db('sunible', $conn) or die(mysql_error());

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