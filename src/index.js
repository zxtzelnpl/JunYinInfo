import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';

import Chat from './components/Chat';
import LeaveMessage from './components/LeaveMessage';
import AutoReplay from './components/AutoReplay';

import reducer from './reducers';
import {Provider} from 'react-redux';

import {messages} from './actions';

import socket from './socket/socket';

const store = createStore(reducer);

if (belongId) {
    socket.on(belongId, function (message) {
        console.log(message);
        store.dispatch(messages(message, 'ADD'))
    });
}

const render = () => {
    console.log(store.getState());

    let html;
    if (fromId && belongId) {
        html = (
            <div>
                <Chat />
                <AutoReplay />
            </div>
        )
    } else {
        html = (
            <div className="wrap">
                <LeaveMessage />
                <AutoReplay />
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



