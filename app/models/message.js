const mongoose = require('mongoose');
const MessageSchema = require('../schemas/message.js');
const MessageModel = mongoose.model('Message',MessageSchema);

module.exports = MessageModel;
