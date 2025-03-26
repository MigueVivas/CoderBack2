import mongoose from 'mongoose';

const collection = 'users';

const schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'Ingresar nombre'],
        trim: true,
    },
    last_name: {
        type: String,
        required: [true, 'Ingresar apellido'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Ingresar mail'],
        unique: true,
        match: [/.+\@.+\..+/, 'El correo electrónico no tiene un formato válido'],
    },
    age: {
        type: Number,
        required: [true, 'Ingresar edad'],
        min: [0],
    },
    password: {
        type: String,
        required: [true, 'Ingresar contraseña'],
    },
    loggedBy: {
        type: String,
        default: 'App',
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
});

const userModel = mongoose.model(collection, schema);
export default userModel;