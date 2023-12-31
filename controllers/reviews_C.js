const Listings = require("../models/linstings");
const Reviews = require("../models/reviews");

module.exports.post_review = async (req, res) => {
  let { id } = req.params;
  let listing = await Listings.findById(id);
  let { comment, rating } = req.body;
  if (!req.body.rating || !req.body.comment) {
    throw new ExpressError(404, "invalid input");
  }
  if (!req.user) {
    res.redirect("/home");
  }
  let r1 = new Reviews({
    rating: rating,
    comment: comment,
  });
  r1.owner = req.user;
  listing.reviews.push(r1);
  await listing.save();
  await r1.save();
  req.flash("success", "Review added");
  res.redirect(`/show/${id}`);
};

module.exports.review_delete=async (req, res) => {
    let { rid, id } = req.params;
    let review=await Reviews.findById(rid);
  if(!review.owner.equals(res.locals.currUser._id)){
    throw new ExpressError(404, "Malicious Activity detected");
  }
  await Reviews.findByIdAndDelete(rid);

    await Listings.updateOne({ _id: id }, { $pull: { reviews: rid } });
    req.flash("success", "Review Deleted");
    res.redirect(`/show/${id}`);
  }