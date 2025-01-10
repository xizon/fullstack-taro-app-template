import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import apiUrls from '@/config/apiUrls';
import cloudConfig from '@/config/cloudConfig';
import { Image } from '@nutui/nutui-react-taro'

import './index.scss'
function Index() {

    const [loading, setLoading] = useState<boolean>(false);
    const [list, setList] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);

    const linkTo = (e, url) => {
        e.preventDefault();
        Taro.navigateTo({ url: url });
    };

    const displayData = (res, nextpage) => {
        console.log('php data: ', res);

        Taro.hideLoading();

        if (res.statusCode !== 200) {
            setLoading(false);
            setList([]);
        
            return;
        }

        if (nextpage > res.data.total_pages) return;
        if (res.data.error) return;



        //分页代码
        setLoading(false);
        setList((prevState: any[]) => {
            const oldData = prevState;
            return oldData.concat(res.data.data);
        });
        setPage(nextpage);


    };

    // getList = () => { ... }
    const getList = (nextpage = 1) => {
        Taro.showLoading({ title: '加载中' })


        /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
         * # 使用H5测试  start   
         * 注意：
         * 1) 请修改 cloud-hosting/miniprogram-deploy-package/includes/conn.php 数据库配置
         * 2) 请检查请求的测试地址 (外网URL或者localhost是否通畅)
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  */
        if (process.env.NODE_ENV === 'development') {

            Taro.request({
                url: apiUrls.RECEIVE_LIST_PAGINATION.replace('{page}', `${nextpage}`),
                method: 'GET',
                success: function (res: any) {
                    displayData(res, nextpage);
                }

            });

            return;
        }
        /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
         * # 使用H5测试  end   
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  */


        Taro.cloud.callContainer({
            path: cloudConfig.RECEIVE_LIST_PAGINATION.replace('{page}', `${nextpage}`),
            method: 'GET',
            header: cloudConfig.callContainerHeader,
            data: ""
        }).then(res => {
            displayData(res, nextpage);


        }).catch(err => {
            Taro.showLoading({ title: '后端服务重启中' });
            console.log(err);
        });


    };


    const onScroll = (e) => {
        //console.log(e.detail);   // {scrollLeft: 0, scrollTop: 66, scrollHeight: 11544, scrollWidth: 375}, ...
    };


    useEffect(() => {
        //初始化远程数据
        getList(1);
    }, []);

    return (
        <View className="wrapper wrapper--hasScrollView">

            <View className="page-title">文章列表</View>

            <ScrollView className="scrollview"
                scrollY
                scrollWithAnimation
                scrollTop={0}
                lowerThreshold={20}
                upperThreshold={20}
                onScrollToLower={() => {
                     // 滚动到底部触发，箭头函数写法 `onScrollToLower={getList(page+1)}`
                    getList(page + 1);
                }}
                onScroll={onScroll}
            >

                {
                    loading ? <View>Loading...</View> : list ? list.map((post, key) => {
                        return (
                            <View className="item" key={key}>
                                <p>{key + 1}. {post.title}</p>
                                <View className="item-img"><Image mode="widthFix" src={post.avatar} /></View>
                            </View>

                        )
                    }) : null
                }
            </ScrollView>


        </View>
    )
}

export default Index


