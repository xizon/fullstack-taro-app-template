<?php

/**
 * Database 
 * 
 */

/*****************************************************************

$SQL_DB['hostname']='localhost';
$SQL_DB['port']='3306';  // optional
$SQL_DB['username']='mm';
$SQL_DB['password']='mm';
$SQL_DB['database']='test1';
$SQL_DB['prefix']='mysql_';

$timer_begin = getmicrotime();
$sql_db = new DB();
$sql_db->connect($SQL_DB);

// --------------【1】Retrieve a single record ---------------
$topic = $sql_db->row_select_one("TABLE_NAME_WITHOUT_PREFIX", "condition");
$topic = $sql_db->row_select_one("TABLE_NAME_WITHOUT_PREFIX", "condition", "field, can be left blank by default");

//////////////////////////

$tid = 4;
$b_topic = $sql_db->row_select_one("TABLE_NAME_WITHOUT_PREFIX", "id={$tid}");
echo $b_topic['name'];



// --------------【2】Take out multiple records ---------------
$b_rows = $sql_db->row_select("TABLE_NAME_WITHOUT_PREFIX", "Condition", 0, "Field, fill in * to get all", "Sorting method, if you don't fill in this parameter, it will be reversed by default");

//////////////////////////

$b_rows = $sql_db->row_select("TABLE_NAME_WITHOUT_PREFIX", "id!='2'", 0, "name,id", "id asc");
foreach ($b_rows as $b_row) {
if (!empty($b_row['name'])) {
echo $b_row['id'] . '------' . $b_row['name'] . '<br>';
}
}


// --------------【3】Modify record ---------------
$b_post['field name 1'] = 'content to be updated';
$sql_db->row_update("TABLE_NAME_WITHOUT_PREFIX", $b_post, "condition");

//////////////////////////

$tid = 1;
$b_post['name'] = 'User test modification 00000000';
$sql_db->row_update("TABLE_NAME_WITHOUT_PREFIX", $b_post, "id={$tid}");


// --------------【4】Delete record ---------------
$sql_db->row_delete("TABLE_NAME_WITHOUT_PREFIX", "condition");

//////////////////////////

$tid = 2;
$sql_db->row_delete("TABLE_NAME_WITHOUT_PREFIX", "id={$tid}");



// --------------【5】Get the total number of records ---------------
$b_total = $sql_db->row_count("TABLE_NAME_WITHOUT_PREFIX", "condition");

//////////////////////////

$b_total = $sql_db->row_count("TABLE_NAME_WITHOUT_PREFIX", "id < 10");
echo $b_total;


// --------------【6】Insert a record---------------
$b_user['field name 1'] = 'content to be updated';
$b_user['field name 2'] = 'content to be updated';
$sql_db->row_insert("TABLE_NAME_WITHOUT_PREFIX", $b_user);

//////////////////////////
Only when the required fields are met can the insertion be successful

$b_user['user_login'] = 'kfiuwi_89';
$b_user['ID'] = '4';
$b_user['user_registered'] = date('Y/m/d H:i:s', time());
$sql_db->row_insert("users", $b_user);

// --------------【7】Determine whether the data exists ---------------
$userid = 3;
$b_user = $sql_db->row_select_one("users","ID = '{$userid}'","user_login");
$username = $b_user['user_login'];

if ( !is_null($username) ) {
     var_dump($username);
} else {
     echo 'User does not exist';
}


// --------------【8】Create a new table---------------
$sql_db->create_table("users_app", "
    ID         INT NOT NULL AUTO_INCREMENT,
    open_id    VARCHAR(100) DEFAULT '',
    login      VARCHAR(40) NOT NULL,
    pw         VARCHAR(255),
    email      VARCHAR(255),
    nickname   VARCHAR(100) DEFAULT 'Anonymous',
    avatar     VARCHAR(255),
    intro      TEXT,
    tel        VARCHAR(100),
    address    VARCHAR(255),
    lastname   VARCHAR(50),
    firstname  VARCHAR(50),
    gender     INT DEFAULT -1,
    age        INT DEFAULT 0,
    reg_date   DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ( ID )
 ");
$sql_db->close_db();



// --------------【9】Delete a table---------------
$sql_db->delete_table("users_app");
$sql_db->close_db();

 *******************************************************************/

