import React from 'react';
import $ from 'jquery';

class LeaveMessage extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            nickName:'',
            phone:'',
            leaveMes:''
        }
    }

    handleClick(){
        let me=this;
        console.log(me.state);
        $.ajax({
            type:'POST',
            url:'/way1/leaveMes',
            data:me.state,
            success:(data)=>{
                if (data.state === 'success') {
                    console.log('success')
                }else{
                    console.log('获取数据失败，请稍后再试')
                }
            },
            error:()=>{
                console.log('获取数据失败，请稍后再试')
            }
        })
    }

    handleChange(e){
        if(e.target.id==='nickName'){
            this.setState({
                nickName:e.target.value
            })
        }
        if(e.target.id==='phone'){
            this.setState({
                phone:e.target.value
            })
        }
        if(e.target.id==='leaveMes'){
            this.setState({
                leaveMes:e.target.value
            })
        }
    }

    render(){
        return (
            <div>
                <div className="nickName">
                    <label htmlFor="nickName">
                        姓名：
                    </label>
                    <input
                        id="nickName"
                        type="text"
                        placeholder="请输入姓名"
                        onChange={this.handleChange.bind(this)}
                    />
                </div>
                <div className="phone">
                    <label htmlFor="phone">
                        手机：
                    </label>
                    <input
                        id="phone"
                        type="text"
                        placeholder="请输入手机"
                        onChange={this.handleChange.bind(this)}
                    />
                </div>
                <div className="leaveMes">
                    <label htmlFor="leaveMes">
                        留言：
                    </label>
                    <textarea
                        id="leaveMes"
                        cols="30"
                        rows="10"
                        placeholder="再次输入留言内容"
                        onChange={this.handleChange.bind(this)}
                    >
                    </textarea>
                </div>
                <div className="submit">
                    <a href="javascript:void(0)" onClick={this.handleClick.bind(this)}>
                        提交
                    </a>
                    <a href="javascript:void(0)">
                        关闭
                    </a>
                </div>
            </div>
        )
    }
}

export default LeaveMessage
