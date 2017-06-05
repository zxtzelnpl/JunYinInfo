import React from 'react';
import IScroll from 'iscroll';
import socket from '../socket/socket';

function AutoMessage({content}) {
    let DOMStr;
    DOMStr =
        (
            <li className="message autoReplay">
                <div className="content">
                    <span>
                       {content}
                    </span>
                </div>
            </li>
        );
    return DOMStr;
}

function Message({message}) {
    let DOMStr;
    let position = '';
    if (message.from._id === belongId) {
        DOMStr =
            (
                <li className={"message belong"}>
                    <div className="content">
                        <span>
                            {message.content}
                        </span>
                        <span className="out">
                        </span>
                        <span className="in">
                        </span>
                    </div>
                </li>
            );
    } else {
        DOMStr =
            (
                <li className={"message admin"}>
                    <div className="content">
                        <span className="out">
                        </span>
                        <span className="in">
                        </span>
                        <span>
                            {message.content}
                        </span>
                    </div>
                </li>
            );
    }
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

        let autoMes = (<AutoMessage key="auto" content={autoReplay}/>);
        messagesBox.unshift(autoMes);
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
