if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo')
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

const port = 8080;

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;


// Connection to MongoDb
main()
  .then(() => {
    console.log("Sucessful Connection to DB...");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
};


// Setting Paths
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, "public"))); //used to send additional css and js files
app.use(express.urlencoded({ extended: true })); // used to handle URL encoded data. When getting data from form.
app.use(express.json());

app.engine("ejs", ejsMate);




// Session Store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in Mongo Session Store", err)
});


// Express Sessions
const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + (24 * 60 * 60 * 1000),
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}


app.use(session(sessionOptions));




// Authentication 
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(flash());

// Middleware for conncet-flash
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");

  res.locals.currUser = req.user;
  next();
})


// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



// Error Handling

// In this secton if we do not get the request to any valid(above) route, then to request will come to this route.
// Here we will generate a custom error of "Page Not Found" 
app.use((req, res, next) => {
  next(new expressError(404, "Page Not Found"));
});

// Here the error is handled weather it is custom error or any other error
app.use((err, req, res, next) => {
  let {statusCode=500, message="Something Went Wrong."} = err;
  // res.status(statusCode).send(message);
  res.render("error.ejs", {err});
});


app.listen(port, () => {
  console.log(`You are listening to port ${port}...`);
});