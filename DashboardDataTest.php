<?php
include 'sunible_fn.php';
$installers = getInstallers($_REQUEST['zip']);
print_r($installers);
?>