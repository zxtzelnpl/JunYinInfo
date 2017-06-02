import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';

import Chat from './components/Chat';
import LeaveMessage from './components/LeaveMessage';
import Banner from './components/Banner'

import reducer from './reducers';
import {Provider} from 'react-redux';

import {messages} from './actions';

import socket from './socket/socket';

var store = createStore(reducer);

if (belongId) {
    socket.on(belongId, function (message) {
        console.log(message);
        store.dispatch(messages(message, 'ADD'))
    });
}

const render = () => {
    console.log(store.getState());

    var html;
    if (fromId && belongId) {
        html = (
            <div>
                <Banner text="已接入，请留言..." />
                <Chat />
            </div>
        )
    } else {
        html = (
            <div>
                <Banner text="在线咨询"/>
                <LeaveMessage />
            </div>
        )
    }

    ReactDOM.render(
        <Provider store={store}>
            <div>

                {html}
            </div>
        </Provider>, document.getElementById('app')
    )
};


render();
store.subscribe(render);



