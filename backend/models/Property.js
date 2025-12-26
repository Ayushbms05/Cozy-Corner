const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: String,
  propertyType: String,
  occupancyType: String,
  description: String,

  address: String,
  city: String,
  nearestCollege: String,

  amenities: {
    wifi: Boolean,
    ac: Boolean,
    food: Boolean,
    laundry: Boolean,
    power: Boolean,
    cctv: Boolean
  },

  images: {
  type: [String],
  default: []
  },

  owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
  },
  
  rent: Number,
  deposit: Number,
  rules: String
});

module.exports = mongoose.model("Property", propertySchema);
