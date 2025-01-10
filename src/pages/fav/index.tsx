import React, { useState, useEffect, useCallback} from 'react'
import Taro, { useReady } from '@tarojs/taro';
import { View } from '@tarojs/components'

import fav from '@/assets/images/icon2.png';
import favOk from '@/assets/images/icon2-active.png';

import apiUrls from '@/config/apiUrls';
import cloudConfig from '@/config/cloudConfig';

// store
import { useDispatch, useSelector } from "react-redux";
import { add, remove } from "@/status/actions/favActions";

import './index.scss';


function Index() {

    // Get store
    const dispatch = useDispatch();
    const currentStoreData: any = useSelector((state: any) => {
        return state.favReducer.ids;
    });


    const [loading, setLoading] = useState<boolean>(false);
    const [logged, setLogged] = useState<boolean>(false);
    const [loggedTip, setLoggedTip] = useState<boolean>(false);
    const [openid, setOpenid] = useState<boolean>(false);

    const increment = useCallback((newData: any[]) => {
        dispatch(add(newData));
    }, []);

    const decrement = useCallback((newData: any[]) => {
        dispatch(remove(newData));
    }, []);

    const [list, setList] = useState<any[]>([
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
    ]);

    const databaseForUserFav = (obj: any = false, openid: any = false, callback: any = false) => {


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



    };


    // 组件初次加载和小程序页面切换时触发
    // 用于 `componentWillMount()` 和 `componentDidShow()`
    const pageSwitchFun = () => {

        //判断是否已经授权
        const value = Taro.getStorageSync('DATA_SESSION_LOGGED');

        if (value.length > 0) {
            setLogged(true);
            setOpenid(value);

        } else {
            setLogged(false);
            setLoggedTip(false);
            setOpenid(false);
            
        }

        if (value.length === 0) {
            return;
        }


        //获取收藏的项目
        // Taro.getStorage()是异步的，所以可以保证Taro.cloud.init()优先执行，保证databaseForUserFav()正确执行云请求
        Taro.getStorage({
            key: 'DATA_SESSION_LOGGED',
            success: function (res) {
                const _openid = res.data;

                // 触发dispatch改变整体收藏状态
                databaseForUserFav(false, _openid, function (response) {

                    console.log('pageSwitchFun() response: ', response);
                    if (response !== false && response.userinfo.favors) {

                        const favored = JSON.parse(response.userinfo.favors);
                        favored.forEach(el => {
                            increment(el);
                        });

                    }
                });

            }
        });

    };


    useReady(() => {
        pageSwitchFun();
    });

    return (
            <View className="wrapper">

                <View className="page-title">收藏</View>
                {!logged && loggedTip === true ? <View className="at-article__info" style={{ color: 'red' }}>授权登录后才能保留收藏记录,您可以返回"我的"选项卡进行授权。</View> : null}
                <View className="page-desc">{JSON.stringify(currentStoreData)}</View>

                <View className="dashboard">

                    {
                        loading ? <View>Loading...</View> : list ? list.map((post: any, key: number) => {
                            return (
                                <View className="fav at-article__h3" key={key}>
                                    <p>{post.name}</p>
                                    {currentStoreData.includes(post.id)}
                                    {!currentStoreData.includes(post.id) ? (
                                        <View>
                                            <button className="fav-imgbtn" onClick={(e) => {
                                                increment(post.id);

                                                setLoggedTip(true);
                                                setTimeout(() => {
                                                    setLoggedTip(false);
                                                }, 3000);


                                                setTimeout(() => {
                                                    databaseForUserFav(JSON.stringify(currentStoreData), openid, function (response) {
                                                        if (response !== false) {
                                                            console.log(JSON.parse(response.userinfo.favors));
                                                        }
                                                    });
                                                }, 0);

                                            }}><img className="fav-imgbtn__img" src={fav} alt="收藏" /></button>

                                        </View>
                                    ) : (
                                        <View>
                                            <button className="fav-imgbtn fav-imgbtn--active" onClick={(e) => {
                                                decrement(post.id);
                                                
                                                setLoggedTip(true);
                                                setTimeout(() => {
                                                    setLoggedTip(false);
                                                }, 3000);


                                                setTimeout(() => {
                                                    databaseForUserFav(JSON.stringify(currentStoreData), openid, function (response) {
                                                        if (response !== false) {
                                                            console.log(JSON.parse(response.userinfo.favors));
                                                        }
                                                    });
                                                }, 0);

                                            }}><img className="fav-imgbtn__img" src={favOk} alt="取消收藏" /></button>
                                        </View>
                                    )}

                                </View>

                            )
                        }) : null
                    }

                </View>


            </View>
    )
}

export default Index


