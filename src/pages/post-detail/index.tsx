import React, { useState, useEffect} from 'react'
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import CustomButton from '@/components/Buttons';
import apiUrls from '@/config/apiUrls';
import { Image } from '@nutui/nutui-react-taro'

import './index.scss'
function Index() {

    const [loading, setLoading] = useState<boolean>(false);
    const [detail, setDetail] = useState<Record<string, string|number> | null>(null);

    const pageInstance: any = Taro.getCurrentInstance();  // 获取小程序的 app、page 对象、路由参数等数据
    const pages: any[] = Taro.getCurrentPages(); // 获取当前的页面栈
    const prevPagePath: string = pages.at(0).route; //  获取上一页面(不要使用path属性,小程序中可能不存在此属性)
    const prevPagePathAbsolutePath: string = prevPagePath.charAt(0) == "/" ? `/${prevPagePath.substring(1)}` : `/${prevPagePath}`; // 使用绝对路径，导出小程序后第一个斜杠会被去掉


    //获取页面参数
    const postname: any = pageInstance.router.params.name;


    const linkTo = (e, url) => {
        e.preventDefault();
        Taro.navigateTo({ url: url });
    };

    const getDetail = () => {   
  
        setLoading(true);
        Taro.showLoading({ title: '加载中' })

        Taro.request({
            url: apiUrls.RECEIVE_LISTDETAIL.replace('{id}', encodeURIComponent(postname)),
            method: 'GET',
            header: {},
            success: function (res) {

                Taro.hideLoading();

                console.log(res);

                if ( res.statusCode !== 200 ) {
                    setLoading(false);
                    setDetail({"name": "null", "flag": "null", "region": "null"});

                    return;      
                }

                setLoading(false);
                setDetail(res.data[0]);

            }
        });

    };

    useEffect(() => {
        //初始化远程数据
        getDetail();
    }, []);

    return (
        <View className="wrapper">

                <View className="page-title"></View>
                <View className="detail">

                   {
                        loading ? <View>Loading...</View> : detail ? (
                            <View>
                                <View className="page-title">{detail.name}</View>
                                <View><Image mode="widthFix" src={detail.flag as string} /></View>
                                <p>{detail.name}  - (region: {detail.region})</p>
                                <View><CustomButton  block type='success' fill="outline" btnName='返回上一页' href={`${prevPagePathAbsolutePath}`} /></View>
                                <p className="page-small">(注：小程序不能直接跳转到底部菜单栏)</p>
                            </View>
                        ) : null
                    }    
                </View>

            </View>
    )
}

export default Index


