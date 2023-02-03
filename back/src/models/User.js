import database from '../database/db';

const { mongo } = database

const UserSchema = new mongo.Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    }
})

const User = mongo.model('User', UserSchema);

export default User;