const UserModel = require('../models/user.js');
const MessageModel = require('../models/message');
const ClickCountModel = require('../models/clickCount');
const way = 'way2';
const pageSize = 15;

exports.index = function (req, res) {
    let userId = req.session.user ? req.session.user._id : undefined;
    if (!userId) {
        res.render('index', {
            title: '咨询页面',
            messages: '',
            way:way
        });
        return;
    }

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

    let promiseClickCount = new Promise(function (resolve, reject) {
        let clickCount = new ClickCountModel({name: way});
        clickCount.save(function (err, clickCount) {
            if (err) {
                console.log(err)
            }
            resolve(clickCount)
        })
    });

    Promise.all([promiseMessages, promiseClickCount])
        .then(function (results) {
            res.render('index', {
                title: '咨询页面',
                messages: results[0],
                way:way
            });
        })
        .catch(function (err) {
            res.render('wrongWay', {
                title: '发生错误',
                err: err
            })
        });

};


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

    let clickCount = new Promise(function (resolve, reject) {
        let optFind = {
            name: way
        };
        ClickCountModel.find(optFind).count(function (err, count) {
            if (err) {
                reject(err)
            }
            resolve(count);
        })
    });

    let listCount = new Promise(function (resolve, reject) {
        let optFind = {
            level: 0,
            way: way
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
            way: way
        };
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
        let optFind = {
            level: 0,
            chat: true,
            way: way
        };
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
        ClickCountModel.find({
            name: way,
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
        let optFind = {
            level: 0,
            way: way,
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
            way: way,
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
        let optFind = {
            chat: true,
            level: 0,
            way: way,
            createAt: {
                "$gte": timeStart,
                "$lt": timeEnd
            }
        };
        UserModel
            .find(optFind)
            .count(function (err, count) {
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
