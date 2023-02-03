import jwt from 'jsonwebtoken';

class Auth{
    async checkToken(req, res, next){
        const token = req.headers['x-access-token'];
        if(!token){
            return res.status(401).json({ message: 'Acesso negado' });
        }

        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verified;
            next();
        } catch (error) {
            res.status(400).json({ message: 'Token inválido' });
        }
    }
}

export default new Auth();