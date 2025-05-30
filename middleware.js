const Listing =  require("./models/listing.js");
const Review =  require("./models/review.js");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");


// The req.user variable is automatically set by Passport.js when a user is authenticated and logged in.
// When a user logs in successfully, Passport stores the user information in the session.
// On subsequent requests, Passport populates req.user with the authenticated user's data (from your MongoDB User model).


module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);  // request object contains the information of the logged in user
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to perform this action!");
        return res.redirect("/login");
    };
    next();
};

// post login page
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    };
    next();
};

// Checking if the one who is trying to edit of delete the listing is actually the owner of the listing.
module.exports.isOwner = wrapAsync(async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
});

// Checking if the one who is trying to delete the review is actually the author of the review.
module.exports.isReviewAuthor = wrapAsync(async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
});


// Joi validation for listings
module.exports.validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);

  if (error) {
    throw new expressError("400", error);
  }
  else {
    next();
  }
};


// Joi validation for models
module.exports.validateReview = (req, res, next) => {
  let {error} = reviewSchema.validate(req.body);

  if (error) {
    throw new expressError("400", error);
  }
  else {
    next();
  }
};
