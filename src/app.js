import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import FileStore from 'session-file-store';

import usersViewRouter from './routes/users.views.router.js';
import sessionsRouter from './routes/sessions.router.js'
import viewsRouter from './routes/views.routes.js';
import __dirname from './util.js';

const app = express();
const SERVER_PORT = 9090;

app.use(express.json());
app.use(express.urlencoded({extended: true }))

app.engine('handlebars', engine({
    layoutsDir: path.resolve('src/views/layouts'),
    defaultLayout: 'main'
}));
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));


const MONGO_URL = "mongodb://localhost:27017/projectBackend2?retryWrites=true&w=majority";

app.use(session(
    {  
        store: MongoStore.create({
            mongoUrl: MONGO_URL,
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
            ttl: 20,
        }),
        secret: 'your-secret-key',
        resave: true,
        saveUninitialized: true,
    }
))

app.get('/ping', (req, res) => {
    res.send("pong")
});

app.use('/', viewsRouter)
app.use('/users', usersViewRouter)
app.use('/api/sessions', sessionsRouter)


app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});

io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado!");

    socket.on("newProduct", async (productData) => {
        try {
            const newProduct = await Product.create(productData);
            io.emit("productAdded", newProduct);
        } catch (error) {
            console.error("Error añadiendo producto: ", error.message);
        }
    });
});

const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URL)
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Failed to connect to MongoDB");
        process.exit();
    }
}
connectMongoDB();
