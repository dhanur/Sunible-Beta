<?php

$urlParams = explode('/', $_SERVER['REQUEST_URI']);
$functionName = $urlParams[4];
$functionName($urlParams[5]);


function func1 ($urlParams) {
    echo "In func1";
}

function func2 ($urlParams) {
    echo "In func2";
    echo "<br/>Argument 1 -> ".$urlParams[5];
    echo "<br/>Argument 2 -> ".$urlParams[6];
}

?>
