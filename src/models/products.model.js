import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    pid: String,
    title: String,
    description: String,
    code: {
        type: String,
        unique: true,
    },
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnail: String
})

const Product = mongoose.model("Product", productSchema);

export default Product;