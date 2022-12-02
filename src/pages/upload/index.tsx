import React, { Component, PropsWithChildren } from 'react';
import Taro from '@tarojs/taro';
import { View, Button, Image } from '@tarojs/components';

import './index.scss';

type PageState = {
    imageInfo?: any | null;
};

export default class Index extends Component<PropsWithChildren, PageState> {

    constructor(props) {
        super(props);
        this.state = {
            imageInfo: null
        }

        this.uploadImage = this.uploadImage.bind( this );

    }

    uploadImage() {
        let self = this;
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

                //图片转base64
                self.imgConvertBase64(imagePath).then(res => {
                    self.setState({imageInfo: res});
                    
                });


            }
        })
    }

    imgConvertBase64(fileSrc) {
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
            <View className="wrapper">

                <View className="page-title">上传</View>

                <View className="upload">
                    <View>
                        <Button className='btn-max-w' type='primary' onClick={this.uploadImage}>选取图片</Button>
                    </View>

                    
                    { this.state.imageInfo ? <View><Image src={`${this.state.imageInfo}`}></Image></View> : null}

                    
                </View>



            </View>
        )
    }
}
