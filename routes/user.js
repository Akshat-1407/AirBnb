const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

// Signup
router.get("/signup", (req, res) => {
  res.render("./users/signup.ejs");
})

router.post("/signup", wrapAsync(async (req, res) => {
  try {
    let {username, email, password} = req.body;
    let newUser = new User({username, email});

    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    // login after Signup
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  }

  catch(err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  };

}));


// Login
router.get("/login", (req, res) => {
  res.render("./users/login.ejs");
})

router.post("/login",
   saveRedirectUrl,
   passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), 
   async (req, res) => {
     req.flash("success", "Welcome back to Wanderlust!");
     let redirectUrl = res.locals.redirectUrl || "/listings";
     res.redirect(redirectUrl);
});


// Logout
router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    };
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
});


module.exports = router;