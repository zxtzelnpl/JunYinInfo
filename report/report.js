exports.errPage=function(res,err){
    res.render('wrongWay', {
        title: '服务器错误',
        err: err
    })
};

exports.errJSON=function(res,err){
    res.json({
        state: 'fail',
        err: err
    })
};
