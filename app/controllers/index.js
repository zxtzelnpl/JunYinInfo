const MessageModel = require('../models/message');
const ClickCountModel = require('../models/clickCount');

exports.index = function (req, res) {
    let userId = req.session.user ? req.session.user._id : undefined;
    if (!userId) {
        res.render('index', {
            title: '咨询页面',
            messages: ''
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
        let clickCount = new ClickCountModel({name: 'count'});
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
                messages: results[0]
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
    // RoomModel
    //     .findOne({name: 'shanghai'})
    //     .exec(function (err, room) {
    //         MessageModel.update({},{room:room._id},{multi:true})
    //             .exec(function(err,results){
    //                 console.log(results);
    //             })
    //     })
};
