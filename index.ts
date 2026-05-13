import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import studentsRouter from './routes/students';
import noticesRouter from './routes/notices';
import authRouter from './routes/auth';
import csrfRouter from './routes/csrf';
import { errorHandler } from './middlewares/error-handler';
import { CSRF_SECRET, PORT } from './config/env';

const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser(CSRF_SECRET));
app.use(express.json());

app.use('/api/csrf-token', csrfRouter);
app.use('/api/auth', authRouter);
app.use('/api/students', studentsRouter);
app.use('/api/notices', noticesRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});