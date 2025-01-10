import React, { useEffect } from 'react'
import { useDidShow, useDidHide } from '@tarojs/taro'
import { Provider } from 'react-redux';
import '@/app.scss';


import configureStore from '@/status/store/createStore';
const store = configureStore();



function App(props) {
    // 可以使用所有的 React Hooks
    useEffect(() => { })

    // 对应 onShow
    useDidShow(() => { })

    // 对应 onHide
    useDidHide(() => { })

    return (
        <Provider store={store}>
            {props.children}
        </Provider>
    )
}

export default App
