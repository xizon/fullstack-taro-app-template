<?php
include dirname(__FILE__) . '/includes/_inc.php';

// Taro.login获得的用户登录凭证-code（有效期五分钟）。
// 开发者需要在开发者服务器后台调用 auth.code2Session，使用 code 换取 openid 和 session_key 等信息
$code = null;


if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {

    $postdata = json_decode(file_get_contents('php://input'));
    $code = sanitize_forminfo($postdata->code);

} else {
    die();
}
   

// 获取openid等信息
$url = 'https://api.weixin.qq.com/sns/jscode2session';
$data = array(
    'appid' => 'wxxxxxxxxxxxxxxxxxxx', // 修改成自己小程序的appid
    'secret' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',  // 修改成自己小程序的密钥
    'grant_type' => 'authorization_code',
    'js_code' => $code 
);


$url = $url . '?' . http_build_query($data);


$result = file_get_contents($url);
if ($result === FALSE) {
    $RESTful_res = json_encode( array(
        "error" => "Page Not Found", 
        "code" => 1001
    ) );
}


//----------------------------------
$RESTful_res = array(
    "data" => json_decode($result, true)
);


//----------------------------------
echo json_encode($RESTful_res);
