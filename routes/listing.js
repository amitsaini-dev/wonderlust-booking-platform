const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

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

//To see all Listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//To display for to add new listing
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//To see a listing in detail
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

//To add new listing in DB
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = await new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Listing Added");
    res.redirect("/listings");
}));

//Form to edit Listing
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));
//To update edited data in DB
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let listing = req.body.listing;
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, listing);
    req.flash("success", "Lisiting Updated");
    res.redirect(`/listings/${id}`);
}));

//To delete a listing
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}));

module.exports = router;