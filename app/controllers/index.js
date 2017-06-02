const MessageModel = require('../models/message');
const UserModel = require('../models/user');
const WayModel = require('../models/way');
const Report = require('../../report/report');

exports.index = function (req, res) {
    let _id = req.params.id;
    let userId = req.session.user ? req.session.user._id : undefined;

    let messagesPromise = new Promise(function (resolve, reject) {

        let findOpt = {belong: userId};
        let fieldOpt = ['_id', 'from', 'belong', 'content', 'createAt'];
        let populationOpt = {path: 'from', select: 'nickName -_id'};

        MessageModel
            .find(findOpt, fieldOpt)
            .sort({_id: -1})
            .populate(populationOpt)
            .exec(function (err, messages) {
                if (err) {
                    reject(err)
                }
                resolve(JSON.stringify(messages));
            });
    });

    let wayPromise = new Promise(function (resolve, reject) {
        WayModel
            .findOne({_id: _id})
            .exec(function (err, way) {
                if (err) {
                    reject(err)
                }
                resolve(way);
            })
    });
    let clickCountPromise = wayPromise.then(function (way) {
        return new Promise(function (resolve, reject) {
            way.clickCount++;
            way.save(function (err, way) {
                if (err) {
                    reject(err)
                }
                resolve(way)
            })
        })
    });

    Promise.all([messagesPromise, wayPromise, clickCountPromise])
        .then(function ([messages, way]) {
            if (!userId) {
                res.render('index', {
                    title: '咨询页面',
                    messages: '',
                    way
                });
            } else {
                res.render('index', {
                    title: '咨询页面',
                    messages,
                    way
                });
            }

        })
        .catch(function (err) {
            Report.errPage(res, err);
        });

};

exports.leaveMes = function (req, res) {
    let _user = req.body;
    let user = new UserModel(_user);

    user.save(function (err, user) {
        if (err) {
            Report.errPage(res, err)
        }
        req.session.user = user;
        res.json({
            state: 'success',
            user: user
        })
    })
};

exports.direct = function (req, res) {
    let _user = req.body;

    let numPromise = new Promise(function (resolve, reject) {
        UserModel.find({phone: {$exists: false}}).count(function (err, count) {
            if (err) {
                reject(err)
            }
            resolve(count);
        })
    });

    let savePromise = numPromise
        .then(function (count) {
            return new Promise(function (resolve, reject) {
                _user.nickName = '匿名' + count;
                user = new UserModel(_user);
                user.save(function (err, user) {
                    if (err) {
                        reject(err)
                    }
                    resolve(user)
                })
            });
        });

    savePromise
        .then(function (user) {
            req.session.user = user;
            res.json({
                state: 'success',
                user: user
            })
        })
        .catch(function (err) {
            Report.errPage(res, err);
        })
};


exports.test = function (req, res) {
    let id = req.query.id;
    if (id == 1) {
        WayModel
            .findOne({name: '渠道1'})
            .exec(function (err, way) {
                console.log(way);
                UserModel.update({}, {way: way._id}, {multi: true})
                    .exec(function (err, results) {
                        console.log(results);
                    })
            })
    }
    if (id == 2) {
        WayModel
            .findOne({name: '渠道2'})
            .exec(function (err, way) {
                console.log(way);
                UserModel.update({}, {way: way._id}, {multi: true})
                    .exec(function (err, results) {
                        console.log(results);
                    })
            })
    }
};
