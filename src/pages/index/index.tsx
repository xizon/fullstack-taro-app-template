import React, { Component, PropsWithChildren } from 'react';
import CustomButton from '@/components/Buttons';
import './index.scss';



export default class Index extends Component<PropsWithChildren> {

    componentWillMount() { }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        return (
            <div className="wrapper">
                <div className='at-article'>
                    <div className='at-article__content'>
                        <div className='at-article__section'>
                            <div className='at-article__h3'>
                            欢迎来到演示页面! 您可以点击导航按钮跳转其他页面进行测试。
                            </div>
                            <hr className="page-hr" />

                            <div><CustomButton className='btn-max-w' plain type='primary' btnName='文章列表(异步请求)' href={`/pages/posts/index`} /></div>
                            <div><CustomButton className='btn-max-w' plain type='primary' btnName='文章列表(云部署请求)' href={`/pages/posts/index-cloudhosting`} /></div>
                            <div><CustomButton className='btn-max-w' plain type='primary' btnName='收藏(Redux状态管理)' href={`/pages/fav/index`} /></div>
                            <div><CustomButton className='btn-max-w' plain type='primary' btnName='WebView' href={`/pages/webview/index`} /></div>

                            <p className="page-small">(注：小程序不能直接跳转到底部菜单栏)</p>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
