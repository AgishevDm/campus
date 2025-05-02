import express from 'express';
import routes from './routes/index';
import cors from 'cors';
// import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(
    cors({
      origin: [
        'http://localhost:3000',
        'http://localhost:4000',
        'http://localhost:3001',
        'http://176.123.160.42:3000',
        'http://176.123.160.42:3001',
        'https://176.123.160.42:3000',
        'https://176.123.160.42:3001',
        'http://imaps-psu.ru',
        'https://imaps-psu.ru', 
        'http://admin.imaps-psu.ru',
        'https://admin.imaps-psu.ru',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  // console.log('Headers:', req.headers);
  next();
});

  app.use(express.json());

app.use('/api', routes);

// app.use(errorHandler);

export default app;