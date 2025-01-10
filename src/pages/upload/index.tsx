import React, { useState, useRef } from 'react'
import Taro, { useReady } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Button } from '@nutui/nutui-react-taro'

import './index.scss'


function Index() {

    let __touchEnd = useRef<boolean>(false);
    let __touchPos = useRef<any>({x: 0, y: 0});

    const [imageInfo, setImageInfo] = useState<any>(null);
    const [imageTouchPosLeft, setImageTouchPosLeft] = useState<number>(0);
    const [imageTouchPosTop, setImageTouchPosTop] = useState<number>(0);
    const [logged, setLogged] = useState<boolean>(false);


    const uploadImage = () => {
        Taro.chooseImage({
            count: 1,// 默认9
            sizeType: ['original', 'compressed'],// 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'],// 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                console.log(res);
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = res.tempFilePaths;

                //图片地址
                let imagePath = tempFilePaths[0];

                //图片大小(不能超过50K)
                const imageSize = Math.ceil(res.tempFiles[0].size / 1000);
                if (imageSize >= 50) {
                    Taro.showToast({
                        title: '图片不能超过50K',
                        icon: 'error',
                        duration: 2000
                    });
                    return;
                }



                //图片转base64
                imgConvertBase64(imagePath).then(res => {
                    setImageInfo(res);

                    //存储到数据库
                    //...

                });

                //选择器，弹出图片上传成功
                Taro.createSelectorQuery().select('.upload').boundingClientRect()
                    .exec(res => {
                        console.log(res);
                    });


            }
        })
    };

    const imgConvertBase64 = (fileSrc) => {
        return new Promise((resolve, reject) => {
            if (Taro.getEnv() === 'WEAPP') {
                //小程序
                //----------------
                Taro.getFileSystemManager().readFile({
                    filePath: fileSrc, //选择图片返回的相对路径
                    encoding: 'base64', //编码格式
                    success: res => { //成功的回调
                        let base64 = 'data:image/png;base64,' + res.data;
                        //console.log(base64);
                        resolve(base64);
                    }
                });
            } else if (Taro.getEnv() === 'WEB') {
                //Web
                //----------------
                fetch(fileSrc).then(data => {
                    const blob = data.blob();
                    return blob;
                }).then(blob => {
                    let reader = new window.FileReader();
                    reader.onloadend = function () {
                        const base64 = reader.result;
                        resolve(base64);
                    };
                    reader.readAsDataURL(blob);
                })
            } else {
                resolve('');
                reject('');
            }
        });

    };



    const imgTouchStart = (e) => {
        e.stopPropagation();

        __touchEnd.current = false;
        if (e.touches.length === 1) {
            //开始时触摸点的位置
            __touchPos.current = {
                //减去图片相对视口的位置，得到手指相对图片的左上角的位置x,y
                x: e.touches[0].clientX - imageTouchPosLeft,
                y: e.touches[0].clientY - imageTouchPosTop,
            };

        }
    };



    const imgTouchMove = (e) => {
        e.stopPropagation();

        if (__touchEnd.current) {
            console.log("结束false");
            return;
        }

        if (e.touches.length === 1) {

            let left = e.touches[0].clientX - __touchPos.current.x;
            let top = e.touches[0].clientY - __touchPos.current.y;

            setImageTouchPosLeft(left);
            setImageTouchPosTop(top)
        }

    };

    const imgTouchEnd = () => {
        __touchEnd.current = true;
    };




    useReady(() => {
        //判断是否已经授权
        const value = Taro.getStorageSync('DATA_SESSION_LOGGED');
        if (value.length > 0) {
            setLogged(true);
        } else {
            setLogged(false);
        }
    });

    return (
        <View className="wrapper">

            <View className="page-title">上传</View>

            <View className="upload">
                {!logged ? <View className="page-desc">授权登录后才能使用上传图片功能</View> : <View>
                    <Button block type='success' onClick={uploadImage}>选取图片</Button>
                </View>}


                {imageInfo ? <View>
                    <View>上传后可以移动图片位置</View>
                    <View className="preview">
                        <img
                            className="dragdrop-obj"
                            src={`${imageInfo}`}
                            style={{
                                top: imageTouchPosTop + "px",
                                left: imageTouchPosLeft + "px",
                            }}
                            onTouchStart={imgTouchStart}
                            onTouchMove={imgTouchMove}
                            onTouchEnd={imgTouchEnd}
                        />
                    </View>
                </View> : null}


            </View>



        </View>
    )
}

export default Index
