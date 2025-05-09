import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => {
    console.log(`Datos a validar: user-password-DB: ${user.password}, password-Cliente: ${password}`);
    
    return bcrypt.compareSync(password, user.password);
}