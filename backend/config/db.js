import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (uri) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`[DB] Connected to external MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[DB] Could not connect to external MongoDB at ${uri}: ${err.message}`);
      console.log('[DB] Switching to in-memory MongoDB fallback for instant zero-config experience...');
    }
  }

  // In-memory fallback
  try {
    mongodInstance = await MongoMemoryServer.create();
    const memUri = mongodInstance.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`[DB] Connected to In-Memory MongoDB Server: ${memUri}`);
    return conn;
  } catch (error) {
    console.error(`[DB] MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
