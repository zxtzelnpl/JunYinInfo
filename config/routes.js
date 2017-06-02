const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
const Message = require('../app/controllers/message');
const Admin = require('../app/controllers/admin');
const Visit = require('../app/controllers/visit');
const Excel = require('../app/controllers/excel');
const Way = require('../app/controllers/way');
const NotFound=require('../app/controllers/notFound');

module.exports = function (app, io) {
    /*请求预处理*/
    app.use(function (req, res, next) {
        app.locals.user = req.session.user;
        next();
    });

    /*访问页面*/
    app.get('/way/:id', Index.index);//页面，客服页面
    app.post('/way/leaveMes', Index.leaveMes);//如果客人留下信息
    app.post('/way/direct', Index.direct);//如果客人不留下信息

    /*管理员登录*/
    app.get('/admin/login', Admin.login);//PAGE

    /*用户管理*/
    app.post('/user/signin', User.signIn);//JSON：管理员登入
    app.get('/user/signout', User.signOut);//JSON：管理员登出
    app.get('/admin/userlist/:page', Admin.adminRequired, User.userList);//PAGE：用户列表
    app.get('/admin/usersignup', Admin.adminRequired, User.userSignUp);//PAGE：用户注册
    app.get('/admin/userdetail/:id', Admin.adminRequired, User.userDetail);//PAGE：用户详情
    app.get('/admin/userupdate/:id', Admin.adminRequired, User.userUpdate);//PAGE：用户更新
    app.post('/admin/user/signup', Admin.adminRequired, User.signUp);//JSON：用户注册
    app.post('/admin/user/update', Admin.adminRequired, User.update);//JSON：用户更新
    app.delete('/admin/user/delete', Admin.adminRequired, User.delete);//JSON：用户删除
    app.get('/admin/user/forbidden', Admin.adminRequired, User.forbidden);//JSON：用户禁用

    /*聊天管理*/
    app.get('/admin/leavemes/:way/:pageNum', Admin.adminRequired, Visit.userList);//PAGE：留言列表
    app.post('/admin/leavemes/:way/:pageNum', Admin.adminRequired, Visit.userSearch);//PAGE：留言检索
    app.get('/excel/:way', Admin.adminRequired, Excel.excel);//EXCEL:下载内容
    app.get('/admin/user/finish', Admin.adminRequired, Visit.finish);//JSON：标记完成
    app.get('/chat/:id', Admin.adminRequired, Visit.chat);//PAGE：聊天框

    /*渠道管理*/
    app.get('/admin/way/waylist/:page', Admin.adminRequired, Way.wayList);//PAGE：渠道列表
    app.get('/admin/way/waynew', Admin.adminRequired, Way.wayNew);//PAGE:新建渠道
    app.get('/admin/way/waydetail/:id', Admin.adminRequired, Way.wayDetail);//PAGE:渠道详情
    app.get('/admin/way/wayupdate/:id', Admin.adminRequired, Way.wayUpdate);//PAGE:渠道更新
    app.post('/admin/way/new', Admin.adminRequired, Way.new);//渠道新建
    app.post('/admin/way/update', Admin.adminRequired, Way.update);//渠道更新

    /*页面：信息提示*/
    app.get('/admin/information/:information', Admin.adminRequired, Admin.information);//PAGE：管理员信息提示

    /*Index Test*/
    app.get('/test', Index.test);

    /*404页面*/
    app.get('*', NotFound.notFound);

    /*聊天逻辑*/
    io.on('connection', function (socket) {
        socket.on('message', function (msg) {
            Message.save(msg, function (message) {
                io.emit(msg.belong, message);
            });
        });
    })
};
