import React, { Component, PropsWithChildren } from 'react';
import Taro from '@tarojs/taro';
import { Button } from '@tarojs/components';
import apiUrls from '@/config/apiUrls';
import cloudConfig from '@/config/cloudConfig';

import CustomButton from '@/components/Buttons';
import { AtModal } from "taro-ui";

import './index.scss';

import imgAvatar from '@/assets/images/avatar.png';


type PageState = {
    userAuthInfo?: any | null;
    logoutModalOpen?: boolean;
};

export default class Index extends Component<PropsWithChildren, PageState> {

    constructor(props) {
        super(props);
        this.state = {
            userAuthInfo: null,
            logoutModalOpen: false
        }

        this.getUserAuthInfo = this.getUserAuthInfo.bind(this);
        this.databaseForUserInfo = this.databaseForUserInfo.bind(this);
        this.getOpenID = this.getOpenID.bind(this);
        this.logoutConfirm = this.logoutConfirm.bind(this);
        this.logout = this.logout.bind(this);
    }


    sysInfo: any = Taro.getSystemInfoSync();  // 获取调试环境的信息


    logoutConfirm() {
        this.setState({
            logoutModalOpen: true
        });
    }

    logout() {
        this.setState({
            userAuthInfo: null,
            logoutModalOpen: false
        });

        Taro.removeStorageSync('DATA_SESSION_LOGGED');
        Taro.removeStorageSync('DATA_SESSION_USERINFO');

        //跳转页面
        Taro.redirectTo({ url: "/pages/index/index" });
    }

