import { resolve } from 'node:path';

export default () => ({
  environment: process.env.NODE_ENV,
  database: {
    url: resolve(process.env.DB_URL || './db/db.json'),
  },
  server: {
    port: process.env.PORT,
    timeout: process.env.TIMEOUT || 15000,
  },
});
