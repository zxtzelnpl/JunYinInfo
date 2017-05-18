import React from 'react';
import $ from 'jquery';
import IScroll from 'iscroll';
import socket from '../socket/socket';

function Message({message}) {
    let DOMStr;
    DOMStr =
        (
            <li className="message">
                <div className="name">{message.from.nickName}:</div>
                <div className="time">{new Date(message.createAt).toLocaleString()}</div>
                <div className="content">{message.content}</div>
            </li>
        );
    return DOMStr;
}

class MessageBox extends React.Component {
    constructor(props) {
        super(props);
        this.canMove = 0;
        this.page = 1;
        this.pageLoad = false;
        this.check = function (id) {
            socket.emit('checkMessage', id)
        };
        this.del = function (id) {
            socket.emit('delMessage', id)
        };
    }

    componentDidMount() {
        console.log('componentDidMount');
        let me = this;
        let innerH = me.messages.scrollHeight;
        let outerH = me.messagesBox.clientHeight;
        console.log(innerH, outerH);
        let canMove = innerH - outerH;
        console.log(canMove);
        if (canMove < 0) {
            return;
        }
        this.canMove = canMove;
        this.myScroll = new IScroll('.messagesBox', {
            startY: -me.canMove
            , resizeScrollbars: true
        });
    }

    componentDidUpdate() {
        console.log('componentDidUpdate');

        let innerH = this.messages.scrollHeight;
        let outerH = this.messagesBox.clientHeight;
        console.log(innerH, outerH);
        let canMove = innerH - outerH;
        console.log(canMove);
        if (canMove < 0) {
            return;
        }
        if (!this.myScroll) {
            this.canMove = canMove;
            this.myScroll = new IScroll('.messagesBox', {
                startY: -this.canMove
                , resizeScrollbars: true
            });
        } else {
            if (canMove !== this.canMove) {
                this.canMove = canMove;
                this.myScroll.refresh();
                if (this.pageLoad) {
                    this.pageLoad = false;
                    this.myScroll.scrollTo(0, 0, 500, IScroll.utils.ease.ease);
                } else {
                    this.myScroll.scrollTo(0, -this.canMove, 500, IScroll.utils.ease.ease);
                }
            }
        }
    }

    render() {
        let me = this;
        console.log(this.props.messages);
        let messages = [];
        for (let key in this.props.messages) {
            messages.push(this.props.messages[key])
        }
        messages.sort(function (a, b) {
            return new Date(a.createAt).getTime() - new Date(b.createAt).getTime()
        });

        let messagesBox = messages.map((message, index) => (
            <Message key={index} message={message} check={me.check} del={me.del}/>
        ));

        return (
            <div
                className="messagesBox"
                ref={(box) => {
                    this.messagesBox = box
                }}
            >
                <ul
                    style={this.state}
                    ref={(ul) => {
                        this.messages = ul
                    }}
                >
                    {messagesBox}
                </ul>
            </div>
        )
    }
}

export default MessageBox
