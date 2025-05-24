const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Listing =  require("./models/listing.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const {listingSchema} = require("./schema.js");

const port = 8080;

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Sucessful Connection to DB...");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
};


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, "public"))); //used to send additional css and js files
app.use(express.urlencoded({ extended: true })); // used to handle URL encoded data. When getting data from form.
app.use(express.json());

app.engine("ejs", ejsMate);


const validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);

  if (error) {
    throw new expressError("400", error);
  }
  else {
    next();
  }
};


// Home Route
app.get("/", (req, res) => {
  res.send("This is Home Route")
});

// Index Route 
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", {allListings});
}));

// New Route
app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});

// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  res.render("./listings/show.ejs", {listing});
}));

// Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res) => {

  let {title, description, price, location, country, image=""} = req.body;

  const newListing = new Listing({
    title: title,
    description: description,
    price: price,
    location: location,
    country: country,
    image: image,
  });

  await newListing.save();
  res.redirect("/listings");
}));

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", {listing})
}));

// Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
  let {id} = req.params;
  let {title, description, price, location, country} = req.body;
  await Listing.findByIdAndUpdate(id, {
    title: title,
    description: description,
    price: price,
    location: location,
    country: country,
  });
  res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));





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