import { getUserByToken } from "../helpers/Helper";
import User from "../models/User";
import Party from "../models/Party";
class PartyController{

    async createParty(req, res) {
        const { title, description, partyDate, privacy } = req.body;
        let files = [];
        const errors = [];
        const fields = {
            title: "nome",
            description: "descrição",
            partyDate: "data da festa",
            privacy: "privacidade"
        }
        
        if(req.files) {
            files = req.files.photos;
        }

        Object.keys(req.body).map((key) => {
            const fieldsNotRequired = ['privacy'];

            if(!fieldsNotRequired.includes(key))
            {
                if(!req.body[key] || req.body[key] === 'null')
                {
                    errors.push({ error: `O campo ${fields[key]} é obrigatório`});
                }
            }
        })

        if(errors.length > 0) {
            return res.status(200).json({error: errors});
        }

        const token = req.headers['x-access-token'];
        const { _id } = await getUserByToken(token);

        if(!_id) {
            res.status(401).json({ error: 'Acesso negado' });
        }

        try{
            const user = await User.findOne({ _id: _id.toString() });

            let photos = [];

            if(files && files.length > 0){
                files.map((file) => {
                    photos.push(file.path);
                })
            }

            const party = Party({
                title,
                description,
                partyDate,
                photos,
                privacy,
                userId: user._id.toString()
            })

            try{
                const savedParty = await party.save();
                return res.status(200).json({ error: null, msg: 'Evento criado com sucesso', data: savedParty });
            }
            catch(error) {
                return res.status(400).json({ error: error.message});
            }
        }
        catch(error) {
            return res.status(400).json({ error: 'Acesso negado' });
        }
    }

    async getAllParty(req, res) {
        try {
            const parties = await Party.find({ privacy: false }).sort([[ "_id", -1 ]]);
            return res.status(200).json({ error: null, data: parties });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getUserParties(req, res) {
        const token = req.headers['x-access-token'];

        const { _id } = await getUserByToken(token);

        if(!_id) {
            res.status(401).json({ error: 'Acesso negado' });
        }

        try {
            const parties = await Party.find({ userId: _id.toString() });
            return res.status(200).json({ error: null, data: parties });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getParty(req, res) {
        const { id } = req.params;
        try {
            const party = await Party.findOne({ _id: id.toString() });
            if(party.privacy === false)
            {
                return res.status(200).json({ error: null, data: party });
            }
            else{
                const token = req.headers['x-access-token'];
                const { _id } = await getUserByToken(token);
                
                if(!_id) {
                    res.status(401).json({ error: 'Acesso negado' });
                }

                if(party.userId === _id.toString())
                {
                    return res.status(200).json({ error: null, data: party });
                } 
                else{
                    res.status(401).json({ error: 'Acesso negado' });
                }
            }
        } catch (error) {
            res.status(400).json({ error: 'O evento não existe' });
        }
    }

    async getUserParty(req, res) {
        const { id } = req.params;
        const token = req.headers['x-access-token'];
        const { _id } = await getUserByToken(token);
        
        if(!_id) {
            res.status(401).json({ error: 'Acesso negado' });
        }

        try {
            const party = await Party.findOne({userId: _id.toString(), _id: id.toString()});

            return res.status(200).json({ error: null, data: party });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateParty(req, res) {
        const { id, userId, title, description, partyDate, privacy } = req.body;
        let files = [];
        const errors = [];
        const fields = {
            title: "nome",
            description: "descrição",
            partyDate: "data da festa",
            privacy: "privacidade"
        }
        
        if(req.files) {
            files = req.files.photos;
        }

        Object.keys(req.body).map((key) => {
            const fieldsNotRequired = ['privacy'];

            if(!fieldsNotRequired.includes(key))
            {
                if(!req.body[key] || req.body[key] === 'null')
                {
                    errors.push({ error: `O campo ${fields[key]} é obrigatório`});
                }
            }
        })

        if(errors.length > 0) {
            return res.status(200).json({error: errors});
        }

        const token = req.headers['x-access-token'];
        const { _id } = await getUserByToken(token);

        if(!_id) {
            res.status(401).json({ error: 'Acesso negado' });
        }

        if(userId !== _id.toString())
        {
            res.status(401).json({ error: 'Acesso negado' });
        }

        const updateParty = {
            _id: id.toString(),
            title,
            description,
            partyDate,
            privacy,
            userId: _id.toString()
        }


        let photos = [];

        if(files && files.length > 0){
            files.map((file) => {
                photos.push(file.path);
            })
            updateParty.photos = photos;
        }
        
        try {
            const updatedParty = await Party.findOneAndUpdate({ _id: id.toString(), userId: _id.toString() }, { $set: updateParty }, { new: true});
            return res.status(200).json({ error: null, msg: 'Evento atualizado com sucesso', data: updatedParty });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }


        res.status(200).json({ error: null, msg: 'Evento atualizado com sucesso' });

    }

    async deleteParty(req, res) {
        const token = req.headers['x-access-token'];
        const { _id } = await getUserByToken(token);
        
        // Party id
        const { id } = req.body;

        if(!_id) {
            res.status(401).json({ error: 'Acesso negado' });
        }

        try {

            await Party.deleteOne({ _id: id.toString(), userId: _id.toString() });
            res.status(200).json({ error: null, msg: 'Evento excluído com sucesso' });
            
        } catch (error) {
            res.status(400).json({ error: error.message });
        }


    }
}

export default new PartyController();