const UserModel = require('../models/user.js');
const MessageModel = require('../models/message.js');
const WayModel=require('../models/way.js');
const pageSize = 20;
const optFind={'level':{$gt:999}};

exports.userList = function (req, res) {
    let pageNum = req.params.page;
    let totalPageNum;
    UserModel.find(optFind).count(function (err, count) {
        totalPageNum = Math.ceil(count / pageSize);
        UserModel.find(optFind)
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .populate('way','name')
            .exec(function (err, users) {
                if (err) {
                    console.log(err);
                }
                res.render('userList', {
                    title: '管理用户列表'
                    , users: users
                    , pageCount: totalPageNum
                });
            });
    });
};

exports.userSignUp = function (req, res) {
    let waysPromise=new Promise(function(resolve,reject){
        WayModel
            .find({})
            .exec(function(err,ways){
                if(err){reject(err)}
                resolve(ways);
            })
    });

    waysPromise.then(function(ways  ){
        res.render('userSignUp', {
            title: '用户注册',
            ways
        });
    });


};

exports.userDetail = function (req, res) {
    let _id = req.params.id;
    UserModel
        .findOne({_id: _id})
        .populate('way','name')
        .exec(function (err, user) {
            if(err){console.log(err)}
            if(user){
                res.render('userDetail', {
                    user: user,
                    title: user.name + '的用户信息'
                });
            }else{
                res.render('wrongWay',{
                    title:'错误',
                    err:'找不到所需要的用户'
                })
            }
        })
};

exports.userUpdate = function (req, res) {
    let _id = req.params.id;
    let waysPromise=new Promise(function(resolve,reject){
        WayModel
            .find({})
            .exec(function(err,ways){
                if(err){reject(err)}
                resolve(ways);
            })
    });
    let userPromise=new Promise(function(resolve,reject){
        UserModel
            .findOne({_id: _id})
            .exec(function (err, user){
                if(err){reject(err)}
                resolve(user)
            })
    });

    Promise
        .all([waysPromise,userPromise])
        .then(function([ways,user]){
            console.log(ways);
            res.render('userUpdate', {
                title: user.name + '信息修改',
                user,
                ways
            });
        })
        .catch(function(err){

        });

};

exports.signUp = function (req, res) {
    let user;
    let _user = req.body.user;
    user = new UserModel(_user);
    user.save(function (err, user) {
        if (err) {
            console.log(err)
        }
        res.redirect('/admin/userdetail/' + user._id)
    })
};

exports.update = function (req, res) {
    let _user = req.body.user;
    let id = _user._id;
    delete _user._id;
    UserModel
        .where('_id').ne(id)
        .or([{'name': _user.name}, {'phone': _user.phone}])
        .exec(function (err, users) {
            if (err) {
                console.log(err);
            }
            if (users.length === 0) {
                UserModel.findByIdAndUpdate(id, {$set: _user}, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    res.redirect('/admin/userdetail/' + id)
                });
            } else {
                if (users[0].name === _user.name) {
                    res.redirect('/admin/information/name')
                } else if (users[0].phone == _user.phone) {
                    res.redirect('/admin/information/phone')
                }
            }
        });
};

exports.forbidden = function (req, res) {
    let _id = req.query.id;
    UserModel
        .findOne({_id: _id})
        .exec(function (err, user) {
            console.log(user);
            user.forbidden = !user.forbidden;
            user.save(function () {
                res.json({
                    state: 'success',
                    forbidden: user.forbidden
                })
            })
        })
};

exports.delete = function (req, res) {
    let id = req.query.id;
    MessageModel
        .remove({from:id},function(err){
            if(err){console.log(err)}
            UserModel.findByIdAndRemove(id, function (err) {
                if (err) {
                    console.log(err)
                }
                res.json({
                    state: 'success'
                })
            })
        })
};

exports.signIn = function (req, res) {
    let _user = req.body;
    let name = _user.name;
    let password = _user.password;

    UserModel.findOne({name: name}, function (err, user) {
        if (err) {
            console.log(err)
        }

        if (!user) {
            return res.json({
                state: 'fail'
                , reason: 'no name'
            })
        }

        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                console.log(err)
            }
            if (isMatch) {
                req.session.user = user;
                return res.json({
                    state: 'success'
                    , name: user.name
                });
            }
            else {
                return res.json({
                    state: 'fail'
                    , reason: 'password wrong'
                })
            }
        })
    })
};

exports.signOut = function (req, res) {
    delete req.session.user;
    return res.json({
        state: 'success'
    })
};
