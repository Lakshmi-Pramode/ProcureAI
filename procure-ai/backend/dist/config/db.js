import mongoose from 'mongoose';
import { config, runtimeConfig } from './env.js';
export async function connectDB() {
    const uri = runtimeConfig.mongoUri || config.mongoUri;
    if (!uri || uri.trim() === '') {
        console.log('ℹ️  No MONGODB_URI provided. Running in Dual-Mode (In-Memory Database with pre-seeded procurement data).');
        runtimeConfig.isMongoConnected = false;
        return false;
    }
    try {
        console.log('🔄 Attempting to connect to MongoDB...');
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ Connected to MongoDB successfully!');
        runtimeConfig.isMongoConnected = true;
        return true;
    }
    catch (error) {
        console.warn('⚠️  MongoDB connection failed. Falling back to In-Memory Database store.');
        console.warn(`Details: ${error.message}`);
        runtimeConfig.isMongoConnected = false;
        return false;
    }
}
export async function disconnectDB() {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        runtimeConfig.isMongoConnected = false;
    }
}
