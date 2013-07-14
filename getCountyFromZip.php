<?php
include 'sunible_fn.php';
$social = array();
$social = getCountyFromZip($_REQUEST['zip']);
print_r($social);
?>