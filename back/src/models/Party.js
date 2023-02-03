import database from '../database/db';

const { mongo } = database

const PartySchema = new mongo.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String
    },
    partyDate:{
        type: Date
    },
    photos:{
        type: Array
    },
    privacy:{
        type: Boolean,
    },
    userId:{
        type: mongo.ObjectId,
    }
})

const Party = mongo.model('Party', PartySchema);

export default Party;