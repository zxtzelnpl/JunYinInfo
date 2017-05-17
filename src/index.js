import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';

import Chat from './components/Chat';

import reducer from './reducers';
import {Provider} from 'react-redux';

import {messages,onlines} from './actions';

import socket from './socket/socket';

const store = createStore(reducer);


if(iUser.level<999){
    socket.on('selfBack',function(msg){
        store.dispatch(messages(msg,'BACK'));
    })
}else{
    socket.on('message',function(msg){
        store.dispatch(messages(msg,'ADD'));
    });
}
socket.on('checkedMessage',function(msg){
    store.dispatch(messages(msg,'CHECK'))
});
socket.on('delMessage',function(msg){
    store.dispatch(messages(msg,'DEL'))
});

socket.on('online',function(msg){
  store.dispatch(onlines(msg))
});

const render = () => {
  console.log(store.getState());
  ReactDOM.render(
    <Provider store={store}>
      <Chat />
    </Provider>, document.getElementById('app')
  )
};



render();
store.subscribe(render);



