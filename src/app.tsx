import React, { Component, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import '@/app.scss';

import configureStore from '@/status/store/createStore';
const store = configureStore();

class App extends Component<PropsWithChildren> {

    componentDidMount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        // this.props.children 是将要会渲染的页面
        return (
            <Provider store={store}>
                { this.props.children }
            </Provider>
          )
    }
}

export default App
