import React, { useState, useEffect} from 'react'
import Taro from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import apiUrls from '@/config/apiUrls';
import { Image } from '@nutui/nutui-react-taro'

import './index.scss'
function Index() {

    const [loading, setLoading] = useState<boolean>(false);
    const [list, setList] = useState<any[]>([]);

    const linkTo = (e, url) => {
        e.preventDefault();
        Taro.navigateTo({ url: url });
    };

    const getList = () => {   
  
        setLoading(true);
        Taro.showLoading({ title: '加载中' })

        Taro.request({
            url: apiUrls.RECEIVE_LIST,
            method: 'GET',
            header: {},
            success: function (res) {

                Taro.hideLoading();

                console.log(res);

                if ( res.statusCode !== 200 ) {
                    setLoading(false);
                    setList([]);
                    return;      
                }

                setLoading(false);
                setList(res.data);


            }
        });

    };

    const onScroll = (e) => {
        //console.log(e.detail);   // {scrollLeft: 0, scrollTop: 66, scrollHeight: 11544, scrollWidth: 375}, ...
    };


    useEffect(() => {
        //初始化远程数据
        getList();
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
                    onScrollToUpper={getList} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.getList()}`
                    onScroll={onScroll}
                >

                    {
                        loading ? <View>Loading...</View> : list ? list.map((post, key) => {
                            return (
                                <View className="item" key={key} onClick={(e) => linkTo(e, '/pages/post-detail/index?name=' + post.name)}>
                                    <View><Image mode="widthFix" src={post.flag} /></View>
                                    <p>{post.name}  - (region: {post.region})</p>
                                </View>
                            )
                        }) : null
                    }
                </ScrollView>


            </View>
    )
}

export default Index


