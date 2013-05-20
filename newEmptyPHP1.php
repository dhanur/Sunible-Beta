<?php
echo "Hello ". $_GET['zip'] . "!<br />\n";
$res = array();
$conn = mysql_connect('localhost', 'root', '');
mysql_select_db('sunible', $conn);
$result = mysql_query("call getDashboardData($zip)");
$res = mysql_fetch_assoc($result);
print_r ($res);
mysql_close($conn);
?>