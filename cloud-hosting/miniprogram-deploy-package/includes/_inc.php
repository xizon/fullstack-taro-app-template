<?php
error_reporting(E_ALL ^ E_NOTICE);
date_default_timezone_set('PRC');
//容错处理
error_reporting(0);


header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-type: application/json');


include dirname(__FILE__) . '/conn.php';
include dirname(__FILE__) . '/format.php';