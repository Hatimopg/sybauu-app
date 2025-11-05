import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import authRoutes from './routes/auth';
import apiRoutes from './routes/api';
import userRoutes from './routes/user';
import inviteRoutes from "./routes/invite";

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5174';

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// 🔹 Routes principales
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/user', userRoutes);
app.use("/api/invite", inviteRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
