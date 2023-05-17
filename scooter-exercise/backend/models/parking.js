const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  address: { type: String, required: true },
  num_scooters_parked: { type: Number, required: true},
  max_scooter_space: { type: Number, required: true},
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  }
});

const Parking = mongoose.model('Parking', parkingSchema, "Parking Collection");

module.exports = Parking;