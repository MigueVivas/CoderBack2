import express from "express";
import Cart from "../models/cart.model.js";

const cartsRouter = express.Router();

cartsRouter.post("/", async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).send({ status: "success", payload: newCart });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart) throw new Error("Carrito no encontrado");
    res.status(200).send(cart);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    res.status(200).send({ status: "success", payload: cart });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export default cartsRouter;
