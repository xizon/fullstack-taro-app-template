<?php

include dirname(__FILE__) . '/class-sql.php';


// Local
$SQL_DB['hostname']='localhost';
$SQL_DB['username']='mm';
$SQL_DB['password']='mm';
$SQL_DB['database']='test1';
$SQL_DB['prefix']='mysql_';


// Cloud
// $SQL_DB['hostname']='10.0.0.0';
// $SQL_DB['port']='3306'; //optional
// $SQL_DB['username']='xxxxxxx';
// $SQL_DB['password']='xxxxxxx';
// $SQL_DB['database']='test1';
// $SQL_DB['prefix']='mysql_';



$sql_db = new DB();
$sql_db->connect($SQL_DB);
