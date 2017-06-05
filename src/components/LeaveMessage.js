import React from 'react';
import $ from 'jquery';

class LeaveMessage extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            nickName:'',
            wx:'',
            phone:'',
            leaveMes:'',
            warning:{
                className:'off',
                text:''
            }
        };
    }

    handleClick(){
        let me=this;
        const nameReg=/^[\u4E00-\u9FA5a-zA-Z]+$/;
        const wxReg=/^[a-zA-Z\d_]{5,20}$/;
        const phoneReg=/^1[3|4|5|7|8][0-9]\d{8}$/;
        const illegalReg=/[&></]+/g;
        if(this.state.nickName===''){
            this.setState({
                warning:{
                    className:'warning',
                    text:'姓名不能为空。'
                }
            });
            return
        }
        if(this.state.wx===''&&this.state.phone===''){
            this.setState({
                warning:{
                    className:'warning',
                    text:'微信号、手机号码二者需填写一个，请重新输入。'
                }
            });
            return
        }
        if(!nameReg.test(this.state.nickName)){
            this.setState({
                warning:{
                    className:'warning',
                    text:'姓名只能包含中文汉字和英文字母。'
                }
            });
            return
        }
        if(this.state.wx!==''&&!wxReg.test(this.state.wx)){
            this.setState({
                warning:{
                    className:'warning',
                    text:'请输入正确的微信号。'
                }
            });
            return
        }
        if(this.state.phone!==''&&!phoneReg.test(this.state.phone)){
            this.setState({
                warning:{
                    className:'warning',
                    text:'请输入正确的手机号。'
                }
            });
            return
        }
        if(this.state.leaveMes!==''&&illegalReg.test(this.state.leaveMes)){
            this.setState({
                warning:{
                    className:'warning',
                    text:'留言内容不能含有&></等字符。'
                }
            });
            return
        }
        console.log(me.state);
        $.ajax({
            type:'POST',
            url:'/way/leaveMes/',
            data:{
                nickName:this.state.nickName,
                phone:this.state.phone,
                leaveMes:this.state.leaveMes,
                wx:this.state.wx,
                way:way
            },
            success:(data)=>{
                if (data.state === 'success') {
                    window.location.reload();
                }else{
                    me.setState({
                        warning:{
                            className:'warning',
                            text:data.err
                        }
                    })
                }
            },
            error:()=>{
                me.setState({
                    warning:{
                        className:'warning',
                        text:'获取数据失败，请稍后再试'
                    }
                });
            }
        })
    }

    handleClose(){
        $.ajax({
            type:'POST',
            url:'/way/direct/',
            data:{
                way:way
            },
            success:(data)=>{
                if (data.state === 'success') {
                    console.log('success');
                    window.location.reload();
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
        if(e.target.id==='wx'){
            this.setState({
                wx:e.target.value
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
            <div className="wrapForLeaveMessage">
                <p className="subTitle">
                    请输入您的个人信息及问题，稍后将有客服人员回复您。
                </p>
                <div className="leaveMessage">
                    <div className="nickName inputBox">
                        <label htmlFor="nickName">
                            姓名*：
                        </label>
                        <input
                            id="nickName"
                            type="text"
                            placeholder="请输入您的姓名"
                            onChange={this.handleChange.bind(this)}
                        />
                    </div>
                    <div className="wx inputBox">
                        <label htmlFor="wx">
                            微信号：
                        </label>
                        <input
                            id="wx"
                            type="text"
                            placeholder="请输入您的微信号"
                            onChange={this.handleChange.bind(this)}
                        />
                    </div>
                    <div className="phone inputBox">
                        <label htmlFor="phone">
                            手机号码：
                        </label>
                        <input
                            id="phone"
                            type="text"
                            placeholder="请输入您的手机号"
                            onChange={this.handleChange.bind(this)}
                        />
                    </div>
                    <div className={this.state.warning.className}>
                        <span>{this.state.warning.text}</span>
                    </div>
                    <div className="leaveMes textBox">
                        <label htmlFor="leaveMes">
                            留言内容：
                        </label>
                        <textarea
                            id="leaveMes"
                            rows="6"
                            placeholder="请输入您的留言内容"
                            onChange={this.handleChange.bind(this)}
                        >
                    </textarea>
                    </div>
                    <div className="submit">
                        <a href="javascript:void(0)" onClick={this.handleClick.bind(this)}>
                            提交
                        </a>
                    </div>
                </div>
            </div>

        )
    }
}

export default LeaveMessage
