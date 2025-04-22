import express from "express";
import Product from "../models/products.model.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  try {
    
    const {
      limit = 10,
      page = 1,
      sort = 'price',
      order = 'asc',
      category,
      minPrice,
      maxPrice, 
      title
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (title) filter.title = { $regex: title, $options: 'i' };

    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort: sortOptions
    };

    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .limit(options.limit)
      .skip(options.skip)
      .sort(options.sort);

    const totalPages = Math.ceil(totalProducts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).send({
      status: "success",
      payload: products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: parseInt(page),
        hasNextPage,
        hasPrevPage,
        prevPage: hasPrevPage ? parseInt(page) - 1 : null,
        nextPage: hasNextPage ? parseInt(page) + 1 : null
      }
    });
  } catch (error) {
    res.status(500).send({ 
      status: "error", 
      message: "Error al recuperar los productos", 
      error: error.message 
    });
  }
});


productRouter.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category, status = true, thumbnail = "" } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error("Faltan datos para completar la operación");
    }

    const newProduct = new Product({ title, description, code, price, stock, category, status, thumbnail });
    await newProduct.save();
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

productRouter.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true });
    if (!updatedProduct) throw new Error("Producto no encontrado");
    res.status(200).send({ message: "Producto actualizado con éxito", payload: updatedProduct });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

productRouter.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    if (products.length === 0) throw new Error(`No hay productos en la categoría ${category}`);
    res.status(200).send(products);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

productRouter.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await Product.findById(pid);
    if (!product) throw new Error("Producto no encontrado");
    res.status(200).send(product);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

productRouter.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(pid);
    if (!deletedProduct) throw new Error("Producto no encontrado");
    res.status(200).send({ message: "Producto eliminado con éxito" });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

export default productRouter;
