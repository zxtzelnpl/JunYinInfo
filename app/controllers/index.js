const MessageModel = require('../models/message');
const ClickCountModel = require('../models/clickCount');
const UserModel = require('../models/user');
const WayModel = require('../models/way');

exports.index = function (req, res) {
    let userId = req.session.user ? req.session.user._id : undefined;
    if (!userId) {
        res.render('index', {
            title: '咨询页面',
            messages: ''
        });
        return;
    }

    let messagesPromise = new Promise(function (resolve, reject) {

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

    let clickCountPromise = new Promise(function (resolve, reject) {
        let clickCount = new ClickCountModel({name: 'count'});
        clickCount.save(function (err, clickCount) {
            if (err) {
                console.log(err)
            }
            resolve(clickCount)
        })
    });

    Promise.all([messagesPromise, clickCountPromise])
        .then(function ([messages,clickCounts]) {
            res.render('index', {
                title: '咨询页面',
                messages: messages
            });
        })
        .catch(function (err) {
            res.render('wrongWay', {
                title: '发生错误',
                err: err
            })
        });

};

exports.test = function (req, res) {
    let id=req.query.id;
    if(id==1){
        WayModel
            .findOne({name: '渠道1'})
            .exec(function (err, way) {
                console.log(way);
                UserModel.update({},{way:way._id},{multi:true})
                    .exec(function(err,results){
                        console.log(results);
                    })
            })
    }
    if(id==2){
        WayModel
            .findOne({name: '渠道2'})
            .exec(function (err, way) {
                console.log(way);
                UserModel.update({},{way:way._id},{multi:true})
                    .exec(function(err,results){
                        console.log(results);
                    })
            })
    }
};
