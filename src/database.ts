import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const databaseURI = process.env.MONGO_URI;

const connectToDatabase = async () => {
    try {
      await mongoose.connect(databaseURI as string);
      const db = mongoose.connection.db;
      const collections = await db?.listCollections().toArray();
      console.log("Connected to database:", db?.databaseName);
      console.log("Database URI:", databaseURI);
      console.log(
        "Collections in the database:",
        collections?.map((col) => col.name)
      );
    } catch (error) {
      console.error(
        "Error connecting to MongoDB:",
        error instanceof Error ? error.message : error
      );
    }
  };
  
  const closeDatabaseConnection = async () => {
    try {
      await mongoose.disconnect();
      console.log("Successfully disconnected from MongoDB");
    } catch (error) {
      console.error(
        "Error disconnecting from MongoDB:",
        error instanceof Error ? error.message : error
      );
    }
  };
  
  export { connectToDatabase, closeDatabaseConnection };
  
