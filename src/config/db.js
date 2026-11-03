import mongoose from 'mongoose'
import config from './config.js'
export const connectDB = async () => {
    mongoose.connect(config.mongoURI)
    console.log('Connected to DB')
}
