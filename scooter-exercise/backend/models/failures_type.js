const mongoose = require('mongoose');

const failureTypeSchema = new mongoose.Schema({
    type: { type: String, required: true }, 
    status: { type: String, required: true },
    opening_time: { type: Date, required: true },
    closing_time: { type: Date, required: true },
    scooter_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Scooter', required: true}
});

const FailureType = mongoose.model('FailureType', failureTypeSchema,"Failures Type table");

module.exports = FailureType;