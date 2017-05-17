const mongoose = require('mongoose');
const ClickCountSchema = require('../schemas/clickCount.js');
const ClickCountModel = mongoose.model('ClickCount',ClickCountSchema);

module.exports = ClickCountModel;
