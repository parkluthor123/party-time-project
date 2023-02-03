import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

class AuthController{
    async register(req, res){
        const { name, email, password } = req.body;
        const errors = [];
        const fields ={
            name: "nome",
            email: "email",
            password: "senha"
        }
        
        Object.keys(req.body).map(async (key) => {
            const fieldsNotRequired = ['confirmPassword'];
            if(!req.body[key] && !fieldsNotRequired.includes(key)) {
                errors.push({ error: `O campo ${fields[key]} é obrigatório`});
            }
            if(key === 'confirmPassword' && req.body[key] !== req.body.password) {
                errors.push({ error: 'As senhas não conferem' }); 
            }
        });

        const emailExists = await User.findOne({ email });
        if(emailExists) {
            while(errors.length > 0)
            {
                errors.pop();
            }
            errors.push({ error: 'Email já cadastrado' });
        }

        if(errors.length > 0) {
            return res.status(200).json({error: errors});
        }

        // Criptografando a senha
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password.toString(), salt);

        const user = new User({
            name,
            email,
            password: hashPassword
        })

        try {
            const savedUser = await user.save();
            // gerando o token
            const token = jwt.sign(
                {
                    name: savedUser.name,
                    id: savedUser._id
                },
                process.env.TOKEN_SECRET,
            )

            // retornando o token
            return res.status(200).json({
                error: null,
                token,
                userId: savedUser._id,
                msg: 'Usuário cadastrado com sucesso' 
            });

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }  
    }

    async login(req, res){

        try {

            const { email, password } = req.body;

            const errors = [];
            const user = await User.findOne({ email });
            if(!user) {
                errors.push({ error: 'Não existe um usuário cadastrado com este e-mail!' });
            }
            if(!password) {
                errors.push({ error: 'A senha é obrigatória' });
            }

            if(errors.length > 0) {
                return res.status(200).json({error: errors});
            }

            const checkPassword = await bcrypt.compare(password.toString(), user.password);
            if(!checkPassword) {
                errors.push({ error: 'Senha incorreta' });
            }

            if(errors.length > 0) {
                return res.status(200).json({error: errors});
            }


            // gerando o token
            const token = jwt.sign(
                {
                    name: user.name,
                    id: user._id
                },
                process.env.TOKEN_SECRET,
            )

            // retornando o token
            return res.status(200).json({
                error: null,
                token,
                userId: user._id,
                msg: 'Usuário autenticado com sucesso' 
            });

        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: error.message });
        }  
    }
}

export default new AuthController();