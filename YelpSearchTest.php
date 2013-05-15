<?php
include 'sunible_fn.php';
$Results = getYelpData($_REQUEST['yelpSearch']);
print_r($Results);
?>