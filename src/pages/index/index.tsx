import React, { Component, PropsWithChildren } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import Button from '@/components/Buttons';
import './index.scss';



export default class Index extends Component<PropsWithChildren> {

    componentWillMount() { }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        return (
            <View className="wrapper">
                <View className="page-title">首页</View>
                <Text className="page-desc">欢迎来到演示页面! 您可以点击导航按钮跳转其他页面进行测试。</Text>
                
                <View><Button className='btn-max-w' plain type='primary' btnName='文章列表(异步请求)' href={`/pages/posts/index`} /></View>
                <View><Button className='btn-max-w' plain type='primary' btnName='计数器(Redux状态管理)' href={`/pages/counter/index`} /></View>

                <Text className="page-small">(注：小程序不能直接跳转到底部菜单栏)</Text>
            </View>
        )
    }
}
