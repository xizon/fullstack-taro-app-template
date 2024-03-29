const config = {
	"env": "prod-xxxxxxxxxxxxxxxxx",
    "callContainerHeader": {
        "X-WX-SERVICE": "express-7bh9",
        "content-type": "application/json"
    },


	/*
	 TYPE: Posts (pagination)
	 ------------------------------------------
	*/
    "RECEIVE_LIST_PAGINATION": "/posts-demo.php?page={page}",

    /*
    TYPE: User
    ------------------------------------------
    */
    "LOGIN_REQUEST": "/user.php",
    "OPENID_REQUEST": "/user-identity.php",


    /*
    TYPE: User operations
    ------------------------------------------
    */
    "USER_FAV": "/user-fav.php"

};

// node & browser
module.exports = config;
