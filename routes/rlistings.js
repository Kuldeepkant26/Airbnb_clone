const multer  = require('multer')
const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listings = require("../models/linstings");
const Reviews = require("../models/reviews");
const { isLogedIn, checkListingOwnership } = require("../utils/middlewares");
const {storage}=require('../cloudConfig.js');
const upload = multer({ storage });

const ListingController = require("../controllers/listings_C");
//Multer  upload.single('image'),
router.get("/home", wrapAsync(ListingController.index));
router.get("/add", isLogedIn, ListingController.add_form_render);
router.post("/add", isLogedIn, upload.single('image'),wrapAsync(ListingController.add_form_post));


router.get(
  "/show/:id",
  wrapAsync(ListingController.show_listing)
);
router.get(
  "/edit/:id",
  isLogedIn,
  wrapAsync(ListingController.render_eform)
);
router.post(
  "/edit/:id",
  isLogedIn,
  upload.single('image'),
  wrapAsync(ListingController.post_edit)
);
router.get(
  "/delete/:id",
  isLogedIn,
  wrapAsync(ListingController.listing_delete)
);
router.get("/boat", async (req, res) => {
  let listings = await Listings.find();
  res.render("boat.ejs", { listings });
});
router.get("/birthday", async (req, res) => {
  let listings = await Listings.find();
  res.render("birthday.ejs", { listings });
});
router.get("/snow", async (req, res) => {
  let listings = await Listings.find();
  res.render("snow.ejs", { listings });
});
router.get("/hotel", async (req, res) => {
  let listings = await Listings.find();
  res.render("hotel.ejs", { listings });
});
router.get("/rainy", async (req, res) => {
  let listings = await Listings.find();
  res.render("rainy.ejs", { listings });
});
router.get("/ancient", async (req, res) => {
  let listings = await Listings.find();
  res.render("ancient.ejs", { listings });
});
router.get("/hills", async (req, res) => {
  let listings = await Listings.find();
  res.render("hills.ejs", { listings });
});
module.exports = router;
