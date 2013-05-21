<?php


$con = mysql_connect("localhost","torrohol_nik","installers");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }

mysql_select_db("torrohol_marketing", $con);

$query = "SELECT * FROM landing_page";

$result = mysql_query($query) or die(mysql_error());

        echo 'TIMESTAMP      -       EMAIL       -      ZIP  -  IP ADDRESS';
        echo "<br />";

while($row = mysql_fetch_array($result)){
        echo $row['timestamp']. " - ". $row['email']. " - ". $row['zip']. " - ". $row['IP'];
	echo "<br />";
}

if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }

mysql_close($con);

?>

