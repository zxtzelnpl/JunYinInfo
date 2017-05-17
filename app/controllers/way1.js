const UserModel = require('../models/user.js');
const MessageModel = require('../models/message');
const way = 'way1';
const pageSize = 20;

exports.leaveMes = function (req, res) {
    let user;
    let _user = req.body;
    _user.way = way;
    console.log(_user);

    user = new UserModel(_user);
    user.save(function (err, user) {
        if (err) {
            console.log(err)
        }
        req.session.user = user;
        res.json({
            state: 'success',
            user:user
        })
    })
};

exports.userList = function(req,res){
    let pageNum = req.params.pageNum;
    let totalPageNum;
    let totalNum;
    let optFind={level:0};
    UserModel.find(optFind).count(function (err, count) {
        totalPageNum = Math.ceil(count / pageSize);
        UserModel.find(optFind)
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .populate('room', 'title')
            .exec(function (err, users) {
                if (err) {
                    console.log(err);
                }
                res.render('leaveMesList', {
                    title: '留言列表',
                    users: users,
                    totalPageNum: totalPageNum,
                    pageNum:pageNum,
                    totalNum:count
                });
            });
    });
};

exports.chat=function(req,res){
    let userId = req.params.id;

    let promiseMessages = new Promise(function (resolve, reject) {

        let optFind = {belong: userId};
        let optField = ['_id', 'from', 'belong', 'content', 'createAt'];
        let optPopulate = {path: 'from', select: 'nickName -_id'};

        MessageModel
            .find(optFind, optField)
            .sort({_id: -1})
            .populate(optPopulate)
            .exec(function (err, messages) {
                if (err) {
                    reject(err)
                }
                resolve(JSON.stringify(messages));
            });
    });

    promiseMessages
        .then(function (messagesStr) {
            res.render('index', {
                title:'咨询页面',
                messages: messagesStr,
                belongId:userId
            });
        })
        .catch(function (err) {
            res.render('wrongWay', {
                title: '发生错误',
                err: err
            })
        });
};
