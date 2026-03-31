import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import CardRoutes from './routes/Card';

const app= express();
app.use(cors());
app.use(express.json());

mongoose.connect('');

app.use('/api/cards', CardRoutes);

app.listen(5000, ()=> console.log('Server running on port 5000'));