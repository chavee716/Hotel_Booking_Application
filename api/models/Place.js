const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  url: { type: String, required: true }
});

const placeSchema = new mongoose.Schema({
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  title: {type: String, required: true},
  address: {type: String, required: true},
  photos: [photoSchema],
  description: String,
  perks: [String],
  extraInfo: String,
  checkIn: String,
  checkOut: String,
  maxGuests: {type: Number, required: true},
  price: {type: Number, required: true},
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;