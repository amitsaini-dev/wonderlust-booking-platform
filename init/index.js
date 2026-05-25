const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");
require("dotenv").config({ path: "../.env" });
let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "6a1393a1c9999f0df4e216d7" }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();
