import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { add, remove } from '@/status/actions/favActions';
import { connect } from 'react-redux';

import fav from '@/assets/images/icon2.png';
import favOk from '@/assets/images/icon2-active.png';

import apiUrls from '@/config/apiUrls';
import cloudConfig from '@/config/cloudConfig';

import './index.scss';



// Subscribe to the required state in the reducers is bound here (for details of the data structure: initState)
// You can call it in `this.props`
const mapStateToProps = (state) => {
    const { favReducer } = state; //Receive redux

    console.log(state);
    /*
    {
        "favReducer": {
            "ids": []
        },
        "postsReducer": {
            "items": null
        }
    }
    */

    return {
        currentData: favReducer.ids
    }
};

// Bind the introduced Actions. You will normally make use of this by returning new functions that call `dispatch()` inside themselves
// You can call it in `this.props`
/*
Like this:
const mapDispatchToProps = (dispatch) => {
    return {
        increment: (id) => dispatch({ type: 'INCREMENT', id: id }),
        decrement: (id) => dispatch({ type: 'DECREMENT', id: id }),
    }
}
*/
const mapDispatchToProps = (dispatch) => {
    return {
        increment: (id) => dispatch(add(id)),
        decrement: (id) => dispatch(remove(id))
    }
}

/*
connect(
    mapStateToProps,
    mapDispatchToProps
)(Index);
*/

const myConnect: any = connect; // 由于直接使用@connect tslint会报错，所以重新赋值再使用装饰器写法


@myConnect(
    mapStateToProps,
    mapDispatchToProps
)
class Index extends Component<any, any>  {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            list: [
                {
                    "id": 1,
                    "name": "George"
                },
                {
                    "id": 2,
                    "name": "Janet"
                },
                {
                    "id": 3,
                    "name": "Emma"
                },
                {
                    "id": 4,
                    "name": "Eve"
                },
                {
                    "id": 5,
                    "name": "Charles"
                }
            ],
            logged: false,
            loggedTip: false,
            openid: false
        }

    }

    databaseForUserFav(obj: any = false, openid: any = false, callback: any = false) {


        const _data = obj !== false ? {
            //得到登录用户的临时 code (小程序返回，通常请只需要传入它即可，其他字段根据业务需求决定)
            code: openid,
            update: 1,

            //收藏
            favors: obj
        } : { code: openid, update: 0 };


        /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
         * # 使用H5测试  start   
         * 注意：
         * 1) 请修改 cloud-hosting/miniprogram-deploy-package/includes/conn.php 数据库配置
         * 2) 请检查请求的测试地址 (外网URL或者localhost是否通畅)
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  */
        if (process.env.NODE_ENV === 'development') {

            Taro.request({
                url: apiUrls.USER_FAV,
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
            path: cloudConfig.USER_FAV,
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


    // 组件初次加载和小程序页面切换时触发
    // 用于 `componentWillMount()` 和 `componentDidShow()`
    pageSwitchFun() {

        const self = this;
        
        //判断是否已经授权
        const value = Taro.getStorageSync('DATA_SESSION_LOGGED');
        if (value.length > 0) {
            self.setState({
                logged: true,
                openid: value
            });
        } else {
            self.setState({
                logged: false,
                loggedTip: false,
                openid: false
            });
        }


        //获取收藏的项目
        // Taro.getStorage()是异步的，所以可以保证Taro.cloud.init()优先执行，保证databaseForUserFav()正确执行云请求
        Taro.getStorage({
            key: 'DATA_SESSION_LOGGED',
            success: function (res) {
                const _openid = res.data;

                // 触发dispatch改变整体收藏状态
                self.databaseForUserFav(false, _openid, function (response) {

                    console.log('pageSwitchFun() response: ', response);
                    if (response !== false && response.userinfo.favors) {

                        const favored = JSON.parse(response.userinfo.favors);
                        favored.forEach(el => {
                            self.props.increment(el);
                        });

                    }
                });

            }
        });

    }

    componentWillMount() {
        this.pageSwitchFun();

        /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
         * # 使用H5测试  start   
         * 注意：
         * 1) 请修改 cloud-hosting/miniprogram-deploy-package/includes/conn.php 数据库配置
         * 2) 请检查请求的测试地址 (外网URL或者localhost是否通畅)
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  */

        if (process.env.NODE_ENV === 'development') return;

        /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
         * # 使用H5测试  end   
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  */


        // 下面的参数配置请参考小程序云部署后的参考代码
        // 注意：不能使用测试的appid, 需要使用正式申请的小程序ID才能正确请求云部署的文件
        Taro.cloud.init({
            env: cloudConfig.env
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

                <div className="page-title">收藏</div>
                {!this.state.logged && this.state.loggedTip === true ? <div className="at-article__info" style={{ color: 'red' }}>授权登录后才能保留收藏记录,您可以返回"我的"选项卡进行授权。</div> : null}
                <div className="page-desc">{JSON.stringify(this.props.currentData)}</div>

                <div className="dashboard">

                    {
                        this.state.loading ? <div>Loading...</div> : this.state.list ? this.state.list.map((post, key) => {
                            return (
                                <div className="fav at-article__h3" key={key}>
                                    <p>{post.name}</p>
                                    {this.props.currentData.includes(post.id)}
                                    {!this.props.currentData.includes(post.id) ? (
                                        <div>
                                            <button className="fav-imgbtn" onClick={(e) => {
                                                this.props.increment(post.id);

                                                this.setState({
                                                    loggedTip: true
                                                }, () => {
                                                    setTimeout(() => this.setState({ loggedTip: false }), 3000);
                                                });


                                                setTimeout(() => {
                                                    this.databaseForUserFav(JSON.stringify(this.props.currentData), this.state.openid, function (response) {
                                                        if (response !== false) {
                                                            console.log(JSON.parse(response.userinfo.favors));
                                                        }
                                                    });
                                                }, 0);

                                            }}><img className="fav-imgbtn__img" src={fav} alt="收藏" /></button>

                                        </div>
                                    ) : (
                                        <div>
                                            <button className="fav-imgbtn fav-imgbtn--active" onClick={(e) => {
                                                this.props.decrement(post.id);
                                                
                                                this.setState({
                                                    loggedTip: true
                                                }, () => {
                                                    setTimeout(() => this.setState({ loggedTip: false }), 3000);
                                                });


                                                setTimeout(() => {
                                                    this.databaseForUserFav(JSON.stringify(this.props.currentData), this.state.openid, function (response) {
                                                        if (response !== false) {
                                                            console.log(JSON.parse(response.userinfo.favors));
                                                        }
                                                    });
                                                }, 0);

                                            }}><img className="fav-imgbtn__img" src={favOk} alt="取消收藏" /></button>
                                        </div>
                                    )}

                                </div>

                            )
                        }) : null
                    }

                </div>


            </div>
        )

    }
}


export default Index;