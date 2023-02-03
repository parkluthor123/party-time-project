import User from "../models/User";
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';

const getUserByToken = async (token) => {
    if(!token)
    {
        return null;
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById({ _id: decoded.id }, { password: 0 });
    return user;
}

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${path.extname(file.originalname)}`);
    }
});
export { getUserByToken, diskStorage };