    getOpenID(userInfo: any = false, callback: any = false) {

        const self = this;

        //更新最新的用户数据
        if (userInfo !== false) {
            Taro.setStorage({
                key: 'DATA_SESSION_USERINFO',
                data: userInfo
            });

        }


        /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
         * # 使用H5测试  start   
         * 注意：
         * 1) 请修改 cloud-hosting/miniprogram-deploy-package/includes/conn.php 数据库配置
         * 2) 请检查请求的测试地址 (外网URL或者localhost是否通畅)
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  */
        if (process.env.NODE_ENV === 'development') {

            console.log("Taro.login() ok");

            const _openid = 'openi-test-0001';
    
            //
            Taro.setStorage({
                key: 'DATA_SESSION_LOGGED',
                data: _openid
            });

            callback.call(null, _openid);

            return;
        }
        /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
         * # 使用H5测试  end   
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  */



        // 检查用户是否已经登录到后台服务器，已经登录的标志，数据库中存在 OPENID
        // Taro.login 用于调用接口获取登录凭证（code）。通过凭证进而换取用户登录态信息，
        // 包括用户的唯一标识（openid）及本次登录的会话密钥（session_key）等。
        // 通过 Taro.login 接口获得的用户登录态拥有一定的时效性, 登录态过期后开发者可以再调用 Taro.login
        Taro.login({
            success: function (res) {

                // 请注意如果没有使用申请的测试AppID，调用 Taro.login 是受限的, API 的返回是工具的模拟返回
                // {errMsg: "login:ok", code: "the code is a mock one"}
                console.log("Taro.login() ok");


                if (res.code) {

                    // 通过5分钟有效期的登录凭证获取用户的openid
                    Taro.cloud.callContainer({
                        path: cloudConfig.OPENID_REQUEST,
                        method: 'POST',
                        header: cloudConfig.callContainerHeader,
                        data: {code: res.code},
                    }).then(res => {
            
                        if (res.statusCode !== 200) {
                            callback.call(null, false);
                            return;
                        }
            
                        //保存openid
                        const _openid = res.data.data.openid;
                        Taro.setStorage({
                            key: 'DATA_SESSION_LOGGED',
                            data: _openid
                        });

                        callback.call(null, _openid);
            
            
                    }).catch(err => {
                        Taro.showLoading({ title: '后端服务重启中' });
                        console.log(err);
                    });



                } else {
                    console.log('登录失败！' + res.errMsg);
                }
            }
        });
    }

    databaseForUserInfo(obj: any = false, openid: any = false, callback: any = false) {

        const _data = obj !== false ? {
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


        /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
         * # 使用H5测试  start   
         * 注意：
         * 1) 请修改 cloud-hosting/miniprogram-deploy-package/includes/conn.php 数据库配置
         * 2) 请检查请求的测试地址 (外网URL或者localhost是否通畅)
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  */
        if (process.env.NODE_ENV === 'development') {

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
                fail: function (res: any) { }

            });

            return;
        }

        /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
         * # 使用H5测试  end   
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  */

        Taro.cloud.callContainer({
            path: cloudConfig.LOGIN_REQUEST,
            method: 'POST',
            header: cloudConfig.callContainerHeader,
            data: _data,
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


        /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
         * # 使用H5测试  start   
         * 注意：
         * 1) 请修改 cloud-hosting/miniprogram-deploy-package/includes/conn.php 数据库配置
         * 2) 请检查请求的测试地址 (外网URL或者localhost是否通畅)
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  */
        if (process.env.NODE_ENV === 'development') {

            //用户数据
            const _userInfo = {
                nickName: '用户昵称0003',
                gender: 1,
                city: '成都',
                province: '四川',
                country: '中国',
                avatarUrl: imgAvatar
            };

            // 保存 OPENID, 并比对数据库用户是否存在
            self.getOpenID(_userInfo, function (id) {

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
        /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
         * # 使用H5测试  end   
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  */



        // 注意：getUserProfile 只能由用户 TAP 手势调用
        Taro.getUserProfile({
            desc: '获取您的昵称和头像', // getUserProfile接口已经被收回，只返回灰色头像和固定名称
            success: (res) => {

                Taro.showToast({
                    title: '授权成功 :)',
                    icon: 'success',
                    duration: 2000,
                    success: function () {

                        //用户数据
                        const _userInfo = res.userInfo;

                        // 保存 OPENID, 并比对数据库用户是否存在
                        self.getOpenID(_userInfo, function (id) {

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


    // 组件初次加载和小程序页面切换时触发
    // 用于 `componentWillMount()` 和 `componentDidShow()`
    pageSwitchFun() {

        //通常用来更新用户的其它信息，比如收藏的项目，用户的动态等等
        console.log('pageSwitchFun()');

    }

    componentWillMount() {
        this.pageSwitchFun();

        const self = this;

        /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
         * # 使用H5测试  start   
         * 注意：
         * 1) 请修改 cloud-hosting/miniprogram-deploy-package/includes/conn.php 数据库配置
         * 2) 请检查请求的测试地址 (外网URL或者localhost是否通畅)
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  */
        if (process.env.NODE_ENV === 'development') {

            console.log('用户已经登录, 未过期的session_key');

            //直接获取数据库的用户数据
            Taro.getStorage({
                key: 'DATA_SESSION_LOGGED',
                success: function (res) {
                    const _openid = res.data;

                    self.databaseForUserInfo(false, _openid, function (response) {

                        console.log('Taro.checkSession() response: ', response);

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


                },
                fail: function () {
                    console.log('session_key已经过期或者从未登录，重新登录(需要用户重新点击授权获取资料)');

                    self.setState({
                        userAuthInfo: null
                    });

                }
            });

            return;
        }

        /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
         * # 使用H5测试  end   
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  */



        // 下面的参数配置请参考小程序云部署后的参考代码
        // 注意：不能使用测试的appid, 需要使用正式申请的小程序ID才能正确请求云部署的文件
        Taro.cloud.init({
            env: cloudConfig.env
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

                            console.log('Taro.checkSession() response: ', response);

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

                console.log('session_key已经过期或者从未登录，重新登录(需要用户重新点击授权获取资料)');

                self.setState({
                    userAuthInfo: null
                });

            }
        });


    }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() {
        this.pageSwitchFun();
    }

    componentDidHide() { }

    render() {

        return (

            <div className="wrapper">

                <AtModal
                    isOpened={this.state.logoutModalOpen ? true : false}
                    title='退出'
                    cancelText='取消'
                    confirmText='确认'
                    onClose={() => this.setState({logoutModalOpen: false})}
                    onCancel={() => this.setState({logoutModalOpen: false})}
                    onConfirm={this.logout}
                    content='退出后将删除用户授权信息，下次重新授权后可恢复收藏条目'
                />

                <div className="page-title">我的 {this.state.userAuthInfo ? <small style={{ color: 'gray', fontSize: '.7em' }} onClick={this.logout}>退出</small> : null}</div>

                { !this.state.userAuthInfo ? <div className="page-desc"><div className="at-article__info">登录已过期或者未登录过应用，需要重新授权！</div></div> : null}

                <div className="dashboard">

                    <div><CustomButton className='btn-max-w' plain type='primary' btnName='上传图片' href={`/pages/upload/index`} /></div>
                    <div>

                        {this.state.userAuthInfo ? <div className="userarea">
                            <img className="userarea__avatar" src={this.state.userAuthInfo.avatarUrl} />
                            <p className="userarea__name">{this.state.userAuthInfo.nickName}</p>
                        </div> : <div>
                            <Button className='btn-max-w app-btn-s1' type='primary' onClick={this.getUserAuthInfo}>授权获取用户头像和姓名</Button>
                        </div>}

                    </div>


                </div>

            </div>
        )
    }
}