class DB {
    public $pre = ""; //The prefix of the data table name
    public $debug = true;
    public $connection_id = null;
    public $pconnect = 1;
    public $shutdown_queries = array();
    public $queries = array();
    public $query_id = "";
    public $query_count = 0;
    public $record_row = array();
    public $record_row_count = 0;
    public $failed = 0;
    public $halt = "";
    public $query_log = array();

    function connect($_DB) {
        $this->pre = $_DB['prefix'];


        if ( is_null($_DB['port']) || $_DB['port'] === '' || $_DB['port'] === false) {
            $this->connection_id = mysqli_connect($_DB['hostname'], $_DB['username'], $_DB['password'], $_DB['database']);
        } else {
            $this->connection_id = mysqli_connect($_DB['hostname'], $_DB['username'], $_DB['password'], $_DB['database'], $_DB['port']);
        }
        

        // Check For Connection
        if (!$this->connection_id) {
            die("Connection Terminated! by Die() function" . mysqLi_connect_error());
        }

        return true;
    }
    //Send SQL query and return result set
    function query($query_id) {
        $this->query_id = mysqli_query($this->connection_id, $query_id);
        $this->queries[] = $query_id;
        if (!$this->query_id) {
            $this->halt("Query failed:\n$query_id");
        }
        $this->query_count++;
        //echo($this->query_count."-----".$query_id."\r\n");
        return $this->query_id;
    }
    //Send SQL query without fetching and caching result rows
    function query_unbuffered($sql = "") {
        return $this->query($sql);
    }
    // Get a row from the result set as an associative array
    function fetch_array($sql = "") {
        if ($sql == "") $sql = $this->query_id;
        $this->record_row = mysqli_fetch_array($sql, MYSQLI_ASSOC);
        return $this->record_row;
    }
    function shutdown_query($query_id = "") {
        $this->shutdown_queries[] = $query_id;
    }
    //Get the number of rows in the result set, only for INSERT, UPDATE or DELETE
    function affected_rows() {
        return mysqli_affected_rows($this->connection_id);
    }
    //Get the number of rows in the result set, only valid for SELECT statement
    function num_rows($query_id = "") {
        if ($query_id == "") $query_id = $this->query_id;
        return mysqli_num_rows($query_id);
    }
    // Returns the numeric code of the error message from the last MySQL operation
    function get_errno() {
        $this->errno = mysqli_errno($this->connection_id);
        return $this->errno;
    }
    // Get the ID generated by the previous INSERT operation
    function insert_id() {
        return mysqli_insert_id($this->connection_id);
    }
    //Get the number of queries
    function query_count() {
        return $this->query_count;
    }
    // release result memory
    function free_result($query_id = "") {
        if ($query_id == "") $query_id = $this->query_id;
        mysqli_free_result($query_id);
    }
    //Close the MySQL connection
    function close_db() {
        if ($this->connection_id) return mysqli_close($this->connection_id);
    }
    //List the tables in the MySQL database
    function get_table_names() {
        global $_DB;
        $listdbtables = array_column($this->query('SHOW TABLES')->fetch_all(), 0);
        return $listdbtables;
    }
    //Get the column information from the result set and return it as an object, get all the fields
    function get_result_fields($query_id = "") {
        if ($query_id == "") $query_id = $this->query_id;
        while ($field = mysqli_fetch_field($query_id)) {
            $fields[] = $field;
        }
        return $fields;
    }
    //Error message
    function halt($the_error = "") {
        $message = $the_error . "<br/>\r\n";
        $message .= $this->get_errno() . "<br/>\r\n";
        if ($this->debug == true) {
            //htmlspecialchars($message)
            return 0;
        } else {
            echo 'Updating!';
            exit('<!doctype html><html><head><title></title><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /></head ><body>Updating...</body></html>');
        }
    }
    function __destruct() {
        $this->shutdown_queries = array();
        $this->close_db();
    }
    function sql_select($tbname, $where = "", $limit = 0, $fields = "*", $orderby = "id DESC") {
        $sql = "SELECT " . $fields . " FROM " . $tbname . " " . ($where ? " WHERE " . $where : "") . " ORDER BY " . $orderby . ($limit ? " limit " . $limit : "");
        //echo($sql);
        return $sql;
    }
    function sql_insert($tbname, $row) {
        foreach ($row as $key => $value) {
            $sqlfield .= $key . ",";
            $sqlvalue .= "'" . $value . "',";
        }
        return "INSERT INTO " . $tbname . " (" . substr($sqlfield, 0, -1) . ") VALUES (" . substr($sqlvalue, 0, -1) . ")";
    }
    function sql_update($tbname, $row, $where) {
        foreach ($row as $key => $value) {
            if (stristr($key, "NOQUOTE_")) {
                continue;
            }
            if ($row["NOQUOTE_{$key}"]) {
                $sqlud .= $key . "=" . $value . ",";
            } else {
                $sqlud .= $key . "= '" . $value . "',";
            }
        }
        return "UPDATE " . $tbname . " SET " . substr($sqlud, 0, -1) . ($where ? " WHERE " . $where : "");
    }
    function sql_delete($tbname, $where) {
        return "DELETE FROM " . $tbname . " WHERE " . $where;
    }


