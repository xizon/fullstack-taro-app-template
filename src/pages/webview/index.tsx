import React, { Component, PropsWithChildren } from 'react';
import { WebView } from '@tarojs/components';
import './index.scss';


export default class Index extends Component<PropsWithChildren> {

    //网页向小程序 postMessage 时，会在特定时机（小程序后退、组件销毁、分享）触发并收到消息
    handleMessage(e) {
        const { data } = e.detail;
        console.log("handleMessage==", data)
    }

    //网页加载成功时候触发此事件
    handleLoad(e) {
        const { src } = e.detail;
        console.log("handleLoad==", src)
    }

    //网页加载失败的时候触发此事件
    handleError(e) {
        const { errMsg, url } = e.detail;
        console.log("handleError==", errMsg)
    }


    componentWillMount() { }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        return (
            <div className="webview">
                <WebView src={`https://yourwebsite.com`}
                    onMessage={this.handleMessage}
                    onLoad={this.handleLoad}
                    onError={this.handleError}
                />
            </div>
        )
    }
}
