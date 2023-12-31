
let Listing=require('../models/linstings');
module.exports.isLogedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.redirectUrl = req.orignalUrl;
      req.flash("success", "You must be Login");
      res.redirect("/login");
    }
    next();
  };

  // Middleware function to check ownership
const checkListingOwnership = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.listingId); // Assuming you fetch the listing
    if (!listing.owner.equals(res.locals.currUser._id)) {
      throw new ExpressError(404, "Malicious Activity detected");
    }
    // If the user is authorized, proceed
    next();
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
};


