import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import imageRoutes from './routes/imageRoutes';
import path from 'path';
import cors from 'cors';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));


app.post('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running!',
  });
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/images', imageRoutes);

mongoose.connect(process.env.MONGODB_URI!).then(() => {
  console.log('MongoDB connected');
}).catch((error: unknown) => {
  console.error('MongoDB connection error:', error);
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Something went wrong.' });
});

export default app;
