<?php
include dirname(__FILE__) . '/includes/_inc.php';


$id = null;


if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {

    $postdata = json_decode(file_get_contents('php://input'));

    $id = sanitize_forminfo($postdata->code);
    $update = sanitize_int($postdata->update); // 0:查询 1:更新
    

    //用户信息(和小程序授权的一致)
    $_data_user_favors = sanitize_forminfo($postdata->favors);

    $userinfo = array(
        "favors" => html_decode($_data_user_favors)
    );


} else {
    die();
}
   

//判断用户存在性
//------------------------------
$b_user = $sql_db->row_select_one("users_app","open_id = '{$id}'","*");
$username = $b_user['login'];

if ( !is_null($username) ) {

    if ( $update == 1 ) { 
        //更新信息
        $b_user['intro'] = $userinfo['favors'];
        $sql_db->row_update("users_app", $b_user, "open_id = '{$id}'"); 
    } else {
        //获取信息
        $userinfo = array(
            "favors" => $b_user['intro']
        );
    }

}


//----------------------------------
$RESTful_res = array(
    "data" => array(
        "open_id" => $id,
        "username" => $username,
        "code" => 200,
        "userinfo" => $userinfo
    )
);


//----------------------------------
echo json_encode($RESTful_res);
