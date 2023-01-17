const dotenv = require('dotenv');
dotenv.config();
import express, { Express } from 'express';
import cors from 'cors';
import authRouter from './src/routes/auth';
import { prisma } from './src/db/index';
import { env } from './src/misc/env';
import { errorHandler } from './src/misc/globalErrorHandler';

const app: Express = express();

//allow cors
app.use(
  cors({
    origin: '*',
  })
);

//add middleWares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//add routes
app.use('api/users', authRouter);
app.use(errorHandler);

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
