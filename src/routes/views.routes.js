import { Router } from 'express';
import cookieParser from 'cookie-parser';
import Product from "../models/products.model.js";

const router = Router();

// Configurar cookie parser con clave secreta
router.use(cookieParser("CoderS3cr3tC0d3"));

// Rutas con vistas
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render("home", { products });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render("realTimeProducts", { products });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.get('/login', (req, res) => {
    const { username, password } = req.query;
    if (username !== 'pepe' || password !== 'qwerty123') {
        return res.status(401).send("Login Failed, check your username and password.");
    } else {
        req.session.user = username;
        req.session.password = password;
        req.session.admin = true;
        res.send('Login Successful !');
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.json({ error: "error logout", mensaje: "Error al cerrar la sesion" });
        } else {
            res.send("Sesion cerrada correctamente.");
        }
    });
});

router.get("/session", (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Se ha visitado este sitio ${req.session.counter} veces.`);
    } else {
        req.session.counter = 1;
        res.send("Bienvenido!");
    }
});

function auth(req, res, next) {
    if (req.session.user === 'pepe' && req.session.admin) {
        return next();
    } else {
        return res.status(403).send("Usuario no autorizado para ingresar a este recurso.");
    }
}

router.get('/private', auth, (req, res) => {
    res.send("Si estas viendo esto es porque pasaste la autorización a este recurso!");
});

export default router;