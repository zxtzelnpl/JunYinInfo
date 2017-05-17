const MessageModel = require('../models/message');

exports.index = function (req, res) {
    let userId = req.session.user ? req.session.user._id : undefined;
    if(!userId){
        res.render('index', {
            title:'咨询页面',
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

    promiseMessages
        .then(function (messagesStr) {
            res.render('index', {
                title:'咨询页面',
                messages: messagesStr
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
