const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//To see all Listings
router.route("/")
    .get(wrapAsync(listingController.index))
    //To add new listing in DB
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));

//To display for to add new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

//To see a listing in detail
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    //To update edited data in DB
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
    //To delete a listing
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Form to edit Listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;