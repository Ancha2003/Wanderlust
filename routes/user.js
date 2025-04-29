const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");
const Usercontoller = require("../controlers/users")


router.get("/signup", Usercontoller.renderSignupForm);

router.post("/signup", wrapAsync(Usercontoller.signUp));
//login route
router.get("/login" ,Usercontoller.renderLoginForm);

router.post("/login", saveRedirectUrl, 
    passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),
    Usercontoller.login
);

  
  
router.get("/logout" ,Usercontoller.logout)

module.exports = router;