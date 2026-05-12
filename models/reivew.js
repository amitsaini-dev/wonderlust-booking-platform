const { date } = require("joi");
const mongoose = require("mongoose");
const{Schema}=mongoose;

const reviewSchema=newSchema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:date,
        default:Date.now(),
    },
});

module.exports=mongoose.model("Review",reviewSchema);