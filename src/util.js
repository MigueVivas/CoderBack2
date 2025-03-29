import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => {
    console.log(`Datos a validar: user-password: ${user.password}, password: ${password}`);
    return bcrypt.compareSync(password, user.password);
}

export const PRIVATE_KEY = "CoderhouseBackendCourseSecretKeyJWT";
export const generateJWToken = (user) => {
    return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' });
};

export const passportCall = (strategy) => {

    return async (req, res, next) => {
        console.log("Entrando a llamar strategy: ");
        console.log(strategy);

        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() })
            }

            console.log("Usuario obtenido del strategy: ");
            console.log(user);
            req.user = user;

            next()

        })(req, res, next);
    }
}


export const cookieExtractor = (req) => {
    let token = null;
    console.log("Ejecutando cookieExtractor...");

    if (req && req.cookies) {
        console.log("Cookies presentes en la petición:", req.cookies);

        token = req.cookies['jwtCookieToken'];
        console.log("Token extraído:", token || "No se encontró token");
    } else {
        console.log("No hay cookies en la petición.");
    }

    return token;
};

export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send("Unauthorized: User not found in JWT");


        if (req.user.role !== role) {
            return res.status(403).send("Forbidden: El usuario no tiene permisos con este rol, comuniquese con el administrador");
        }

        next();
    }
}