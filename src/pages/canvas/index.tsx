import React, { Component, PropsWithChildren } from 'react';
import Taro from '@tarojs/taro';
import { Canvas } from '@tarojs/components';

import './index.scss';

type PageState = {
    pxWidth?: any;
    pxHeight?: any;
};


export default class Index extends Component<PropsWithChildren, PageState> {
    canvasId: React.RefObject<unknown>;
    id: string;
    sysInfo: any;

    constructor(props) {
        super(props);

        this.canvasId = React.createRef();
        this.id = 'canvas-id-001';

        this.state = {
            pxWidth: window.innerWidth - 40,
            pxHeight: window.innerHeight
        }

        this.initCanvas = this.initCanvas.bind(this);

    }

    // 注意<Canvas> 需要 `canvasId` 属性
    // 且是在 onReady() 方法中调用
    // 小程序是没有document，也是取不到 getContext属性的
    initCanvas() {

        const ctx: any = Taro.createCanvasContext(this.id);  

        ctx.beginPath();
        ctx.moveTo(25, 25);
        ctx.lineTo(105, 25);
        ctx.lineTo(25, 105);
        ctx.fillStyle = "#ffffff";
        ctx.fill(); 
        ctx.draw(); // Taro.createCanvasContext的一个方法
     

    }


    onReady() {
        this.initCanvas();
    }

    componentWillMount() {

    }

    componentDidMount() {
        
    }
    

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        return (
            <div className="wrapper">

                <div className="page-title">Canvas</div>

                <Canvas 
                    ref={this.canvasId} 
                    canvasId={this.id} 
                    className="canvas-obj" 
                    width={this.state.pxWidth}
                    height={this.state.pxHeight}            
                    style={{width: this.state.pxWidth + 'px', height: this.state.pxHeight + 'px'}} >
                </Canvas>
        
            </div>
        )
    }
}
