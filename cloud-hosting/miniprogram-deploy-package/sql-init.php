<?php
include dirname(__FILE__) . '/includes/_inc.php';

/* //////////////////////////////////////////
 *  如果要测试授权用户的相关功能，请先运行此文件
 * //////////////////////////////////////////
 */

// Create a new table
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
