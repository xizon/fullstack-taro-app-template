<?php

/*****************************************************************
DB类(兼容PHP7+)
	  

$SQL_DB['hostname']='localhost';
$SQL_DB['port']='3306';  // 可选
$SQL_DB['username']='mm';
$SQL_DB['password']='mm';
$SQL_DB['database']='test1';
$SQL_DB['prefix']='mysql_';

$timer_begin = getmicrotime();
$sql_db = new DB();
$sql_db->connect($SQL_DB);


// --------------【1】取出单条记录---------------
$topic = $sql_db->row_select_one("表的无表前缀名称", "条件");
$topic = $sql_db->row_select_one("表的无表前缀名称", "条件", "字段,默认可不填");

/////////////////////////

$tid = 4;
$b_topic = $sql_db->row_select_one("表的无表前缀名称", "id={$tid}");
echo $b_topic['name'];



// --------------【2】取出多条记录---------------
$b_rows = $sql_db->row_select("表的无表前缀名称", "条件", 0, "字段,填写*则取所有", "排序方式,不填写这个参数则默认倒叙");

/////////////////////////

$b_rows = $sql_db->row_select("表的无表前缀名称", "id!='2'", 0, "name,id", "id asc");
foreach ($b_rows as $b_row) {
	if (!empty($b_row['name'])) {
		echo $b_row['id'] . '------' . $b_row['name'] . '<br>';
	}
}


// --------------【3】修改记录---------------
$b_post['字段名1'] = '要更新的内容';
$sql_db->row_update("表的无表前缀名称", $b_post, "条件");

/////////////////////////

$tid = 1;
$b_post['name'] = '用户测试修改00000000';
$sql_db->row_update("表的无表前缀名称", $b_post, "id={$tid}");


// --------------【4】删除记录---------------
$sql_db->row_delete("表的无表前缀名称", "条件");

/////////////////////////

$tid = 2;
$sql_db->row_delete("表的无表前缀名称", "id={$tid}");



// --------------【5】取得记录总数---------------
$b_total = $sql_db->row_count("表的无表前缀名称", "条件");

/////////////////////////

$b_total = $sql_db->row_count("表的无表前缀名称", "id < 10");
echo $b_total;


// --------------【6】插入一条记录---------------
$b_user['字段名1'] = '要更新的内容';
$b_user['字段名2'] = '要更新的内容';
$sql_db->row_insert("表的无表前缀名称", $b_user);

/////////////////////////
满足必填字段后，才能成功插入

$b_user['user_login'] = 'kfiuwi_89';
$b_user['ID'] = '4';
$b_user['user_registered'] = date('Y/m/d H:i:s', time());
$sql_db->row_insert("users", $b_user);

// --------------【7】判断数据是否存在---------------
$userid = 3;
$b_user = $sql_db->row_select_one("users","ID = '{$userid}'","user_login");
$username = $b_user['user_login'];

if ( !is_null($username) ) {
    var_dump($username);
} else {
    echo '用户不存在';
}


// --------------【8】新建一个新表---------------
$sql_db->create_table("users_app", "
    ID         INT NOT NULL AUTO_INCREMENT,
    open_id    VARCHAR(100) DEFAULT '',
    login      VARCHAR(40) NOT NULL,
    pw         VARCHAR(255),
    email      VARCHAR(255),
    nickname   VARCHAR(100) DEFAULT 'Anonymous',
    avatar     TEXT,
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



// --------------【9】删除一个表---------------
 $sql_db->delete_table("users_app");
 $sql_db->close_db();


 *******************************************************************/

class DB {
	public $pre = "";	//数据表名的前缀
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
        if(!$this->connection_id){
            die ("Connection Terminated! by Die() function". mysqLi_connect_error());
        }

