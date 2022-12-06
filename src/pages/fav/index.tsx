import React, { Component } from 'react';
import { add, remove } from '@/status/actions/favActions';
import { connect } from 'react-redux';

import fav from '@/assets/images/icon2.png';
import favOk from '@/assets/images/icon2-active.png';


import './index.scss';



// Subscribe to the required state in the reducers is bound here (for details of the data structure: initState)
// You can call it in `this.props`
const mapStateToProps = (state) => {
    const { favReducer } = state; //Receive redux

    console.log(state);
    /*
    {
        "favReducer": {
            "ids": []
        },
        "postsReducer": {
            "items": null
        }
    }
    */

    return {
        currentData: favReducer.ids
    }
};

// Bind the introduced Actions. You will normally make use of this by returning new functions that call `dispatch()` inside themselves
// You can call it in `this.props`
/*
Like this:
const mapDispatchToProps = (dispatch) => {
    return {
        increment: (id) => dispatch({ type: 'INCREMENT', id: id }),
        decrement: (id) => dispatch({ type: 'DECREMENT', id: id }),
    }
}
*/
const mapDispatchToProps = (dispatch) => {
    return {
        increment: (id) => dispatch(add(id)),
        decrement: (id) => dispatch(remove(id))
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
class Index extends Component<any, any>  {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            list: [
                {
                    "id": 1,
                    "name": "George"
                },
                {
                    "id": 2,
                    "name": "Janet"
                },
                {
                    "id": 3,
                    "name": "Emma"
                },
                {
                    "id": 4,
                    "name": "Eve"
                },
                {
                    "id": 5,
                    "name": "Charles"
                }
            ]
        }

    }


    componentWillMount() { }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        return (
            <div className="wrapper">

                <div className="page-title">收藏</div>
                <div className="page-desc">{JSON.stringify(this.props.currentData)}</div>

                <div className="dashboard">

                    {
                        this.state.loading ? <div>Loading...</div> : this.state.list ? this.state.list.map((post, key) => {
                            return (
                                <div className="fav at-article__h3" key={key}>
                                    <p>{post.name}</p>
                                    {this.props.currentData.includes(post.id)}
                                    {!this.props.currentData.includes(post.id) ? (
                                        <div>
                                            <button className="fav-imgbtn" onClick={(e) => this.props.increment(post.id)}><img className="fav-imgbtn__img" src={fav} alt="收藏" /></button>

                                        </div>
                                    ) : (
                                        <div>
                                            <button className="fav-imgbtn fav-imgbtn--active" onClick={(e) => this.props.decrement(post.id)}><img className="fav-imgbtn__img" src={favOk} alt="取消收藏" /></button>
                                        </div>
                                    )}

                                </div>

                            )
                        }) : null
                    }

                </div>


            </div>
        )

    }
}


export default Index;