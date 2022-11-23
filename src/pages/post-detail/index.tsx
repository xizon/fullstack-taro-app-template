import React, { Component, PropsWithChildren } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import Button from '@/components/Buttons';
import './index.scss';
import apiUrls from '@/config/apiUrls';


type PageState = {
    loading?: boolean;
    detail?: any | null;
};

export default class Index extends Component<PropsWithChildren, PageState> {

   
    pageInstance: any = Taro.getCurrentInstance();  // 获取小程序的 app、page 对象、路由参数等数据
    pages: any[] = Taro.getCurrentPages(); // 获取当前的页面栈
    prevPagePath: string = this.pages.at(0).route; //  获取上一页面(不要使用path属性,小程序中可能不存在此属性)
    prevPagePathAbsolutePath: string = this.prevPagePath.charAt(0) == "/" ? `/${this.prevPagePath.substring(1)}` : `/${this.prevPagePath}`; // 使用绝对路径，导出小程序后第一个斜杠会被去掉


    //获取页面参数
    postname: any = this.pageInstance.router.params.name;

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            detail: null
        }
    }

    getDetail() {   
        const self = this;
        this.setState({ loading: true });
        Taro.showLoading({ title: '加载中' })

        Taro.request({
            url: apiUrls.RECEIVE_DEMO_LISTDETAIL.replace('{id}', encodeURIComponent(this.postname)),
            method: 'GET',
            header: {},
            success: function (res) {

                Taro.hideLoading();

                console.log(res);

                if ( res.statusCode !== 200 ) {
                    self.setState({
                        loading: false,
                        detail: {"name": "null", "flag": "null", "region": "null"}
                    });
                    return;      
                }

                self.setState({
                    loading: false,
                    detail: res.data[0]
                });

            }
        });

    }



    componentWillMount() { }

    componentDidMount() {

        console.log('pageInstance: ', this.pageInstance);
        console.log('pages: ', this.pages);
        
        //初始化远程数据
        this.getDetail();
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        return (
            <View className="wrapper">

                <View className="page-title"></View>
                <View className="detail">

                   {
                        this.state.loading ? <View>Loading...</View> : this.state.detail ? (
                            <View>
                                <View className="page-title">{this.state.detail.name}</View>
                                <View><Image src={this.state.detail.flag}></Image></View>
                                <Text>{this.state.detail.name}  - (region: {this.state.detail.region})</Text>
                                <View><Button className='btn-max-w' plain type='primary' btnName='返回上一页' href={`${this.prevPagePathAbsolutePath}`} /></View>
                                <Text className="page-small">(注：小程序不能直接跳转到底部菜单栏)</Text>
                            </View>
                        ) : null
                    }    
                </View>

            </View>
        )
    }
}
