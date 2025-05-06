import mongoose from "mongoose";

const collection = 'products';

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  category: String,
  stock: {
    type: Number,
    default: 0
  },
  thumbnail: String
}, {
  timestamps: true 
});

const productModel = mongoose.model(collection, schema);

export default productModel;