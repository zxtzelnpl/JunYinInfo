const UserModel = require('../models/user.js');
const MessageModel = require('../models/message');
const ClickCountModel = require('../models/clickCount');
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
            user: user
        })
    })
};

exports.direct = function (req, res) {
    let user;

    let numPromise = new Promise(function (resolve, reject) {
        UserModel.find({phone: {$exists: false}}).count(function (err, count) {
            if (err) {
                reject(err)
            }
            resolve(count);
        })
    });

    numPromise.then(function (count) {
        let _user = {
            nickName: '匿名' + count
        };
        _user.way = way;

        user = new UserModel(_user);
        user.save(function (err, user) {
            if (err) {
                console.log(err)
            }
            req.session.user = user;
            res.json({
                state: 'success',
                user: user
            })
        })
    })
        .catch(function (err) {
            console.log(err);
        })
};

exports.userList = function (req, res) {
    let pageNum = req.params.pageNum;
    let totalPageNum;
    let totalNum;

    let optFind = {level: 0};

    let clickCount = new Promise(function (resolve, reject) {
        ClickCountModel.find({}).count(function (err, count) {
            if (err) {
                reject(err)
            }
            resolve(count);
        })
    });

    let listCount = new Promise(function (resolve, reject) {
        UserModel.find(optFind).count(function (err, count) {
            if (err) {
                reject(err)
            }
            resolve(count);
        });
    });

    let lists = listCount.then(function (count) {
        return new Promise(function (resolve, reject) {
            totalPageNum = Math.ceil(count / pageSize);
            UserModel.find(optFind)
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
        UserModel.find({chat: true}).count(function (err, count) {
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

    let optFind = {
        level: 0,
        createAt: {
            "$gte": timeStart,
            "$lt": timeEnd
        }
    };

    let clickCount = new Promise(function (resolve, reject) {
        ClickCountModel.find({
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

    let listCount = new Promise(function (resolve, reject) {
        UserModel.find(optFind).count(function (err, count) {
            if (err) {
                reject(err)
            }
            resolve(count);
        });
    });

    let lists = listCount.then(function (count) {
        return new Promise(function (resolve, reject) {
            totalPageNum = Math.ceil(count / pageSize);
            UserModel.find(optFind)
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
        UserModel.find({
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
