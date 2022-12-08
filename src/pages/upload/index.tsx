import React, { Component, PropsWithChildren } from 'react';
import Taro from '@tarojs/taro';
import { Button } from '@tarojs/components';

import './index.scss';

type PageState = {
    imageInfo?: any | null;
    imageTouchPosLeft?: any | null;
    imageTouchPosTop?: any | null;
    logged?: boolean;

};

export default class Index extends Component<PropsWithChildren, PageState> {

    __touchEnd: boolean;
    __touchPos: object;

    constructor(props) {
        super(props);
        this.state = {
            imageInfo: null,
            imageTouchPosLeft: 0,
            imageTouchPosTop: 0,
            logged: false
        }

        this.__touchEnd = false;
        this.__touchPos = {};

        this.uploadImage = this.uploadImage.bind(this);
        this.imgTouchStart = this.imgTouchStart.bind(this);
        this.imgTouchMove = this.imgTouchMove.bind(this);
        this.imgTouchEnd = this.imgTouchEnd.bind(this);




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
                    self.setState({ imageInfo: res });

                });

                //选择器，弹出图片上传成功
                Taro.createSelectorQuery().select('.upload').boundingClientRect()
                    .exec(res => {
                        console.log(res);
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



    imgTouchStart(e) {
        e.stopPropagation();

        this.__touchEnd = false;
        if (e.touches.length === 1) {
            //开始时触摸点的位置
            this.__touchPos = {
                //减去图片相对视口的位置，得到手指相对图片的左上角的位置x,y
                x: e.touches[0].clientX - this.state.imageTouchPosLeft,
                y: e.touches[0].clientY - this.state.imageTouchPosTop,
            };

        }
    }



    imgTouchMove(e) {
        e.stopPropagation();

        if (this.__touchEnd) {
            console.log("结束false");
            return;
        }

        if (e.touches.length === 1) {

            let left = e.touches[0].clientX - this.__touchPos.x;
            let top = e.touches[0].clientY - this.__touchPos.y;

            this.setState({
                imageTouchPosLeft: left,
                imageTouchPosTop: top,
            });
        }

    }

    imgTouchEnd() {
        this.__touchEnd = true;
    }



    componentWillMount() {

        //判断是否已经授权
        const value = Taro.getStorageSync('DATA_SESSION_LOGGED');
        if (value.length > 0) {
            this.setState({
                logged: true
            });
        } else {
            this.setState({
                logged: false
            });
        }


    }

    componentDidMount() {

    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        return (
            <div className="wrapper">

                <div className="page-title">上传</div>

                <div className="upload">
                    {!this.state.logged ? <div className="page-desc">授权登录后才能使用上传图片功能</div> : <div>
                        <Button className='btn-max-w' type='primary' onClick={this.uploadImage}>选取图片</Button>
                    </div>}


                    {this.state.imageInfo ? <div>
                        <div>上传后可以移动图片位置</div>
                        <div className="preview">
                            <img
                                className="dragdrop-obj"
                                src={`${this.state.imageInfo}`}
                                style={{
                                    top: this.state.imageTouchPosTop + "px",
                                    left: this.state.imageTouchPosLeft + "px",
                                }}
                                onTouchStart={this.imgTouchStart}
                                onTouchMove={this.imgTouchMove}
                                onTouchEnd={this.imgTouchEnd}
                            />
                        </div>
                    </div> : null}


                </div>



            </div>
        )
    }
}
