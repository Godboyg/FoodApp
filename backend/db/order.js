const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    cartItems : [],
    by : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
})

module.exports = mongoose.model("order",orderSchema);