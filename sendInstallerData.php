<?php

include 'sunible_fn.php';

submitInstallerUser(
$_REQUEST['company'],
$_REQUEST['street'],
$_REQUEST['city'],
$_REQUEST['state'],
$_REQUEST['zip'],
$_REQUEST['website'],
$_REQUEST['first_name'],
$_REQUEST['last_name'],
$_REQUEST['title'],
$_REQUEST['phone'],
$_REQUEST['mobilephone'],
$_REQUEST['email'],
$_REQUEST['Second_Contact_Name__c'],
$_REQUEST['Second_Contact_Phone__c'],
$_REQUEST['Second_Contact_MobilePhone__c'],
$_REQUEST['Second_Contact_Email__c']);

?>