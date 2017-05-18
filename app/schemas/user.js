const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;


let UserSchema = new Schema({
    name: String
    , nickName: String
    , password: String
    , phone: String
    , email: String
    , sex: String
    , way:String
    , leaveMes:String
    , level: {
        type: Number
        , default: 0
    }
    ,online:{
        type:Boolean
        ,default:false
    }
    , createAt: {
        type: Date
        , default: Date.now()
    }
    , updateAt: {
        type: Date
        , default: Date.now()
    }
    , forbidden: {
        type: Boolean
        , default: false
    }
    , chat: {
        type: Boolean
        , default: false
    }
    , finish: {
        type: Boolean
        , default: false
    }
});

UserSchema.pre('save', function (next) {
    const user = this;
    if (user.isNew) {
        user.createAt = this.updateAt = Date.now()
    } else {
        user.updateAt = Date.now();
    }
    if(user.password){
        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            if (err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err)
                }
                user.password = hash;
                next()
            })
        })
    }else{
        next();
    }
});

UserSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatch) {
            if (err) {
                return cb(err)
            }
            cb(null, isMatch)
        })
    }
};

module.exports = UserSchema;
