const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

let ClickCountSchema = new Schema({
    name:String,
    createAt: {
        type: Date
        , default: Date.now
    }
});

module.exports = ClickCountSchema;
