<?php
include 'sunible_fn.php';
$return = sendEmailForm(
$_REQUEST['name'],
$_REQUEST['email'],
$_REQUEST['comments']);

//print $return;
?>

