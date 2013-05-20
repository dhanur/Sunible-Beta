<?php
$result = array();
$conn = mysql_connect('localhost', 'root', '');
mysql_select_db("sunible", $conn);
$zip=93210;
$result = mysql_query("call getDataProc(93210)");
print $result;
mysql_close($conn);
?>