import { join } from 'node:path';

export default () => ({
  environment: process.env.NODE_ENV,
  database: {
    url: join(process.env.PWD!, process.env.DB_URL || './db/db.json'),
  },
  server: {
    port: process.env.PORT,
    timeout: process.env.TIMEOUT || 15000,
  },
  rabbitMQ: {
    host: process.env.RABBIT_URL,
    messageExpiration: process.env.TIMEOUT || 15000,
    queues: {
      paymentsRequestQueue: 'paymentsRequestQueue',
      cyberSourceRequestQueue: 'cyberSourceRequestQueue',
      mpgsRequestQueue: 'mpgsRequestQueue',
    },
  },
});
