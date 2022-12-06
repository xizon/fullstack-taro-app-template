import React, { Component, PropsWithChildren } from 'react';
import Taro from '@tarojs/taro';
import { ScrollView } from '@tarojs/components';

import './index.scss';

type PageState = {
    loading?: boolean;
    list?: any[] | null;
    page: number;
};

export default class Index extends Component<PropsWithChildren, PageState> {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            list: [],
            page: 1
        }
    }

    linkTo = (e, url) => {
        e.preventDefault();
        Taro.navigateTo({ url: url });
    }


    displayData(res, nextpage) {
        console.log('php data: ', res);

        Taro.hideLoading();

        if (res.statusCode !== 200) {
            this.setState({
                loading: false,
                list: []
            });
            return;
        }

        if ( nextpage > res.data.total_pages ) return;
        if ( res.data.error ) return;
        


        //分页代码
        this.setState((prevState: any) => ({
            list: prevState.list.concat(res.data.data),
            page: nextpage,
            loading: false
        }));

    }

    // getList = () => { ... }
    getList(nextpage = 1) {
        const self = this;
        Taro.showLoading({ title: '加载中' })



        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
         /* +++++++++++++++ 使用H5测试  start +++++++++++++++  */
         /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
         if (process.env.NODE_ENV === 'development') {

            Taro.request({
                url: 'http://127.0.0.1:8888/fullstack-taro-app-template/cloud-hosting/miniprogram-deploy-package/index.php?page=' + nextpage, // 填入容器的访问路径
                method: 'GET',
                success: function (res: any) {
                    self.displayData(res, nextpage);
                }

            });

            return;
         }
        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
         /* ++++++++++++++++ 使用H5测试  end ++++++++++++++++  */
         /* ++++++++++++++++++++++++++++++++++++++++++++++++  */        


        Taro.cloud.callContainer({
            path: '/?page=' + nextpage, // 填入容器的访问路径
            method: 'GET',
            header: {
                "X-WX-SERVICE": "express-7bh9",
                "content-type": "application/json"
            },
            data: ""
        }).then(res => {
            self.displayData(res, nextpage);
    

        }).catch(err => {
            Taro.showLoading({ title: '后端服务正在启动中，请稍后重试' });
            console.log(err);
        });


    }


    onScroll(e) {
        //console.log(e.detail);   // {scrollLeft: 0, scrollTop: 66, scrollHeight: 11544, scrollWidth: 375}, ...
    }


    componentWillMount() {


        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
         /* +++++++++++++++ 使用H5测试  start +++++++++++++++  */
         /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
         if (process.env.NODE_ENV === 'development') return;
        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
         /* ++++++++++++++++ 使用H5测试  end ++++++++++++++++  */
         /* ++++++++++++++++++++++++++++++++++++++++++++++++  */



        // 下面的参数配置请参考小程序云部署后的参考代码
        // 注意：不能使用测试的appid, 需要使用正式申请的小程序ID才能正确请求云部署的文件
        Taro.cloud.init({
            env: "prod-xxxxxxxxxx"
        });


    }

    componentDidMount() {

        //初始化远程数据
        this.getList(1);
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        return (
            <div className="wrapper">

                <div className="page-title">文章列表</div>

                <ScrollView className="scrollview"
                    scrollY
                    scrollWithAnimation
                    scrollTop={0}
                    lowerThreshold={20}
                    upperThreshold={20}
                    onScrollToLower={this.getList.bind(this, this.state.page+1)} // 滚动到底部触发，箭头函数写法 `onScrollToLower={this.getList(this.state.page+1)}`
                    onScroll={this.onScroll}
                >

                    {
                        this.state.loading ? <div>Loading...</div> : this.state.list ? this.state.list.map((post, key) => {
                            return (
                                <div className="item" key={key}>
                                    <div><img className="img" src={post.avatar} /></div>
                                    <p>{post.name}  - (email: {post.email})</p>
                                    <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p>
                                </div>
                                
                            )
                        }) : null
                    }
                </ScrollView>


            </div>
        )
    }
}