const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
const ejs = require("ejs");

const port = 8080;

app.listen(port, () => {
    console.log(`Server is listing to port: ${port}`);
})

app.get("/",(req,res)=>{
    res.send("Hiii I am root");
})

let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.log(err);
    });

async function main () {
    await mongoose.connect(MONGO_URL);
}




