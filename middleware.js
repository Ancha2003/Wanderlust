const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log("🔒 User not authenticated. Saving original URL:", req.originalUrl);
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "You must be logged in to perform this action!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectURL) {
        res.locals.redirectURL = req.session.redirectURL;
    }
    next();
};

// Check if current user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to modify this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Check if current user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId); // ✅ Use Review model here

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to delete this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
