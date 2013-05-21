<?php
require_once 'anet_php_sdk/AuthorizeNet.php'; // The SDK
$url = "http://localhost/sunible/webroot/direct_post.php";
$api_login_id = '4K44t3Lmry';
$transaction_key = '5Q4x5Ss8puA9z9Uu';
$md5_setting = '4K44t3Lmry'; // Your MD5 Setting
$amount = "5.99";
AuthorizeNetDPM::directPostDemo($url, $api_login_id, $transaction_key, $amount, $md5_setting);
?>