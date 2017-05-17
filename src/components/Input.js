import React from 'react';
import socket from '../socket/socket';

class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            value:'请在此处输入内容'
        }
    }

    handleChange(e) {
        this.setState({
            value:e.target.value
        });
    }

    handleFocus(e){
        if(e.target.value==='请在此处输入内容'){
            e.target.value='';
        }
    }

    handleClick(e) {
        e.preventDefault();
        let name = document.querySelector('.signIn>span') ? document.querySelector('.signIn>span').innerHTML : undefined;
        if (name) {
            let content = this.textarea.value.replace(/\s/g, "");
            socket.emit('message', {
                content:content,
                room:iRoom._id
            });
        } else {
            alert('登录后可发送信息');
        }

    }

    handleKeyup(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.keyCode === 13&&e.ctrlKey) {
            let name = document.querySelector('.signIn>span') ? document.querySelector('.signIn>span').innerHTML : undefined;
            if (name) {
                let content = this.textarea.value.replace(/\s/g, "");
                socket.emit('message', {
                    content:content,
                    room:iRoom._id
                });
            } else {
                alert('登录后可发送信息');
            }
        }
    }

    render() {
        return (
            <div className="chatInputBox">
                <div>
          <textarea name="chatMessage"
                    id="chatMessage"
                    cols="30"
                    rows="5"
                    value={this.state.value}
                    ref={(textarea) => {
                        this.textarea = textarea
                    }}
                    onKeyUp={this.handleKeyup.bind(this)}
                    onChange={this.handleChange.bind(this)}
                    onFocus={this.handleFocus.bind(this)}
          />
                </div>
                <div>
                    <a className="btn" onClick={this.handleClick.bind(this)}>提交</a>
                </div>
            </div>
        )
    }
}

export default Input;
