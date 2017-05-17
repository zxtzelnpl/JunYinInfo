const mongoose = require('mongoose');
const UserSchema = require('../schemas/user.js');
const UserModel = mongoose.model('User',UserSchema);

module.exports = UserModel;
