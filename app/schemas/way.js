const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

let WaySchema = new Schema({
    name: String,
    url:String,
    autoReplay: String,
    timeStart: Date,
    timeEnd: Date,
    clickCount: {
        type: Number,
        default: 0
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = WaySchema;
