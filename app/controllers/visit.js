const UserModel = require('../models/user.js');
const MessageModel = require('../models/message');
const WayModel = require('../models/way');
const Report = require('../../report/report');
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
                if (!ways || ways.length === 0) {
                    reject('找不到管理员所负责的渠道')
                } else {
                    ways.forEach(function (way) {
                        clickCount += way.clickCount;
                    });
                    resolve(clickCount);
                }
            })
    });

    let listCountPromise = new Promise(function (resolve, reject) {
        UserModel
            .find(findOpt)
            .count(function (err, count) {
                if (err) {
                    reject(err)
                }
                totalPageNum = Math.ceil(count / pageSize);
                if (pageNum > totalPageNum) {
                    reject('请选择正确的页数')
                }
                resolve(count);
            });
    });

    let listsPromise = listCountPromise.then(function (count) {
        return new Promise(function (resolve, reject) {
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
            Report.errPage(res, err);
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
    if (req.body.search['timeStart'] || req.body.search['timeEnd']) {
        findOpt.createAt = {};
    }
    if (req.body.search['timeStart']) {
        findOpt.createAt.$gte = new Date(req.body.search['timeStart']);
    }
    if (req.body.search['timeEnd']) {
        findOpt.createAt.$lt = new Date(req.body.search['timeEnd']);
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
                if (!ways || ways.length === 0) {
                    reject('找不到管理员所负责的渠道')
                } else {
                    ways.forEach(function (way) {
                        clickCount += way.clickCount;
                    });
                    resolve(clickCount);
                }

            })
    });

    let listCountPromise = new Promise(function (resolve, reject) {
        UserModel.find(findOpt).count(function (err, count) {
            if (err) {
                reject(err)
            }
            totalPageNum = Math.ceil(count / pageSize);
            if (pageNum > totalPageNum) {
                reject('请选择正确的页数')
            }
            resolve(count);
        });
    });

    let listsPromise = listCountPromise.then(function (count) {
        return new Promise(function (resolve, reject) {
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
            Report.errPage(res, err);
        })
    ;
};

exports.chat = function (req, res) {
    let userId = req.params.id;

    let promiseMessages = new Promise(function (resolve, reject) {

        let optFind = {belong: userId};
        let optField = ['_id', 'from', 'belong', 'content', 'createAt'];
        let optPopulate = {path: 'from', select: 'nickName'};

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

    let userPromise=new Promise(function(resolve,reject){
        UserModel
            .findOne({_id:userId})
            .exec(function(err,user){
                if(err){reject(err)}
                resolve(user)
            })
    });

    let wayPromise=userPromise.then(function(user){
        return new Promise(function(resolve,reject){
            let _id=user.way;
            console.log(_id);
            WayModel
                .findOne({_id:_id})
                .exec(function(err,way){
                    if(err){reject(err)}
                    console.log(way);
                    resolve(way);
                })
        });
    });

    Promise
        .all([promiseMessages,userPromise,wayPromise])
        .then(function ([messagesStr,user,way]) {
            console.log(way);
            res.render('index', {
                title: '咨询-'+user.nickName,
                messages: messagesStr,
                belongId: userId,
                way:way
            });
        })
        .catch(function (err) {
            Report.errPage(res, err);
        });
};

exports.finish = function (req, res) {
    let userPromise = new Promise(function (resolve, reject) {
        let _id = req.query.id;
        UserModel
            .findOne({_id: _id})
            .exec(function (err, user) {
                if (err) {
                    reject(err)
                }
                resolve(user)
            })
    });
    let savePromise = userPromise.then(function (user) {
        return new Promise(function (resolve, reject) {
            user.finish = true;
            user.save(function (err) {
                if (err) {
                    reject(err)
                }
                resolve(true)
            })
        })
    });
    savePromise
        .then(function (flag) {
            if (flag) {
                res.json({
                    state: 'success'
                })
            }
        })
        .catch(function (err) {
            Report.errJSON(res, err)
        });
};
