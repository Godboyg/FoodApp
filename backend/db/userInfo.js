const mongoose = require("mongoose");

const userInfo = new mongoose.Schema({
    name : { type: String },
    number : {
        type: Number
     }
})

module.exports = mongoose.model("user",userInfo);