    function row_query($sql) {
        $rs = $this->query($sql);
        $rs_num = $this->num_rows($rs);
        $rows = array();
        for ($i = 0; $i < $rs_num; $i++) {
            $rows[] = $this->fetch_array($rs);
        }
        $this->free_result($rs);
        $this->record_row_count = $rs_num;
        return $rows;
    }
    function row_query_one($sql) {
        //print($sql."<br />");
        $rs = $this->query($sql);
        $row = $this->fetch_array($rs);
        $this->free_result($rs);
        return $row;
    }

    function fix_tbname_cname($tbname) {
        $tbs = explode(",", $tbname);
        $tbname = "";
        for ($t = 0; $t < count($tbs); $t++) {
            $tbname .= "`{$this->pre}{$tbs[$t]}` {$tbs[$t]},";
        }
        $tbname = substr($tbname, 0, strlen($tbname) - 1);
        return $tbname;
    }

    function fix_tbname($tbname) {
        $tbname = "`{$this->pre}{$tbname}`";
        return $tbname;
    }

    // Add a new record
    function row_insert($tbname, $row) {
        $tbname = $this->fix_tbname($tbname);
        $sql = $this->sql_insert($tbname, $row);
        return $this->query_unbuffered($sql);
    }
    //Update the specified record
    function row_update($tbname, $row, $where = "") {
        $tbname = $this->fix_tbname($tbname);
        $sql = $this->sql_update($tbname, $row, $where);
        return $this->query_unbuffered($sql);
    }
    //Delete records that meet the condition
    function row_delete($tbname, $where) {
        $tbname = $this->fix_tbname($tbname);
        $sql = $this->sql_delete($tbname, $where);
        //echo($sql);
        return $this->query_unbuffered($sql);
    }
    //Query multiple records
    function row_select($tbname, $where = "", $limit = 0, $fields = "*", $orderby = "id DESC") {
        $tbname = $this->fix_tbname_cname($tbname);
        $sql = $this->sql_select($tbname, $where, $limit, $fields, $orderby);
        return $this->row_query($sql);
    }
    //Query a record
    function row_select_one($tbname, $where = "", $fields = "*", $orderby = "id") {
        $tbname = $this->fix_tbname_cname($tbname);
        $sql = $this->sql_select($tbname, $where, 1, $fields, $orderby);
        //echo($sql);
        return $this->row_query_one($sql);
    }

    //Count statistics
    function row_count($tbname, $where = "") {
        $tbname = $this->fix_tbname_cname($tbname);
        $sql = "SELECT count(0) as row_sum FROM " . $tbname . " " . ($where ? " WHERE " . $where : "");
        $row = $this->row_query_one($sql);
        return $row['row_sum'];
    }

    //Create a new table
    function create_table($tbname, $columns) {
        $tbname = $this->fix_tbname($tbname);
        $sql = "CREATE TABLE " . $tbname . " (" . $columns . ")";
        return $this->query_unbuffered($sql);
    }


    // delete a table
    function delete_table($tbname) {
        $tbname = $this->fix_tbname($tbname);
        $sql = "DROP TABLE " . $tbname . "";
        return $this->query_unbuffered($sql);
    }
}
