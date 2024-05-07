import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';
import { errorMiddleware } from './middlewares/error-middleware.js';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use('/api', router);
app.use(errorMiddleware);

dotenv.config();
const PORT = process.env.PORT;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Server is on: PORT ${PORT}`);
});
