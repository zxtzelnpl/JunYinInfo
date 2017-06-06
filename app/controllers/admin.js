const Report = require('../../report/report');

exports.login = function (req, res) {
    res.render('login', {
        title:'登录界面'
    });
};

exports.adminRequired=function(req,res,next){
    let user=req.session.user;
    if(!user){
        return Report.errPage(res, '请先登录谢谢');
    }

    let level = parseInt(user.level);
    if(level<1000){
        return Report.errPage(res, '此页面只对内部人员开放，谢谢');
    }

    let forbidden=user.forbidden;
    if(forbidden){
        return Report.errPage(res, '您的账户已经被禁用');
    }

    next();
};
