const mongoose = require('mongoose');

const scooterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  current_location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  model: { type: String, required: true },
  year_of_maunfacture: { type: Number, required: true },
  status: { type: String, required: true },
  failures: { type: Array, ref: "Failure", required: true }
});

const Scooter = mongoose.model('Scooter', scooterSchema, "Scooters table");

module.exports = Scooter;