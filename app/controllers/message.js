const MessageModel = require('../models/message.js');
const UserModel = require('../models/user.js');

/**save聊天信息start*/
exports.save = function (msg, next) {
    let save=new Promise(function(resolve,reject){
        let message = new MessageModel(msg);
        message.save(function (err, message) {
            if (err) {
                reject(err);
            }
            resolve(message);
        })
    });

    let leaveMesPromise= new Promise(function(resolve,reject){
        UserModel
            .findOne({_id: msg.belong})
            .exec(function (err, user) {
                if(user.finish){user.finish=false}
                if(!user.chat){user.chat=true}
                user.save(function (err,user) {
                    if(err){reject(err)}
                    resolve(user)
                })
            })
    });

    let populatePromise=save.then(function(message){
       return new Promise (function(resolve,reject){
           message.populate('from',function(err,message){
               if (err) {
                   reject(err);
               }
               resolve(message)
           });
       })
    });

    Promise.all([populatePromise,leaveMesPromise]).then(function([populate,leaveMes]){
        next(populate)
    });

};
/**save聊天信息end*/

