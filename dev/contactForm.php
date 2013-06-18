<?php

include 'db_vars.php';
include 'sunible_fn.php';

$conn = mysql_connect($host, $uid, $pw) or die(mysql_error());
mysql_select_db($dbs, $conn) or die(mysql_error());
