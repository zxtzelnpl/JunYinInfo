const mongoose = require('mongoose');
const WaySchema = require('../schemas/way.js');
const WayModel = mongoose.model('Way',WaySchema);

module.exports = WayModel;
