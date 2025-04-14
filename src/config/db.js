import mongoose from 'mongoose';
import config from './config.js';

export const connectToDB = async () => {
    try {
        await mongoose.connect(config.mongo_uri)
        console.log('Connected to MongoDBatlas')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message)
        process.exit(1)
    }
}
