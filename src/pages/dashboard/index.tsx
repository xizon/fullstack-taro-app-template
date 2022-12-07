import React, { Component, PropsWithChildren } from 'react';
import Taro from '@tarojs/taro';
import { Button } from '@tarojs/components';
import apiUrls from '@/config/apiUrls';
import CustomButton from '@/components/Buttons';

import './index.scss';

import imgAvatar from '@/assets/images/avatar.png';


type PageState = {
    userAuthInfo?: any | null;
};

export default class Index extends Component<PropsWithChildren, PageState> {

    constructor(props) {
        super(props);
        this.state = {
            userAuthInfo: null
        }

        this.getUserAuthInfo = this.getUserAuthInfo.bind(this);
        this.databaseForUserInfo = this.databaseForUserInfo.bind(this);
        this.getOpenID = this.getOpenID.bind(this);
    }


    sysInfo: any = Taro.getSystemInfoSync();  // 获取调试环境的信息


    getOpenID(callback: any = false) {

        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
        /* +++++++++++++++ 使用H5测试  start +++++++++++++++  */
        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
        if (process.env.NODE_ENV === 'development') {

            const res = {errMsg: 'ok', code: 'apptestopenid0001'}
            console.log("Taro.login() result: ", res);

            if (res.code) {
                //
                Taro.setStorage({
                    key: 'DATA_SESSION_LOGGED',
                    data: res.code
                });

                callback.call(null, res.code);

            } else {
                console.log('登录失败！' + res.errMsg);
            }

            return;
        }
        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
        /* +++++++ 使用H5 或者 小程序开发者工具测试  end +++++++ */
        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */



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
                    //
                    Taro.setStorage({
                        key: 'DATA_SESSION_LOGGED',
                        data: res.code
                    });

                    callback.call(null, res.code);

                } else {
                    console.log('登录失败！' + res.errMsg);
                }
            }
        });
    }

    databaseForUserInfo(obj: any = false, openid: any = false, callback: any = false) {

        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
        /* +++++++++++++++ 使用H5测试  start +++++++++++++++  */
        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
        if (process.env.NODE_ENV === 'development') {

            let _data = obj !== false ? {
                //得到登录用户的临时 code (小程序返回，通常请只需要传入它即可，其他字段根据业务需求决定)
                code: openid,
                update: 1,

                //用户的其它资料，同步更新到数据库
                nickname: obj.nickName,
                gender: obj.gender,
                city: obj.city,
                province: obj.province,
                country: obj.country,
                avatar: obj.avatarUrl
            } : { code: openid, update: 0 };

            // 小程序里没有FormData类，所以POST方法如果要传multipart/form-data就会报错
            // payload是一种以JSON格式进行数据传输的一种方式，默认采用这种方式
            Taro.request({
                url: apiUrls.LOGIN_REQUEST,
                method: 'POST',
                data: _data,
                header: {},
                success: function (res: any) {

                    if (res.statusCode !== 200) {
                        callback.call(null, false);
                        return;
                    }

                    callback.call(null, res.data.data);
                },
                fail: function (res: any) {}

            });   

            return;
        }
        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
        /* +++++++ 使用H5 或者 小程序开发者工具测试  end +++++++ */
        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */


        Taro.cloud.callContainer({
            path: '/user.php', // 填入容器的访问路径
            method: 'POST',
            header: {
                "X-WX-SERVICE": "express-7bh9",
                "content-type": "application/json"
            },
            data: {
                //得到登录用户的临时 code (小程序返回，通常请只需要传入它即可，其他字段根据业务需求决定)
                code: openid,

                //用户的其它资料，同步更新到数据库
                nickname: obj.nickName,
                gender: obj.gender,
                city: obj.city,
                province: obj.province,
                country: obj.country,
                avatar: obj.avatarUrl

            },
        }).then(res => {

            if (res.statusCode !== 200) {
                callback.call(null, false);
                return;
            }

            callback.call(null, res.data.data);


        }).catch(err => {
            Taro.showLoading({ title: '后端服务重启中' });
            console.log(err);
        });



    }


    getUserAuthInfo() {
 
        const self = this;

        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
        /* +++++++++++++++ 使用H5测试  start +++++++++++++++  */
        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
        if (process.env.NODE_ENV === 'development') {

            //更新最新的用户数据
            const _userInfo = {
                nickName: '用户昵称0001',
                gender: 1,
                city: '成都',
                province: '四川',
                country: '中国',
                avatarUrl: imgAvatar
            };

            //更新最新的用户数据
            Taro.setStorage({
                key: 'DATA_SESSION_USERINFO',
                data: _userInfo
            });

            // 保存 OPENID, 并比对数据库用户是否存在
            self.getOpenID( function( id ) {

                self.databaseForUserInfo(_userInfo, id, function (response) {

                    console.log('getUserAuthInfo() response: ', response);
                    if (response !== false) {

                        self.setState({
                            userAuthInfo: _userInfo
                        });


                    }
                });
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
                    title: '授权成功 :)',
                    icon: 'success',
                    duration: 2000,
                    success: function () {

                    //更新最新的用户数据
                    const _userInfo = res.userInfo;
                    Taro.setStorage({
                        key: 'DATA_SESSION_USERINFO',
                        data: _userInfo
                    });

                    // 保存 OPENID, 并比对数据库用户是否存在
                    self.getOpenID( function( id ) {

                        self.databaseForUserInfo(_userInfo, id, function (response) {

                            if (response !== false) {

                                self.setState({
                                    userAuthInfo: _userInfo
                                });


                            }
                        });
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

            console.log('用户已经登录, 未过期的session_key');

            //直接获取数据库的用户数据
            Taro.getStorage({
                key: 'DATA_SESSION_LOGGED',
                success: function (res) {
                    const _openid = res.data;
                
                    self.databaseForUserInfo(false, _openid, function (response) {

                        console.log('componentWillMount() response: ', response);

                        if (response !== false) {
                            self.setState({
                                userAuthInfo: {
                                    nickName: response.userinfo.nickname,
                                    gender: response.userinfo.gender,
                                    city: response.userinfo.city,
                                    province: response.userinfo.province,
                                    country: response.userinfo.country,
                                    avatarUrl: response.userinfo.avatar
                                }
                            });
                        }
                    });
   
                    
                }
            });

            return;
        }
        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */
        /* ++++++++++++++++ 使用H5测试  end ++++++++++++++++  */
        /* ++++++++++++++++++++++++++++++++++++++++++++++++  */

        // 下面的参数配置请参考小程序云部署后的参考代码
        // 注意：不能使用测试的appid, 需要使用正式申请的小程序ID才能正确请求云部署的文件
        Taro.cloud.init({
            env: "prod-xxxxxxxxxxxxxxxxx"
        });


        // 检查登录态是否过期
        Taro.checkSession({
            success(res) {
                console.log('用户已经登录, 未过期的session_key');

                //直接获取数据库的用户数据
                Taro.getStorage({
                    key: 'DATA_SESSION_LOGGED',
                    success: function (res) {

                        const _openid = res.data;

                        self.databaseForUserInfo(false, _openid, function (response) {

                            console.log('componentWillMount() response: ', response);
    
                            if (response !== false) {
                                self.setState({
                                    userAuthInfo: {
                                        nickName: response.userinfo.nickname,
                                        gender: response.userinfo.gender,
                                        city: response.userinfo.city,
                                        province: response.userinfo.province,
                                        country: response.userinfo.country,
                                        avatarUrl: response.userinfo.avatar
                                    }
                                });
    
                            }
                        });
       
                    }
                });

            },
            fail() {



            }
        })


    }

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() { }

    componentDidHide() { }

    render() {

        return (
            <div className="wrapper">

                <div className="page-title">我的</div>

                <div className="dashboard">
                
                    <div><CustomButton className='btn-max-w' plain type='primary' btnName='上传图片' href={`/pages/upload/index`} /></div>
                    <div>
                        {this.state.userAuthInfo ? <div>
                            <img style={{ width: '50px', height: '50px' }} src={this.state.userAuthInfo.avatarUrl} />
                            <p>{this.state.userAuthInfo.nickName}</p>
                        </div> : <div>
                            <Button className='btn-max-w app-btn-s1' type='primary' onClick={this.getUserAuthInfo}>授权获取头像和姓名</Button>
                        </div>} 

                    </div>
                    

                </div>
                
            </div>
        )
    }
}
