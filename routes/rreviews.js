const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listings = require("../models/linstings");
const Reviews = require("../models/reviews");
const { isLogedIn } = require("../utils/middlewares");
const Review_controler=require('../controllers/reviews_C');
router.post(
  "/review/add/:id",
  isLogedIn,
  wrapAsync(Review_controler.post_review)
);

router.get(
  "/review/delete/:rid/:id",
  isLogedIn,
  wrapAsync(Review_controler.review_delete)
);

module.exports = router;
