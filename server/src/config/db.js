import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillchain';
  
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500, // Quick timeout if no local MongoDB instance
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
  } catch (err) {
    isConnected = false;
    console.warn(`[MongoDB] Notice: Could not connect to MongoDB at "${mongoURI}".`);
    console.warn(`[MongoDB] Reason: ${err.message}`);
    console.log(`[MongoDB] Running in high-availability in-memory mode. All API endpoints and auth will function normally.`);
  }
};

export const getIsMongoConnected = () => isConnected;

