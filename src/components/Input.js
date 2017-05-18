import React from 'react';
import socket from '../socket/socket';

class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            value:''
        }
    }

    handleChange(e) {
        this.setState({
            value:e.target.value
        });
    }

    handleClick(e) {
        e.preventDefault();
        let content = this.state.value.replace(/\s/g, "");
        if(content===''){
            alert('输入内容不能为空');
        }
        socket.emit('message', {
            content:content,
            from:fromId,
            belong:belongId,
        });
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
                    onChange={this.handleChange.bind(this)}
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
