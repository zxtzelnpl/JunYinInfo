import React from 'react';
import socket from '../socket/socket';

class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    handleClick(e) {
        e.preventDefault();
        let content = this.state.value.replace(/\s/g, "");
        if (content === '') {
            alert('输入内容不能为空');
            return;
        }
        socket.emit('message', {
            content: content,
            from: fromId,
            belong: belongId,
        });
    }

    handleKeyUp(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.keyCode === 13 && e.ctrlKey) {
            let content = this.state.value.replace(/\s/g, "");
            if (content === '') {
                alert('输入内容不能为空');
                return;
            }
            socket.emit('message', {
                content: content,
                from: fromId,
                belong: belongId,
            });
        }
    }

    render() {
        return (
            <div className="chatInputBox">
                <input id="chatMessage"
                       placeholder="在此输入问题"
                       value={this.state.value}
                       onChange={this.handleChange.bind(this)}
                       onKeyUp={this.handleKeyUp.bind(this)}
                />

                <a className="btn" onClick={this.handleClick.bind(this)}>发送</a>
            </div>
        )
    }
}

export default Input;
