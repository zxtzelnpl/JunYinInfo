import React from 'react';
import $ from 'jquery';

class AutoReplay extends React.Component{
    constructor(props){
        super(props);
        this.state={
            data:''
        };
    }

    componentDidMount() {
        $.ajax({
            url:'/autoplay',
            data:{
                way:way
            }
        })
        .done(
            value => this.setState({data:value})
        ).fail(
            error => (console.warn('The request has been rejected'))
        )
    }

    render(){
        let str=this.state.data.content;
        return(
            <div className="autoPlay">
                <span>{str}</span>
            </div>
        )
    }
}

export default AutoReplay;
