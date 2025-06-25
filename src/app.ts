import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import userRouter from './routes/userRoute';
import cloudinaryRoute from './routes/cloudinaryRoute';
import postRouter from './routes/postRoute';
import commentRouter from './routes/commentRoute';
import { setupSwaggerDocs } from './swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Fish Spot Server!');
});
app.use('/users', userRouter);
app.use('/cloudinary', cloudinaryRoute);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

setupSwaggerDocs(app);

export default app;