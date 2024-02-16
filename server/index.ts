import express from 'express';
import mongoose, { Schema, Document, Model } from 'mongoose';
import dotenv from 'dotenv'
import { UserRouter } from './src/routes/UserRoutes';

dotenv.config()

const PORT = process.env.PORT || 5000;

const MONGO_DB_URI=process.env.MONGO_DB_URI || "mongodb://127.0.0.1:27017/recipe-app";

// Create Express app
const app = express();

// Middleware
app.use(express.json());

app.use("/api/user",UserRouter)

// Start the server
// Connect to MongoDB
mongoose.connect(MONGO_DB_URI)
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });  
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});