		return true;
	}
	//发送SQL 查询，并返回结果集
	function query($query_id) {
		$this->query_id = mysqli_query($this->connection_id, $query_id);
		$this->queries[] = $query_id;
		if (!$this->query_id) {
			$this->halt("查询失败:\n$query_id");
		}
		$this->query_count++;
		//echo($this->query_count."-----".$query_id."\r\n");
		return $this->query_id;
	}
	//发送SQL 查询，并不获取和缓存结果的行
	function query_unbuffered($sql = "") {
		return $this->query($sql);
	}
	//从结果集中取得一行作为关联数组
	function fetch_array($sql = "") {
		if ($sql == "") $sql = $this->query_id;
		$this->record_row = mysqli_fetch_array($sql, MYSQLI_ASSOC);
		return $this->record_row;
	}
	function shutdown_query($query_id = "") {
		$this->shutdown_queries[] = $query_id;
	}
	//取得结果集中行的数目，仅对 INSERT，UPDATE 或者 DELETE
	function affected_rows() {
		return mysqli_affected_rows($this->connection_id);
	}
	//取得结果集中行的数目，仅对 SELECT 语句有效
	function num_rows($query_id = "") {
		if ($query_id == "") $query_id = $this->query_id;
		return mysqli_num_rows($query_id);
	}
	//返回上一个 MySQL 操作中的错误信息的数字编码
	function get_errno() {
		$this->errno = mysqli_errno($this->connection_id);
		return $this->errno;
	}
	//取得上一步 INSERT 操作产生的 ID
	function insert_id() {
		return mysqli_insert_id($this->connection_id);
	}
	//得到查询次数
	function query_count() {
		return $this->query_count;
	}
	//释放结果内存
	function free_result($query_id = "") {
		if ($query_id == "") $query_id = $this->query_id;
		mysqli_free_result($query_id);
	}
	//关闭 MySQL 连接
	function close_db() {
		if ($this->connection_id) return mysqli_close($this->connection_id);
	}
	//列出 MySQL 数据库中的表
	function get_table_names() {
		global $_DB;
        $listdbtables = array_column($this->query('SHOW TABLES')->fetch_all(),0);
		return $listdbtables;
	}
	//从结果集中取得列信息并作为对象返回，取得所有字段
	function get_result_fields($query_id = "") {
		if ($query_id == "") $query_id = $this->query_id;
		while ($field = mysqli_fetch_field($query_id)) {
			$fields[] = $field;
		}
		return $fields;
	}
	//错误提示
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
		$rs	 = $this->query($sql);
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
		$rs	 = $this->query($sql);
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

	//新增加一条记录
	function row_insert($tbname, $row) {
		$tbname = $this->fix_tbname($tbname);
		$sql = $this->sql_insert($tbname, $row);
		return $this->query_unbuffered($sql);
	}
	//更新指定记录
	function row_update($tbname, $row, $where = "") {
		$tbname = $this->fix_tbname($tbname);
		$sql = $this->sql_update($tbname, $row, $where);
		return $this->query_unbuffered($sql);
	}
	//删除满足条件的记录
	function row_delete($tbname, $where) {
		$tbname = $this->fix_tbname($tbname);
		$sql = $this->sql_delete($tbname, $where);
		//echo($sql);
		return $this->query_unbuffered($sql);
	}
	//查询多条记录
	function row_select($tbname, $where = "", $limit = 0, $fields = "*", $orderby = "id DESC") {
		$tbname = $this->fix_tbname_cname($tbname);
		$sql = $this->sql_select($tbname, $where, $limit, $fields, $orderby);
		return $this->row_query($sql);
	}
	//查询一条记录
	function row_select_one($tbname, $where = "", $fields = "*", $orderby = "id") {
		$tbname = $this->fix_tbname_cname($tbname);
		$sql = $this->sql_select($tbname, $where, 1, $fields, $orderby);
		//echo($sql);
		return $this->row_query_one($sql);
	}

	//计数统计
	function row_count($tbname, $where = "") {
		$tbname = $this->fix_tbname_cname($tbname);
		$sql = "SELECT count(0) as row_sum FROM " . $tbname . " " . ($where ? " WHERE " . $where : "");
		$row = $this->row_query_one($sql);
		return $row['row_sum'];
	}

	//新建一个表
	function create_table($tbname, $columns) {
		$tbname = $this->fix_tbname($tbname);
		$sql = "CREATE TABLE " . $tbname . " (".$columns.")";
        return $this->query_unbuffered($sql);
	}


	//删除一个表
	function delete_table($tbname) {
		$tbname = $this->fix_tbname($tbname);
		$sql = "DROP TABLE " . $tbname . "";
        return $this->query_unbuffered($sql);
	}

}
