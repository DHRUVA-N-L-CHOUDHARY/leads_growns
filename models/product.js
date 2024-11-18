const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    userId: String,
    productName: String,
    description: String,
    price: Number,
    minProduct: Number,
    maxProduct: Number,
    stock: Number,
    sheetLink: String,
    sheetName: String,
    created_at: Date,
    updatedAt: Date,
  },
  { collection: "Product" }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
