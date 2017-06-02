exports.notFound = function (req, res) {
    res.render('wrongWay', {
        title: '找不到页面',
        err: '你输入的地址不正确，请重新确认您的地址'
    })
};
