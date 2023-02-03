import User from '../models/User';
import { getUserByToken } from '../helpers/Helper';
import bcrypt from 'bcrypt';

class UserController {
    async getUser(req, res) {
        try {

            const user = await User.findById(req.params.id, { password: 0 });

            return res.status(200).json({error: null, user});

        } catch (error) {
            return res.status(400).json({ error: 'Usuário não encontrado' });
        }
    }

    async updateUser(req, res) {
        const { id, email, name, password } = req.body;
        const token = req.headers['x-access-token'];
        const updateData = {
            name,
            email,
        }
        const fields = {
            name: "nome",
            email: "email",
        }

        const errors = [];

        if(!token) {
            res.status(401).json({ error: 'Acesso negado' });
        }

        const user = await getUserByToken(token);
        if(!user) {
            res.status(401).json({ error: 'Acesso negado' });
        }

        if(user._id.toString() !== id) {
            res.status(401).json({ error: 'Acesso negado' });
        }

        Object.keys(req.body).map(async (key) => {
            const fieldsNotRequired = ['id', 'password', 'confirmPassword'];
            if(!fieldsNotRequired.includes(key)) {
                if(!req.body[key])
                {
                    errors.push({ error: `O campo ${fields[key]} é obrigatório`});
                }
            }

            if(password)
            {
                if(key === 'confirmPassword' && req.body[key] !== req.body.password) {
                    errors.push({ error: 'As senhas não conferem' }); 
                }
            }
        });

        if(errors.length > 0) {
            return res.status(200).json({error: errors});
        }

        if(password)
        {
            const salt = await bcrypt.genSalt(12);
            const hashPassword = await bcrypt.hash(password.toString(), salt);
            updateData.password = hashPassword;
        }

        try {
            const updatedUser = await User.findOneAndUpdate({ _id: id}, { $set: updateData }, { new: true });
            return res.status(200).json({ error: null, user: updatedUser, msg: 'Usuário atualizado com sucesso' });
            
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new UserController();