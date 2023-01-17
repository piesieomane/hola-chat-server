import { cleanEnv, str, num } from 'envalid';

export const env = cleanEnv(process.env, {
  JWT_SECRET: str(),
  PORT: num({ default: 8000 }),
  DATABASE_URL: str(),
});
