import React, { useState, useEffect, useRef } from 'react'
import { View, WebView } from '@tarojs/components';
import './index.scss';


function Index() {

    //网页向小程序 postMessage 时，会在特定时机（小程序后退、组件销毁、分享）触发并收到消息
    const handleMessage = (e) => {
        const { data } = e.detail;
        console.log("handleMessage==", data)
    }

    //网页加载成功时候触发此事件
    const handleLoad = (e) => {
        const { src } = e.detail;
        console.log("handleLoad==", src)
    }

    //网页加载失败的时候触发此事件
    const handleError = (e) => {
        const { errMsg, url } = e.detail;
        console.log("handleError==", errMsg)
    }


    return (
        <View className="webview">
            <WebView src={`https://yourwebsite.com`}
                onMessage={handleMessage}
                onLoad={handleLoad}
                onError={handleError}
            />
        </View>
    )
}

export default Index
