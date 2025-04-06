import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config() // cargo las variables del archivo .env

export const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI) // me conecto a MongoDB usando la URI del .env
        console.log('Connected to MongoDBatlas')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message)
        process.exit(1)
    }
}
