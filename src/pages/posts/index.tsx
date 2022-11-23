import React, { Component, PropsWithChildren } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import apiUrls from '@/config/apiUrls';

import './index.scss';

type PageState = {
    loading?: boolean;
    list?: any[] | null;
};

export default class Index extends Component<PropsWithChildren, PageState> {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            list: []
        }
    }

    linkTo = (e, url) => {
        e.preventDefault();
        Taro.navigateTo({ url: url });
    }

    // getList = () => { ... }
    getList( nextpage = false ) {   
        const self = this;
        this.setState({ loading: true });
        Taro.showLoading({ title: '加载中' })

        Taro.request({
            url: apiUrls.RECEIVE_DEMO_LIST,
            method: 'GET',
            header: {},
            success: function (res) {

                Taro.hideLoading();

                console.log(res);

                if ( res.statusCode !== 200 ) {
                    self.setState({
                        loading: false,
                        list: []
                    });
                    return;      
                }

                self.setState({
                    loading: false,
                    list: res.data
                });

                //分页的一些业务代码，如：
                /*
                if ( nextpage ) {
                    self.setState((prevState: any) => ({
                        list: prevState.list.concat(res.data),
                        loading: false
                    }));
                }
                */

            }
        });

    }


    onScroll(e) {
        //console.log(e.detail);   // {scrollLeft: 0, scrollTop: 66, scrollHeight: 11544, scrollWidth: 375}, ...
    }


    componentWillMount() { }

    componentDidMount() {

        //初始化远程数据
        this.getList();
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        return (
            <View className="wrapper">

                <View className="page-title">文章列表</View>

                <ScrollView className="scrollview"
                    scrollY
                    scrollWithAnimation
                    scrollTop={0}
                    lowerThreshold={20}
                    upperThreshold={20}
                    onScrollToUpper={this.getList.bind(this, false)} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.getList(false)}`
                    onScroll={this.onScroll}
                >

                    {
                        this.state.loading ? <View>Loading...</View> : this.state.list ? this.state.list.map((post, key) => {
                            return (
                                <View className="item" key={key} onClick={(e) => this.linkTo(e, '/pages/post-detail/index?name=' + post.name)}>
                                    <View><Image className="img" src={post.flag}></Image></View>
                                    <Text>{post.name}  - (region: {post.region})</Text>
                                </View>
                            )
                        }) : null
                    }
                </ScrollView>


            </View>
        )
    }
}
