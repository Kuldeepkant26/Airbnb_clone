const mongoose = require("mongoose");
let listingSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  disc: {
    type: String,
  },
  image: {
   url:String,
   filename:String
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  ctgry: {
    type: String,
  },
  price: {
    type: Number,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reviews",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Listings", listingSchema);
