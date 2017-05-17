const MessageModel = require('../models/message');
const PageSize = 30;

exports.index = function (req, res) {
    let promiseMessages = new Promise(function (resolve, reject) {
        let userId = req.session.user ? req.session.user._id : undefined;
        let optFind = {from: userId};
        let optField = ['_id', 'from', 'beLong', 'content', 'createAt'];
        let optPopulate1 = {path: 'from', select: 'name -_id'};
        let optPopulate2 = {path: 'beLong', select: 'name -_id'};

        MessageModel
            .find(optFind, optField)
            .sort({_id: -1})
            .limit(PageSize)
            .populate(optPopulate1)
            .populate(optPopulate2)
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
