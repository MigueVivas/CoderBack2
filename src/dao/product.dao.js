import productModel from "../models/product.model.js";

class ProductDAO {
  async getAll() {
    return await productModel.find();
  }

  async getById(id) {
    return await productModel.findById(id);
  }

  async create(productData) {
    return await productModel.create(productData);
  }

  async update(id, updatedData) {
    return await productModel.findByIdAndUpdate(id, updatedData, { new: true });
  }

  async delete(id) {
    return await productModel.findByIdAndDelete(id);
  }
}

export default new ProductDAO();