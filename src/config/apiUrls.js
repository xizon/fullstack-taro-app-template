const config = {

	/*
	 TYPE: Posts
	 ------------------------------------------
	*/
	"RECEIVE_LIST": "https://restcountries.com/v2/all",
	"RECEIVE_LISTDETAIL": "https://restcountries.com/v2/name/{id}",


	/*
	 TYPE: Posts (pagination)
	 ------------------------------------------
	*/
    "RECEIVE_LIST_PAGINATION": "http://127.0.0.1:8888/fullstack-taro-app-template/cloud-hosting/miniprogram-deploy-package/posts-demo.php?page={page}",

    /*
    TYPE: User
    ------------------------------------------
    */
    "LOGIN_REQUEST": "http://127.0.0.1:8888/fullstack-taro-app-template/cloud-hosting/miniprogram-deploy-package/user.php",

    /*
    TYPE: User operations
    ------------------------------------------
    */
    "USER_FAV": "http://127.0.0.1:8888/fullstack-taro-app-template/cloud-hosting/miniprogram-deploy-package/user-fav.php"

};

// node & browser
module.exports = config;
