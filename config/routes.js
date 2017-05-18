const multiparty=require('connect-multiparty');

const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
const Message = require('../app/controllers/message');
const Admin = require('../app/controllers/admin');
const Way1 = require('../app/controllers/way1');

const UserModule = require('../app/models/user.js');

module.exports = function (app, io) {
    /*pre handle user*/
    app.use(function (req, res, next) {
        app.locals.user = req.session.user;
        next();
    });

    /*Way1*/
    app.get('/', Index.index);
    app.get('/way1/chat/:id',Way1.chat);
    app.post('/way1/leaveMes', Way1.leaveMes);
    app.post('/way1/direct', Way1.direct);
    app.get('/test', Index.test);

    /*LeaveMes*/
    app.get('/admin/leavemes/:pageNum',Admin.adminRequired,Way1.userList);
    app.post('/admin/leavemes/:pageNum',Admin.adminRequired,Way1.userSearch);

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

    /*Lost*/
    app.get('/admin/usersearch', Admin.adminRequired, User.userSearch);
    app.post('/admin/userquery/:page', Admin.adminRequired, User.userQuery);
    app.get('/admin/messagelist/:page', Admin.adminRequired, Message.messageList);
    app.get('/admin/messagesearch', Admin.adminRequired,Message.messageSearch);
    app.post('/admin/messagequery/:page', Admin.adminRequired, Message.query);

    /*Information*/
    app.get('/admin/information/:information', Admin.adminRequired, Admin.information);

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
