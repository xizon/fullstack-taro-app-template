export default defineAppConfig({
    lazyCodeLoading: "requiredComponents",
    pages: [
        'pages/index/index',
        'pages/posts/index',
        'pages/post-detail/index',
        'pages/counter/index',
        'pages/dashboard/index',
        'pages/upload/index',
        'pages/canvas/index'
    ],
    window: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#822dee',
        navigationBarTitleText: 'Full-Stack Taro Application Template',
        navigationBarTextStyle: 'white',
        enablePullDownRefresh: true
    },
    tabBar: {
        color: "#333333",
        selectedColor: "#000000",
        backgroundColor: "#FBFBFB",
        borderStyle: "white",
        list: [
            {
                pagePath: "pages/index/index",
                text: "首页",
                iconPath: "./assets/images/icon1.png",
                selectedIconPath: "./assets/images/icon1-active.png"
            }, 
            {
                pagePath: "pages/posts/index",
                text: "文章列表",
                iconPath: "./assets/images/icon2.png",
                selectedIconPath: "./assets/images/icon2-active.png"
            },
            {
                pagePath: "pages/counter/index",
                text: "计数器",
                iconPath: "./assets/images/icon4.png",
                selectedIconPath: "./assets/images/icon4-active.png"
            },
            {
                pagePath: "pages/dashboard/index",
                text: "我的",
                iconPath: "./assets/images/icon3.png",
                selectedIconPath: "./assets/images/icon3-active.png"
            },
            {
                pagePath: "pages/canvas/index",
                text: "Canvas",
                iconPath: "./assets/images/icon6.png",
                selectedIconPath: "./assets/images/icon6-active.png"
            }
        ]
    }
})
