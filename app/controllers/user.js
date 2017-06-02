const UserModel = require('../models/user.js');
const MessageModel = require('../models/message.js');
const WayModel = require('../models/way.js');
const Report = require('../../report/report');
const pageSize = 20;
const optFind = {'level': {$gt: 999}};

exports.userList = function (req, res) {
    let countPromise = new Promise(function (resolve, reject) {
        let totalPageNum;
        UserModel
            .find(optFind)
            .count(function (err, count) {
                if (err) {
                    reject(err)
                }else{
                    totalPageNum = Math.ceil(count / pageSize);
                    resolve(totalPageNum);
                }
            })
    });
    let usersPromise = new Promise(function (resolve, reject) {
        let pageNum = req.params.page;
        UserModel.find(optFind)
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .populate('way', 'name')
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                }
                resolve(users);
            });
    });
    Promise
        .all([countPromise, usersPromise])
        .then(function ([totalPageNum, users]) {
            res.render('userList', {
                title: '管理用户列表'
                , users: users
                , pageCount: totalPageNum
            });
        })
        .catch(function (err) {
            Report.errPage(res, err);
        })

};

exports.userSignUp = function (req, res) {
    let waysPromise = new Promise(function (resolve, reject) {
        WayModel
            .find({})
            .exec(function (err, ways) {
                if (err) {
                    reject(err)
                }
                resolve(ways);
            })
    });

    waysPromise
        .then(function (ways) {
            res.render('userSignUp', {
                title: '用户注册',
                ways
            });
        })
        .catch(function (err) {
            Report.errPage(res, err);
        })
    ;


};

exports.userDetail = function (req, res) {
    let userPromise = new Promise(function (resolve, reject) {
        let _id = req.params.id;
        UserModel
            .findOne({_id: _id})
            .populate('way', 'name')
            .exec(function (err, user) {
                if (err) {
                    reject(err)
                }
                if (!user) {
                    reject('找不到该用户')
                }
                resolve(user)
            })
    });
    userPromise
        .then(function (user) {
            res.render('userDetail', {
                user0: user,
                title: user.name + '的用户信息'
            });
        })
        .catch(function (err) {
            Report.errPage(res, err);
        })
    ;
};

exports.userUpdate = function (req, res) {
    let _id = req.params.id;
    let waysPromise = new Promise(function (resolve, reject) {
        WayModel
            .find({})
            .exec(function (err, ways) {
                if (err) {
                    reject(err)
                }
                resolve(ways);
            })
    });
    let userPromise = new Promise(function (resolve, reject) {
        UserModel
            .findOne({_id: _id})
            .exec(function (err, user) {
                if (err) {
                    reject(err)
                }
                if (!user) {
                    reject('找不到该用户')
                }
                resolve(user)
            })
    });

    Promise
        .all([waysPromise, userPromise])
        .then(function ([ways, user]) {
            console.log(ways);
            res.render('userUpdate', {
                title: user.name + '信息修改',
                user0: user,
                ways
            });
        })
        .catch(function (err) {
            Report.errPage(res, err);
        });

};

exports.signUp = function (req, res) {
    let savePromise = new Promise(function (resolve, reject) {
        let user;
        let _user = req.body.user;
        user = new UserModel(_user);
        user.save(function (err, user) {
            if (err) {
                reject(err);
            }
            resolve(user);
        })
    });
    savePromise
        .then(function (user) {
            res.redirect('/admin/userdetail/' + user._id)
        })
        .catch(function (err) {
            Report.errPage(res, err);
        })

};

exports.update = function (req, res) {
    let userPromise = new Promise(function (resolve, reject) {
        let _user = req.body.user;
        let id = _user._id;
        UserModel
            .where('_id').ne(id)
            .or([{'name': _user.name}, {'phone': _user.phone}])
            .exec(function (err, users) {
                if (err) {
                    reject(err)
                }
                if (users.length === 0) {
                    resolve(_user)
                }
                if (users.length !== 0 && users[0].name === _user.name) {
                    reject('姓名重复');
                }
                if (users.length !== 0 && users[0].phone == _user.phone) {
                    reject('手机重复');
                }

            })
    });
    let updatePromise = userPromise
        .then(function (_user) {
            let id = _user._id;
            delete _user._id;
            return new Promise(function (resolve, reject) {
                UserModel.findByIdAndUpdate(id, {$set: _user}, function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(id);
                });
            })
        });
    updatePromise
        .then(function (id) {
            res.redirect('/admin/userdetail/' + id)
        })
        .catch(function (err) {
            Report.errPage(res, err);
        })
    ;
};

exports.forbidden = function (req, res) {
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
    let changePromise = userPromise.then(function (user) {
        return new Promise(function (resolve, reject) {
            user.forbidden = !user.forbidden;
            user.save(function (err, user) {
                if (err) {
                    reject(err)
                }
                resolve(user)
            })
        })
    });
    changePromise
        .then(function (user) {
            res.json({
                state: 'success',
                forbidden: user.forbidden
            })
        })
        .catch(function (err) {
            Report.errJSON(res, err);
        });
};

exports.delete = function (req, res) {
    let removePromise = new Promise(function (resolve, reject) {
        let id = req.query.id;
        MessageModel.remove({from: id}, function (err) {
            if (err) {
                reject(err)
            }
            resolve(id);
        })
    });
    let deletePromise = removePromise.then(function (id) {
        return new Promise(function (resolve, reject) {
            UserModel.findByIdAndRemove(id, function (err) {
                if (err) {
                    reject(err)
                }
                resolve(id)
            })
        })
    });
    deletePromise
        .then(function (id) {
            res.json({
                state: 'success',
                id: id
            })
        })
        .catch(function (err) {
            Report.errJSON(res, err);
        })
    ;
};

exports.signIn = function (req, res) {
    let userPromise = new Promise(function (resolve, reject) {
        let _user = req.body;
        let password = _user.password;
        let name = _user.name;
        UserModel
            .findOne({name: name})
            .exec(function (err, user) {
                if (err) {
                    reject(err)
                }
                if (!user) {
                    reject('帐号名称错误')
                }
                resolve({
                    password: password,
                    user: user
                });
            })
    });
    let checkPromise = userPromise.then(function ({password, user}) {
        return new Promise(function (resolve, reject) {
            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    reject(err)
                }
                if (isMatch) {
                    resolve(user)
                } else {
                    reject('密码错误')
                }
            })
        });
    });
    checkPromise
        .then(function (user) {
            req.session.user=user;
            res.json({
                state: 'success'
                , name: user.name
            });
        })
        .catch(function (err) {
            Report.errJSON(res, err)
        })
    ;
};

exports.signOut = function (req, res) {
    delete req.session.user;
    return res.json({
        state: 'success'
    })
};
