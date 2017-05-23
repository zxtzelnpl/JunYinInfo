const UserModel = require('../models/user.js');
const MessageModel = require('../models/message');
const ClickCountModel = require('../models/clickCount');
const way = 'admin';
const pageSize = 15;

exports.userList = function (req, res) {
    let pageNum = req.params.pageNum;
    let totalPageNum;
    let totalNum;

    let clickCount = new Promise(function (resolve, reject) {
        ClickCountModel.find({}).count(function (err, count) {
            if (err) {
                reject(err)
            }
            resolve(count);
        })
    });

    let listCount = new Promise(function (resolve, reject) {
        let optFind = {level: 0};
        UserModel.find(optFind).count(function (err, count) {
            if (err) {
                reject(err)
            }
            resolve(count);
        });
    });

    let lists = listCount.then(function (count) {
        let optFind = {level: 0};
        return new Promise(function (resolve, reject) {
            totalPageNum = Math.ceil(count / pageSize);
            UserModel
                .find(optFind)
                .sort({updateAt: -1})
                .skip((pageNum - 1) * pageSize)
                .limit(pageSize)
                .populate('room', 'title')
                .exec(function (err, users) {
                    if (err) {
                        reject(err)
                    }
                    resolve(users);
                });
        })
    });

    let chatCount = new Promise(function (resolve, reject) {
        let optFind = {level: 0,chat:true};
        UserModel.find(optFind).count(function (err, count) {
            if (err) {
                reject(err)
            }
            resolve(count);
        })
    });

    Promise
        .all([clickCount, listCount, lists, chatCount])
        .then(function (results) {
            res.render('leaveMesList', {
                title: '留言列表',
                way: way,
                users: results[2],
                totalPageNum: totalPageNum,
                pageNum: pageNum,
                totalNum: totalNum,
                clickCount: results[0],
                listCount: results[1],
                chatCount: results[3]
            })
            ;
        })
        .catch(function (err) {
            console.log(err);
        })
    ;
};

exports.userSearch = function (req, res) {
    let pageNum = req.params.pageNum;
    let totalPageNum;
    let totalNum;

    let timeStart = new Date(req.body.search['timeStart']);
    let timeEnd = new Date(req.body.search['timeEnd']);



    let clickCount = new Promise(function (resolve, reject) {
        let optFind = {
            createAt: {
                "$gte": timeStart,
                "$lt": timeEnd
            }
        };
        ClickCountModel
            .find(optFind)
            .count(function (err, count) {
                if (err) {
                    reject(err)
                }
                resolve(count);
            })
    });

    let listCount = new Promise(function (resolve, reject) {
        let optFind = {
            level: 0,
            createAt: {
                "$gte": timeStart,
                "$lt": timeEnd
            }
        };
        UserModel.find(optFind).count(function (err, count) {
            if (err) {
                reject(err)
            }
            resolve(count);
        });
    });

    let lists = listCount.then(function (count) {
        let optFind = {
            level: 0,
            createAt: {
                "$gte": timeStart,
                "$lt": timeEnd
            }
        };
        return new Promise(function (resolve, reject) {
            totalPageNum = Math.ceil(count / pageSize);
            UserModel.find(optFind)
                .skip((pageNum - 1) * pageSize)
                .limit(pageSize)
                .exec(function (err, users) {
                    if (err) {
                        reject(err)
                    }
                    resolve(users);
                });
        })
    });

    let chatCount = new Promise(function (resolve, reject) {
        UserModel.find({
            level: 0,
            chat: true,
            createAt: {
                "$gte": timeStart,
                "$lt": timeEnd
            }
        }).count(function (err, count) {
            if (err) {
                reject(err)
            }
            resolve(count);
        })
    });

    Promise
        .all([clickCount, listCount, lists, chatCount])
        .then(function (results) {
            res.render('searchMesList', {
                title: '留言列表',
                way: way,
                timeStart: req.body.search['timeStart'],
                timeEnd: req.body.search['timeEnd'],
                users: results[2],
                totalPageNum: totalPageNum,
                pageNum: pageNum,
                totalNum: totalNum,
                clickCount: results[0],
                listCount: results[1],
                chatCount: results[3]
            })
            ;
        })
        .catch(function (err) {
            console.log(err);
        })
    ;
};

exports.chat = function (req, res) {
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
                title: '咨询页面',
                messages: messagesStr,
                belongId: userId
            });
        })
        .catch(function (err) {
            res.render('wrongWay', {
                title: '发生错误',
                err: err
            })
        });
};

exports.finish = function (req, res) {
    let _id = req.query.id;
    UserModel
        .findOne({_id: _id})
        .exec(function (err, user) {
            console.log(user);
            user.finish = true;
            user.save(function () {
                res.json({
                    state: 'success'
                })
            })
        })
};

exports.autoReplay=function(req,res){
    let way=req.query.way;
    res.json({
        state:'success',
        content:'这个是一个自动回复'+way
    })
};
