import express from 'express';
import 'dotenv/config';
import routes from './routes/TaskRoutes.js';
import authRoutes from './routes/AuthRoutes.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/task', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
