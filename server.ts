const dotenv = require('dotenv');
dotenv.config();
import express, { Express } from 'express';
import cors from 'cors';
import authRouter from './src/routes/auth';
import messageRouter from './src/routes/message';
import { prisma } from './src/db/index';
import { env } from './src/misc/env';
import { errorHandler } from './src/misc/globalErrorHandler';
import blockUserRouter from './src/routes/blockedUser';

const app: Express = express();

//add middleWares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//add routes
app.use('/api/users', authRouter);
app.use('/api/messages', messageRouter);
app.use('/api/blockedUser', blockUserRouter);
app.use(errorHandler);

//allow cors
app.use(cors({ origin: '*' }));

//dummy route
app.get('/', (req, res) => {
  res.send('grggrg');
});

async function main() {
  await prisma.$connect();
  console.log('Database connected successfully');

  app.listen(env.PORT, () => {
    console.log(
      `⚡️[server]: Server is running at http://localhost:${env.PORT}`
    );
  });
}

main();
