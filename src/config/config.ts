import { join } from 'node:path';

export default () => ({
  environment: process.env.NODE_ENV,
  database: {
    url: join(__dirname, '../../../db/db.json'),
  },
  server: {
    port: process.env.PORT,
    timeout: process.env.TIMEOUT || 15000,
  },
});
