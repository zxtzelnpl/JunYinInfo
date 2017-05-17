const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let MessageSchema = new Schema({
    from: {
        type: ObjectId
        , ref: 'User'
    }
    ,beLong:{
        type: ObjectId
        , ref: 'User'
    }
    , content: String
    , createAt: {
        type: Date
        , default: Date.now
    }
    , updateAt: {
        type: Date
        , default: Date.now
    }
    ,check: {
        type: Boolean
        , default: false
    }
    ,room:String
});

MessageSchema.pre('save', function (next) {
    const message = this;
    if (message.isNew) {
        message.createAt = message.updateAt = Date.now
    } else {
        message.updateAt = Date.now;
    }
    next();
});

module.exports = MessageSchema;
