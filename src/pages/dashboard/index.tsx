import React, { Component, PropsWithChildren } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import apiUrls from '@/config/apiUrls';

import './index.scss';

import imgAvatar from '@/assets/images/avatar.png';


type PageState = {
    userAuthInfo?: any | null;
    hasUserAuthInfo?: boolean;
    loginStatus?: string | null;
};

export default class Index extends Component<PropsWithChildren, PageState> {

    constructor(props) {
        super(props);
        this.state = {
            userAuthInfo: null,
            hasUserAuthInfo: false,
            loginStatus: null
        }

        this.getUserAuthInfo = this.getUserAuthInfo.bind( this ); //绑定后才能找到正确的this对象
    }


    sysInfo: any = Taro.getSystemInfoSync();  // 获取调试环境的信息

     
    getUserAuthInfo() {

        const self = this;


        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
         /* +++++ 使用H5 或者 小程序开发者工具测试  start ++++++  */
         /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
         if (process.env.NODE_ENV === 'development' || this.sysInfo.platform === 'devtools') {
            self.setState({
                
                userAuthInfo: 
                // res.userInfo 的返回值格式
                {
                    nickName: '用户昵称007',
                    gender: 1,
                    language: 'zh-CN',
                    city: '成都',
                    province: '四川',
                    country: '中国',
                    avatarUrl: imgAvatar
                },   
                hasUserAuthInfo: true
            });
        }
        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
         /* +++++++ 使用H5 或者 小程序开发者工具测试  end +++++++ */
         /* ++++++++++++++++++++++++++++++++++++++++++++++++  */


        // 注意：getUserProfile 只能由用户 TAP 手势调用
        Taro.getUserProfile({
            desc: '获取你的昵称、头像、地区及性别', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {

                Taro.showToast({
                    title: '已正确授权获取用户资料',
                    icon: 'success',
                    duration: 2000,
                    success: () => {

                        self.setState({
                            userAuthInfo: res.userInfo,
                            hasUserAuthInfo: true
                        });

                    }
                });

            },
            fail: (res) => {
  
                Taro.showToast({
                    title: '无法获取用户资料',
                    icon: 'error',
                    duration: 2000
                });

                return;
            }
        });

    }

    
    componentWillMount() {

        const self = this;



        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
         /* +++++++++++++++ 使用H5测试  start +++++++++++++++  */
         /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
        if (process.env.NODE_ENV === 'development') {
            self.setState({ loginStatus: '用户已登录小程序后台(H5测试)' });

            Taro.setStorage({
                key: 'DATA_SESSION_LOGGED',
                data: 1
            });

        }
        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
         /* ++++++++++++++++ 使用H5测试  end ++++++++++++++++  */
         /* ++++++++++++++++++++++++++++++++++++++++++++++++  */


        // 检查登录态是否过期
        Taro.checkSession({
            success() {
                console.log('用户已经登录');
                self.setState({ loginStatus: '用户已登录小程序后台(开发者工具测试,checkSession未过期的状态)' });

                return Taro.getStorage({ key: 'DATA_SESSION_LOGGED' })
            },
            fail() {


                // 检查用户是否已经登录到后台服务器，已经登录的标志，数据库中存在 OPENID
                // Taro.login 用于调用接口获取登录凭证（code）。通过凭证进而换取用户登录态信息，
                // 包括用户的唯一标识（openid）及本次登录的会话密钥（session_key）等。
                // 通过 Taro.login 接口获得的用户登录态拥有一定的时效性, 登录态过期后开发者可以再调用 Taro.login
                Taro.login({
                    success: function (res) {

                        // 请注意如果没有使用申请的测试AppID，调用 Taro.login 是受限的, API 的返回是工具的模拟返回
                        // {errMsg: "login:ok", code: "the code is a mock one"}
                        console.log("Taro.login() result: ", res);  

                        if (res.code) {

                            // 小程序里没有FormData类，所以POST方法如果要传multipart/form-data就会报错
                            // payload是一种以JSON格式进行数据传输的一种方式，默认采用这种方式
                            Taro.request({
                                url: apiUrls.LOGIN_REQUEST,
                                method: 'POST',
                                data: {
                                    action: 'login_check',
                                    user_name: 'admin',
                                    user_password: 'admin',

                                    //得到登录用户的临时 code (小程序返回，通常请只需要传入它即可，其他字段根据业务需求决定)
                                    code: res.code

                                },
                                header: {},
                                success: function (res: any) {

                                    if ( res.statusCode !== 200 ) {
                                        Taro.showToast({
                                            title: '发生错误，请重试！',
                                            icon: 'error',
                                            duration: 2000
                                        });
                                        return;      
                                    }

                                    //++++++++++++++++++登录成功  start++++++++++++++++
                                    Taro.setStorage({
                                        key: 'DATA_SESSION_LOGGED',
                                        data: 1
                                    })

                                    //
                                    self.setState({ loginStatus: '用户已登录小程序后台(开发者工具测试,运行Taro.login()后的状态)' });

                                    //++++++++++++++++++登录成功  end++++++++++++++++


                                },
                                fail: function (res: any) { }

                            });

                        } else {
                            console.log('登录失败！' + res.errMsg);
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
                        this.state.loginStatus ? `登录状态: ${this.state.loginStatus}` : null
                    }</Text>
                    <View>
                        <Button className='btn-max-w' type='primary' onClick={this.getUserAuthInfo}>授权获取头像和姓名</Button>
                        { this.state.hasUserAuthInfo ? <View>
                            <Image style={{width: '100px', height: '100px'}} src={this.state.userAuthInfo.avatarUrl}></Image>
                            <Text>{this.state.userAuthInfo.nickName}</Text>   
                        </View> : null }

                    </View>

                </View>
                
                

            </View>
        )
    }
}
