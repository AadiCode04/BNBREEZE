const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


// Signup
router.route("/signup")
  .get(userController.renderSignupForm)   // Show signup form
  .post(wrapAsync(userController.signup)); // Handle signup


// Login
router.route("/login")
  .get(userController.renderLoginForm)  // Show login form
  .post(
    saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    userController.login
  );

  
// Logout
router.get("/logout", userController.logout);

module.exports = router;
