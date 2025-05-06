import userModel from "../models/user.model.js";

class UserDAO {
  async getAll() {
    return await userModel.find();
  }

  async getById(id) {
    return await userModel.findById(id);
  }

  async getByEmail(email) {
    return await userModel.findOne({ email });
  }

  async create(userData) {
    return await userModel.create(userData);
  }

  async update(id, updatedData) {
    return await userModel.findByIdAndUpdate(id, updatedData, { new: true });
  }

  async delete(id) {
    return await userModel.findByIdAndDelete(id);
  }
}

export default new UserDAO();