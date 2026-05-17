const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
//To handle Error
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
//For server side validation
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));

const port = 8080;

let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Database connected successfully");
        app.listen(port, () => {
            console.log(`Server is listing to port: ${port}`);
        })
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    }
    else {
        next();
    }
}
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    }
    else {
        next();
    }
}

app.get("/", (req, res) => {
    res.send("Hiii I am root");
});

//To see all Listings
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//To display for to add new listing
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//To see a listing in detail
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

//To add new listing in DB
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
    const newListing = await new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Form to edit Listing
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));
//To update edited data in DB
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let listing = req.body.listing;
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, listing);
    res.redirect(`/listings/${id}`);
}));

//To delete a listing
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//To add Review 
app.post("/listings/:id/review", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("review saved");
    res.redirect(`/listings/${listing.id}`);
}));
//To delete Review
app.delete("/listings/:id/review/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

//404 handler
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

//Error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
});


