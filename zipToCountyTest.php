<?php
include 'sunible_fn.php';
$social = array();
$social = zipToCounty($_REQUEST['zip']);
print_r($social);
?>