const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("db connected");
})

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    imageUrl: String,
    isAvailable: { type: Boolean, default: true },
    extras: [
      {
        name: String,
        price: Number,
      }
    ],
  tags: [String],
});

const menuSchema = new mongoose.Schema({
    // restaurantId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Restaurant',
    //   required: true,
    // },
    Appetizers: [itemSchema],
    MainCourses: [itemSchema],
    Desserts: [itemSchema],
    Drinks: [itemSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

module.exports = mongoose.model('Menu', menuSchema);