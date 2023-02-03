import mongoose from 'mongoose';

export default {
    connect: async () => {
        mongoose.set('strictQuery', true)
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: process.env.DATABASE
        })
    },
    mongo:  mongoose
}