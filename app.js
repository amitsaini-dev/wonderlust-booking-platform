const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const req = require("express/lib/request.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

const port = 8080;

let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.send("Hiii I am root");
});

//To see all Listings
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

//To display for to add new listing
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//To see a listing in detail
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//To add new listing in DB
app.post("/listings", async (req, res) => {
    const newListing = await new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//Form to edit Listing
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
})
//To update edited data in DB
app.put("/listings/:id", async (req, res) => {
    let listing = req.body.listing;
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, listing);
    res.redirect(`/listings/${id}`);
});

//To delete a listing
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    console.log(id);
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

app.listen(port, () => {
    console.log(`Server is listing to port: ${port}`);
})
