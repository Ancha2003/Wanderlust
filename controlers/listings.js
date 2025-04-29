const Listing = require("../models/listing");

// Index controller
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// Render New Form
module.exports.renderNewForm = (req, res) => {
  console.log(req.user);
  res.render("listings/new.ejs");
};

// Show route
module.exports.showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

// Create route
module.exports.createListing = async (req, res) => {
  const { listing } = req.body;

  const newListing = new Listing(listing);
  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await newListing.save();
  req.flash("success", "New listing created");
  res.redirect("/listings");
};

// Render Edit Form
module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Listing not found for editing");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};

// Update route
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found for updating");
    return res.redirect("/listings");
  }

  // Update text fields
  listing.title = req.body.listing.title;
  listing.description = req.body.listing.description;
  listing.location = req.body.listing.location;
  listing.price = req.body.listing.price;

  // If a new file was uploaded
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

// Delete route
module.exports.destroyeListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
