const multiparty=require('connect-multiparty');

const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
const Message = require('../app/controllers/message');
const Admin = require('../app/controllers/admin');
const Visit = require('../app/controllers/visit');
const Way1 = require('../app/controllers/way1');
const Way2 = require('../app/controllers/way2');

const UserModule = require('../app/models/user.js');

module.exports = function (app, io) {
    /*pre handle user*/
    app.use(function (req, res, next) {
        app.locals.user = req.session.user;
        next();
    });

    /*自动回复*/
    app.get('/autoplay',Visit.autoReplay);

    /*Way1*/
    app.get('/way/way1', Way1.index);
    app.post('/way/leaveMes/way1', Way1.leaveMes);
    app.post('/way/direct/way1', Way1.direct);
    /*LeaveMes-All*/
    app.get('/way1/leavemes/:pageNum',Admin.adminRequired,Way1.userList);
    app.post('/way1/leavemes/:pageNum',Admin.adminRequired,Way1.userSearch);

    /*Way2*/
    app.get('/way/way2', Way2.index);
    app.post('/way/leaveMes/way2', Way2.leaveMes);
    app.post('/way/direct/way2', Way2.direct);
    /*LeaveMes-All*/
    app.get('/way2/leavemes/:pageNum',Admin.adminRequired,Way2.userList);
    app.post('/way2/leavemes/:pageNum',Admin.adminRequired,Way2.userSearch);

    /*咨询页面管理*/
    app.get('/admin/user/finish',Admin.adminRequired,Visit.finish);
    app.get('/chat/:id',Admin.adminRequired,Visit.chat);

    /*LeaveMes-All*/
    app.get('/admin/leavemes/:pageNum',Admin.adminRequired,Visit.userList);
    app.post('/admin/leavemes/:pageNum',Admin.adminRequired,Visit.userSearch);


    /*User*/
    app.post('/user/signin', User.signIn);
    app.get('/user/signout', User.signOut);

    /*Message*/
    app.get('/message/getmessage',Message.getMessage);

    /*Admin*/
    app.get('/admin/login', Admin.admin);

    /*Admin-User*/
    app.get('/admin/userlist/:page', Admin.adminRequired, User.userList);
    app.get('/admin/usersignup', Admin.adminRequired, User.userSignUp);
    app.get('/admin/userdetail/:id', Admin.adminRequired, User.userDetail);
    app.get('/admin/userupdate/:id', Admin.adminRequired, User.userUpdate);
    app.post('/admin/user/signup', Admin.adminRequired, User.signUp);
    app.post('/admin/user/update', Admin.adminRequired, User.update);
    app.delete('/admin/user/delete', Admin.adminRequired, User.delete);
    app.get('/admin/user/forbidden', Admin.adminRequired, User.forbidden);

    /*Information*/
    app.get('/admin/information/:information', Admin.adminRequired, Admin.information);

    /*Lost*/
    app.get('/admin/usersearch', Admin.adminRequired, User.userSearch);
    app.post('/admin/userquery/:page', Admin.adminRequired, User.userQuery);
    app.get('/admin/messagelist/:page', Admin.adminRequired, Message.messageList);
    app.get('/admin/messagesearch', Admin.adminRequired,Message.messageSearch);
    app.post('/admin/messagequery/:page', Admin.adminRequired, Message.query);

    /*Index*/
    app.get('/test', Index.test);



    /*socket.io*/
    io.on('connection', function (socket) {
        if(socket.request.session.user&&socket.request.session.user.level=='1000'){
            let ADMIN=true;
        }

        socket.on('message', function (msg) {
            Message.save(msg, function (message) {
                console.log(message);
                io.emit(msg.belong,message);
            });
        });



        socket.on('delMessage',function(msg){
            Message.delMessage(msg,user,function(message){
                io.to(room).emit('delMessage',message);
                io.to('admin').emit('delMessage',message);
            })
        });

    })
};
