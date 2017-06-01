const UserModel = require('../models/user.js');
const MessageModel = require('../models/message');
const WayModel = require('../models/way');
const pageSize = 12;

exports.userList = function (req, res) {
    let pageNum = req.params.pageNum;
    let way = req.params.way;
    let totalPageNum;
    let totalNum;
    let findOpt = {level: 0};
    let wayOpt = {};
    if (way !== 'all') {
        findOpt.way = way;
        wayOpt._id = way;
    }

    let clickCountPromise = new Promise(function (resolve, reject) {
        WayModel
            .find(wayOpt)
            .exec(function (err, ways) {
                let clickCount = 0;
                if (err) {
                    reject(err)
                }
                ways.forEach(function (way, index) {
                    clickCount += way.clickCount;
                });
                resolve(clickCount);
            })
    });

    let listCountPromise = new Promise(function (resolve, reject) {
        UserModel
            .find(findOpt)
            .count(function (err, count) {
                if (err) {
                    reject(err)
                }
                resolve(count);
            });
    });

    let listsPromise = listCountPromise.then(function (count) {
        return new Promise(function (resolve, reject) {
            totalPageNum = Math.ceil(count / pageSize);
            UserModel
                .find(findOpt)
                .sort({updateAt: -1})
                .skip((pageNum - 1) * pageSize)
                .limit(pageSize)
                .populate('way', 'name')
                .exec(function (err, users) {
                    if (err) {
                        reject(err)
                    }
                    resolve(users);
                });
        })
    });

    let chatCountPromise = new Promise(function (resolve, reject) {
        let _findOpt = Object.assign({chat: true}, findOpt);
        UserModel
            .find(_findOpt)
            .count(function (err, count) {
                if (err) {
                    reject(err)
                }
                resolve(count);
            })
    });

    Promise
        .all([clickCountPromise, listCountPromise, listsPromise, chatCountPromise])
        .then(function ([clickCount, listCount, lists, chatCount]) {
            res.render('leaveMesList', {
                title: '留言列表',
                way: way,
                users: lists,
                totalPageNum: totalPageNum,
                pageNum: pageNum,
                totalNum: totalNum,
                clickCount: clickCount,
                listCount: listCount,
                chatCount: chatCount
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
    let way = req.params.way;
    let totalPageNum;
    let totalNum;
    let findOpt = {
        level: 0
    };
    console.log("req.body.search['timeStart']");
    console.log(req.body.search['timeStart']);
    console.log("req.body.search['timeEnd']");
    console.log(req.body.search['timeEnd']);
    if(req.body.search['timeStart']||req.body.search['timeEnd']){
        findOpt.createAt={};
    }
    if(req.body.search['timeStart']){
        findOpt.createAt.$gte=new Date(req.body.search['timeStart']);
    }
    if(req.body.search['timeEnd']){
        findOpt.createAt.$lt=new Date(req.body.search['timeEnd']);
    }
    let wayOpt = {};
    if (way !== 'all') {
        findOpt.way = way;
        wayOpt._id = way;
    }

    let clickCountPromise = new Promise(function (resolve, reject) {
        WayModel
            .find(wayOpt)
            .exec(function (err, ways) {
                let clickCount = 0;
                if (err) {
                    reject(err)
                }
                ways.forEach(function (way, index) {
                    clickCount += way.clickCount;
                });
                resolve(clickCount);
            })
    });

    let listCountPromise = new Promise(function (resolve, reject) {
        UserModel.find(findOpt).count(function (err, count) {
            if (err) {
                reject(err)
            }
            resolve(count);
        });
    });

    let listsPromise = listCountPromise.then(function (count) {
        return new Promise(function (resolve, reject) {
            totalPageNum = Math.ceil(count / pageSize);
            UserModel.find(findOpt)
                .skip((pageNum - 1) * pageSize)
                .limit(pageSize)
                .populate('way', 'name')
                .exec(function (err, users) {
                    if (err) {
                        reject(err)
                    }
                    resolve(users);
                });
        })
    });

    let chatCountPromise = new Promise(function (resolve, reject) {
        let _findOpt = Object.assign({chat: true}, findOpt);
        UserModel
            .find(_findOpt)
            .count(function (err, count) {
                if (err) {
                    reject(err)
                }
                resolve(count);
            })
    });

    Promise
        .all([clickCountPromise, listCountPromise, listsPromise, chatCountPromise])
        .then(function ([clickCount, listCount, lists, chatCount]) {
            res.render('searchMesList', {
                title: '留言列表',
                way: way,
                timeStart: req.body.search['timeStart'],
                timeEnd: req.body.search['timeEnd'],
                users: lists,
                totalPageNum: totalPageNum,
                pageNum: pageNum,
                totalNum: totalNum,
                clickCount: clickCount,
                listCount: listCount,
                chatCount: chatCount
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
            user.finish = true;
            user.save(function () {
                res.json({
                    state: 'success'
                })
            })
        })
};

exports.autoReplay = function (req, res) {
    let way = req.query.way;
    res.json({
        state: 'success',
        content: '这个是一个自动回复' + way
    })
};
