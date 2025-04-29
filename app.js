
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const session = require("express-session")
const flash = require("connect-flash")
const passport=require("passport");
const LocalStrategy = require("passport-local");
const User=require("./models/user.js");
const {isLoggedIn} = require("./middleware.js")
const { isOwner , isReviewAuthor } = require("./middleware.js");
const listingController = require("./controlers/listings.js")
const reviewController = require("./controlers/reviews.js")
const multer  = require('multer')
const {storage} = require("./cloudConfig.js");
const upload = multer({ storage})

const dbUrl = process.env.ATLASDB_URL;


const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(dbUrl);
  console.log("connected to DB");
}

main().catch((err) => {
  console.error("DB connection error:", err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));



const sessionOptions = {
  secret:"msupersecretcode",
  resave:false,
  saveUninitialized :true,
  cookie: {
    expires: Date.now() + 7* 24 * 60 * 60 *100,
    maxAge:7*24* 60 * 60* 1000,
    httpOnly:true,
  },
};


// Root route
app.get("/", (req, res) => {
  res.send("home");
});

app.use(session(sessionOptions))
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", userRouter);



// app.get("/demouser", async (req,res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username:"anchal"
//   });
// let registerUser= await  User.register(fakeUser,"hello");
// res.send(registerUser);
// })


// Middleware for validating listing
const validateListing = (req, res, next) => {
  console.log("Request Body:", req.body);
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
};

// Middleware for validating review
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    return res.redirect(`/listings/${req.params.id}?error=${msg}`);
  }
  next();
};




// Index Route
app.get("/listings", wrapAsync(listingController.index));

// New Route
app.get("/listings/new",isLoggedIn, listingController.renderNewForm);

// Create Route
// Create Listing Route
app.post(
  "/listings",
  isLoggedIn,
  upload.single('listing[image]'),   // multer first
  (req, res, next) => {
    // manually push file path into req.body.listing
    if (req.file) {
      req.body.listing.image = req.file.path;
    }
    next();
  },
  validateListing,                  // then validate updated body
  wrapAsync(listingController.createListing)
);




// Show Route
app.get("/listings/:id", wrapAsync(listingController.showListing));

// Edit Route
app.get("/listings/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

// Update Route
// Update Listing Route
app.put(
  "/listings/:id",
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),   // multer first
  (req, res, next) => {
    if (req.file) {
      req.body.listing.image = req.file.path;
    }
    next();
  },
  validateListing,
  wrapAsync(listingController.updateListing)
);


// Delete Route
app.delete("/listings/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyeListing));

// Post Review Route
app.post("/listings/:id/reviews",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
// delete review route
app.delete("/listings/:id/reviews/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

// 404 Catch-all route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  console.error("Error caught:", err);
  res.status(statusCode).render("error.ejs", { statusCode, message });
});

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
