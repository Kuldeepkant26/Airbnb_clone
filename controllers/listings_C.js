const Listings = require("../models/linstings");
const Reviews = require("../models/reviews");
const ExpressError = require("../utils/ExpressError");
module.exports.index = async (req, res) => {
  let listings = await Listings.find();
  res.render("home.ejs", { listings });
};

module.exports.add_form_render = (req, res) => {
  res.render("form.ejs");
};

module.exports.add_form_post = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  let { title, disc, location, price, country, ctgry } = req.body;
  if (
    !req.body.title ||
    !req.body.disc ||
    !req.body.price ||
    !req.body.location ||
    !req.body.country ||
    !req.body.ctgry
  ) {
    throw new ExpressError(404, "invalid input");
  }
  let l1 = new Listings({
    title: title,
    disc: disc,
    location: location,
    country: country,
    price: price,
    ctgry: ctgry,
  });

  l1.user = req.user;
  l1.image = { url, filename };
  await l1.save();
  req.flash("success", "Your home is successfuly added to Airbnb");
  res.redirect("/home");
};

module.exports.show_listing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listings.findById(id)
    .populate({ path: "reviews", populate: { path: "owner" } })
    .populate("user");
  if (!listing) {
    req.flash("success", "Listing not exist");
    res.redirect("/home");
  }
  res.render("show.ejs", { listing });
};

module.exports.render_eform = async (req, res) => {
  let { id } = req.params;
  let listing = await Listings.findById(id);

  res.render("eform.ejs", { listing });
};

module.exports.post_edit = async (req, res) => {
  let { id } = req.params;
  let { title, disc, location, price, country, ctgry } = req.body;

  if (!title || !disc || !price || !location || !country || !ctgry) {
    throw new ExpressError(404, "Invalid input");
  }

  const updatedData = { title, disc, location, country, price, ctgry };

  if (req.file) {
    // Assuming you're using multer for file uploads and req.file contains the uploaded file
    const { path, filename } = req.file;
    updatedData.image = { url: path, filename };
  }

  try {
    // Find the listing by ID and update it
    const updatedListing = await Listings.findByIdAndUpdate(
      id,
      updatedData,
      { new: true } // To return the updated document
    );

    if (!updatedListing) {
      throw new Error("Listing not found");
    }

    req.flash("success", "Changes saved");
    res.redirect(`/show/${id}`);
  } catch (error) {
    console.error(error);
    // Handle errors appropriately
    res.status(500).send("Error updating listing");
  }
};

module.exports.listing_delete = async (req, res) => {
  let { id } = req.params;
  let listing = await Listings.findById(id);
  await Reviews.deleteMany({ _id: { $in: listing.reviews } });
  await Listings.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect(`/home`);
};
