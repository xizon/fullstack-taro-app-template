import React, { Component } from 'react';
import { Provider } from 'mobx-react';

import counterStore from './store/counter';

import '@/app.scss';

const store: any = {
  counterStore
}



class App extends Component {
  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}
  
  // this.props.children is the page to render
  render () {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }

}

export default App;
