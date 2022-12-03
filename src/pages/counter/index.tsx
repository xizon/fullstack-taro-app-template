import React, { Component } from 'react';
import { Button } from '@tarojs/components';
import { add, minus } from '@/status/actions/counterActions';
import { connect } from 'react-redux';

import './index.scss';

// Subscribe to the required state in the reducers is bound here (for details of the data structure: initState)
// You can call it in `this.props`
const mapStateToProps = (state) => {
	const { counterReducer } = state; //Receive redux

    console.log(state); 
    /*
    {
        "counterReducer": {
            "num": 0
        },
        "postsReducer": {
            "items": null
        }
    }
    */

	return {
		currentData: counterReducer.num
	}
};

// Bind the introduced Actions. You will normally make use of this by returning new functions that call `dispatch()` inside themselves
// You can call it in `this.props`
/*
Like this:
const mapDispatchToProps = (dispatch) => {
	return {
		increment: () => dispatch({ type: 'INCREMENT' }),
		decrement: () => dispatch({ type: 'DECREMENT' }),
	}
}
*/
const mapDispatchToProps = (dispatch) => {
	return {
		increment: () => dispatch(add()),
		decrement: () => dispatch(minus())
	}
}

/*
connect(
	mapStateToProps,
	mapDispatchToProps
)(Index);
*/

const myConnect: any = connect; // 由于直接使用@connect tslint会报错，所以重新赋值再使用装饰器写法

@myConnect(
	mapStateToProps,
	mapDispatchToProps
)
class Index extends Component<any, any> {

    componentWillMount() { }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        return (
            <div className="wrapper">
                <div className="page-title">计数器</div>
                <h5 className="page-desc">当切换不同的页面时计数器的值并不会归零</h5>

                <Button className='btn-max-w' type='primary' onClick={this.props.increment}>+</Button>
                <Button className='btn-max-w' type='primary' onClick={this.props.decrement}>-</Button>
                <div className="number">{this.props.currentData}</div>


                
            </div>
        )
    }
}


export default Index;