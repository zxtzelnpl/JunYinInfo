const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
const Message = require('../app/controllers/message');
const Admin = require('../app/controllers/admin');
const Visit = require('../app/controllers/visit');
const Excel = require('../app/controllers/excel');
const Way = require('../app/controllers/way');
const Way1 = require('../app/controllers/way1');
const Way2 = require('../app/controllers/way2');

module.exports = function (app, io) {
    /*请求预处理*/
    app.use(function (req, res, next) {
        app.locals.user = req.session.user;
        next();
    });

    app.get('/way/:id',Index.index);
    app.post('/way/leaveMes',Index.leaveMes);
    app.post('/way/direct',Index.direct);

    app.get('/autoplay',Visit.autoReplay);//JSON：自动回复内容
    app.get('/excel/:way', Excel.excel);//EXCEL:下载内容

    // /*Way1*/
    // app.get('/way/way1', Way1.index);//页面：客服主页
    // app.post('/way/leaveMes/way1', Way1.leaveMes);//JSON:客户留下信息
    // app.post('/way/direct/way1', Way1.direct);//JSON:客户未留下信息
    // /*LeaveMes-All*/
    // app.get('/way1/leavemes/:pageNum',Admin.adminRequired,Way1.userList);//页面：留言列表
    // app.post('/way1/leavemes/:pageNum',Admin.adminRequired,Way1.userSearch);//页面：留言检索
    //
    // /*Way2*/
    // app.get('/way/way2', Way2.index);//页面：客服主页
    // app.post('/way/leaveMes/way2', Way2.leaveMes);//JSON:客户留下信息
    // app.post('/way/direct/way2', Way2.direct);//JSON:客户未留下信息
    // /*LeaveMes-All*/
    // app.get('/way2/leavemes/:pageNum',Admin.adminRequired,Way2.userList);//页面：留言列表
    // app.post('/way2/leavemes/:pageNum',Admin.adminRequired,Way2.userSearch);//页面：留言检索

    /*页面:咨询管理*/
    app.get('/admin/user/finish',Admin.adminRequired,Visit.finish);//JSON：标记完成
    app.get('/chat/:id',Admin.adminRequired,Visit.chat);//页面：聊天框

    app.get('/admin/leavemes/:way/:pageNum',Admin.adminRequired,Visit.userList);//页面：留言列表
    app.post('/admin/leavemes/:way/:pageNum',Admin.adminRequired,Visit.userSearch);//页面：留言检索

    app.get('/admin/way/waylist/:page',Admin.adminRequired,Way.wayList);
    app.get('/admin/way/waynew',Admin.adminRequired,Way.wayNew);
    app.post('/admin/way/new',Admin.adminRequired,Way.new);
    app.post('/admin/way/update',Admin.adminRequired,Way.update);
    app.get('/admin/way/waydetail/:id',Admin.adminRequired,Way.wayDetail);
    app.get('/admin/way/wayupdate/:id',Admin.adminRequired,Way.wayUpdate);

    /*页面：管理员登录*/
    app.get('/admin/login', Admin.login);
    /*JSON：管理员登入登出*/
    app.post('/user/signin', User.signIn);
    app.get('/user/signout', User.signOut);


    app.get('/admin/userlist/:page', Admin.adminRequired, User.userList);//页面：用户列表
    app.get('/admin/usersignup', Admin.adminRequired, User.userSignUp);//页面：用户登录
    app.get('/admin/userdetail/:id', Admin.adminRequired, User.userDetail);//页面：用户详情
    app.get('/admin/userupdate/:id', Admin.adminRequired, User.userUpdate);//页面：用户更新
    app.post('/admin/user/signup', Admin.adminRequired, User.signUp);//JSON：用户注册
    app.post('/admin/user/update', Admin.adminRequired, User.update);//JSON：用户更新
    app.delete('/admin/user/delete', Admin.adminRequired, User.delete);//JSON：用户删除
    app.get('/admin/user/forbidden', Admin.adminRequired, User.forbidden);//JSON：用户禁用

    /*页面：信息提示*/
    app.get('/admin/information/:information', Admin.adminRequired, Admin.information);

    /*Index Test*/
    app.get('/test', Index.test);

    /*404页面*/
    app.get('*', function(req, res){
        res.render('wrongWay', {
            title:'找不到页面',
            err: '请确认是否输入正确的地址'
        })
    });

    /*socket.io*/
    io.on('connection', function (socket) {
        socket.on('message', function (msg) {
            Message.save(msg, function (message) {
                console.log(message);
                io.emit(msg.belong,message);
            });
        });
    })
};
