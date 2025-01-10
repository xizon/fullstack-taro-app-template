import React, { useState } from 'react'
import { View } from '@tarojs/components'
import CustomButton from '@/components/Buttons';
import { Divider } from '@nutui/nutui-react-taro'

import './index.scss'
function Index() {


    return (
        <View className="wrapper wrapper--normal">
            <View>
                欢迎来到演示页面! 您可以点击导航按钮跳转其他页面进行测试。
            </View>
            <Divider />

            <View><CustomButton block type='success' fill="outline" style={{ marginBottom: 10 }} btnName='文章列表(异步请求)' href={`/pages/posts/index`} /></View>
            <View><CustomButton block type='success' fill="outline" style={{ marginBottom: 10 }} btnName='文章列表(云部署请求)' href={`/pages/posts/index-cloudhosting`} /></View>
            <View><CustomButton block type='success' fill="outline" style={{ marginBottom: 10 }} btnName='收藏(Redux状态管理)' href={`/pages/fav/index`} /></View>
            <View><CustomButton block type='success' fill="outline" style={{ marginBottom: 10 }} btnName='画布' href={`/pages/canvas/index`} /></View>
            <View><CustomButton block type='success' fill="outline" style={{ marginBottom: 10 }} btnName='WebView' href={`/pages/webview/index`} /></View>
            <View>(注：小程序不能直接跳转到底部菜单栏)</View>
        </View>
    )
}

export default Index

