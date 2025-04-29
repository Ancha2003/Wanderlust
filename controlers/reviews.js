const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview =async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview)
    listing.reviews.push(newReview); // ✅ push to "reviews"
    await newReview.save();
    await listing.save();
    req.flash("success", "new review created")
    res.redirect(`/listings/${req.params.id}`);
  }


  //delete review
  module.exports.deleteReview =async (req,res) =>{
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted")
    res.redirect(`/listings/${id}`);
  }