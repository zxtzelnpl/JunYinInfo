exports.login = function (req, res) {
    res.render('login', {
        title:'登录界面'
    });
};

exports.adminRequired=function(req,res,next){
    // let level = req.session.user ? parseInt(req.session.user.level) : 0;
    // if(level>=1000){
    //     next();
    // }else{
    //     res.render('wrongWay',{
    //         title:'你是不是忘记了什么',
    //         err:'这些页面暂时不对外开放哦'
    //     })
    // }
    next()
};

exports.information=function(req,res){
    let information=req.params.information;
    res.render('information',{
        information
    })
};
