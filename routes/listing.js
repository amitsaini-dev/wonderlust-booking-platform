const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController=require("../controllers/listings.js");


//To see all Listings
router.get("/", wrapAsync(listingController.index));

//To display for to add new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

//To see a listing in detail
router.get("/:id", wrapAsync(listingController.showListing));

//To add new listing in DB
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//Form to edit Listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//To update edited data in DB
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

//To delete a listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;