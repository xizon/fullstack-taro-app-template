import React, { Component, PropsWithChildren } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import apiUrls from '@/config/apiUrls';

import './index.scss';

type PageState = {
    userdata?: any | null;
};

export default class Index extends Component<PropsWithChildren, PageState> {

    constructor(props) {
        super(props);
        this.state = {
            userdata: null
        }
    }
    
    componentWillMount() {

        const self = this;

        // 使用H5测试
        if (process.env.NODE_ENV === 'development') {
            self.setState({ userdata: {username: 'David', age: '19'} });
        }

        //
        Taro.checkSession({
            success() {
                return Taro.getStorage({ key: 'DATA_SESSION_LOGGED' })
            },
            fail() {

                Taro.login({
                    success: function (res) {
                        if (res.code) {

                            // 小程序里没有FormData类，所以POST方法如果要传multipart/form-data就会报错
                            // payload是一种以JSON格式进行数据传输的一种方式，默认采用这种方式
                            Taro.request({
                                url: apiUrls.LOGIN_REQUEST,
                                method: 'POST',
                                data: {
                                    action: 'login_check',
                                    user_name: 'admin',
                                    user_password: 'admin'
                                },
                                header: {},
                                success: function (res: any) {

                                    //++++++++++++++++++登录成功   start++++++++++++++++
                                    if ( res.statusCode !== 200 ) {
                                        Taro.showToast({
                                            title: '发生错误，请重试！',
                                            icon: 'none'
                                        });
                                        return;      
                                    }

                                    Taro.setStorage({
                                        key: 'DATA_SESSION_LOGGED',
                                        data: res.data['DATA_SESSION_LOGGED']
                                    })

                                    console.log("login result: ", res);
                                    /*
                                    使用小程序开发工具可以返回如下数值: 
                                    请注意游客模式下，调用 wx.operateWXData 是受限的, API 的返回是工具的模拟返回
                                    开发工具模拟的返回数据：
                                    {
                                        cookies: ["PHPSESSID=j1p6ckst5i25jj2vvpncokd1jc; path=/"],
                                        data: {code: 401, error: "Unauthorized"},
                                        header: {
                                            Access-Control-Allow-Headers: "Content-Type",
                                            Access-Control-Allow-Origin: "*",
                                            ...
                                        },
                                        statusCode: 200,
                                        errMsg: "request:ok"
                                    }
                                    */

                                    //
                                    self.setState({ userdata: {username: 'Smith', age: '22'} });

                                    //++++++++++++++++++登录成功   end++++++++++++++++


                                }
                            });

                        } else {
                            console.log('登录失败！' + res.errMsg)
                        }
                    }
                });

            }
        })


    }

    componentDidMount() {

    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        return (
            <View className="wrapper">

                <View className="page-title">我的</View>

                <View className="dashboard">
                <Text>{
                    this.state.userdata ? `用户名:${this.state.userdata.username} (${this.state.userdata.age}岁)` : null
                }</Text>
                </View>
                
                

            </View>
        )
    }
}
