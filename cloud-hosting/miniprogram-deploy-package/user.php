<?php
include dirname(__FILE__) . '/includes/_inc.php';


$id = null;


if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {

    $postdata = json_decode(file_get_contents('php://input'));

    $id = sanitize_forminfo($postdata->code);
    $update = sanitize_int($postdata->update); // 0:查询 1:更新
    

    //用户信息(和小程序授权的一致)
    $_data_user_nickname = sanitize_forminfo($postdata->nickname);
    $_data_user_gender = sanitize_int($postdata->gender);
    $_data_user_city = sanitize_forminfo($postdata->city);
    $_data_user_province =sanitize_forminfo($postdata->province);
    $_data_user_country = sanitize_forminfo($postdata->country);
    $_data_user_avatar = sanitize_forminfo($postdata->avatar);

    $userinfo = array(
        "nickname" => $_data_user_nickname,
        "gender" => $_data_user_gender,
        "city" => $_data_user_city,
        "province" => $_data_user_province,
        "country" => $_data_user_country,
        "avatar" => $_data_user_avatar
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
        $b_user['nickname'] = $userinfo['nickname'];
        $b_user['gender'] = $userinfo['gender'];
        $b_user['address'] = '{"city":"'.$userinfo['city'].'", "province":"'.$userinfo['province'].'", "country":"'.$userinfo['country'].'"}';
        $b_user['avatar'] = $userinfo['avatar'];
        $sql_db->row_update("users_app", $b_user, "open_id = '{$id}'"); 
    } else {
        //获取信息
        
        $address = json_decode($b_user['address']);
     
        $userinfo = array(
            "nickname" => $b_user['nickname'],
            "gender" => $b_user['gender'],
            "city" => $address->city,
            "province" => $address->province,
            "country" => $address->country,
            "avatar" => $b_user['avatar'],
        );

    }


} else {
    //新用户
    $username = uniqid();
    $b_user['open_id'] = $id;
    $b_user['login'] = $username;
    $b_user['reg_date'] = date('Y/m/d H:i:s', time());

    //
    $b_user['nickname'] = $userinfo['nickname'];
    $b_user['gender'] = $userinfo['gender'];
    $b_user['address'] = '{"city":"'.$userinfo['city'].'", "province":"'.$userinfo['province'].'", "country":"'.$userinfo['country'].'"}';
    $b_user['avatar'] = $userinfo['avatar'];  
    $sql_db->row_insert("users_app", $b_user);
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
