import React, { useState, useEffect, useRef } from 'react'
import Taro from '@tarojs/taro';
import { View, Canvas } from '@tarojs/components'

import './index.scss'


function Index() {

    const id = 'canvas-id-001';
    const [winSize, setWinSize] = useState<number[]>([0,0]);

    // 注意<Canvas> 需要 `canvasId` 属性
    // 小程序是没有document，也是取不到 getContext属性的
    const initCanvas = () => {
        const ctx: any = Taro.createCanvasContext(id);  

        ctx.beginPath();
        ctx.moveTo(25, 25);
        ctx.lineTo(105, 25);
        ctx.lineTo(25, 105);
        ctx.fillStyle = "#ffffff";
        ctx.fill(); 
        ctx.draw(); // Taro.createCanvasContext的一个方法
     

    }

    useEffect(() => {

        // 需要使用 setTimeout 才能避免canvas对象为null的错误
        setTimeout(() => {
            initCanvas();
        }, 500);

        setWinSize([ window.innerWidth -40, window.innerHeight - 120]);
    }, []);

    return (
            <View className="wrapper">

                <View className="page-title">画布</View>

                <Canvas 
                    canvasId={id} 
                    className="canvas-obj" 
                    width={`${winSize[0]}px`}
                    height={`${winSize[1]}px`}    
                    style={{width: winSize[0] + 'px', height: winSize[1] + 'px'}} >
                </Canvas>
        
            </View>
    )
}

export default Index
