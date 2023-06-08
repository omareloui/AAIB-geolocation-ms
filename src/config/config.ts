import { join } from 'node:path';

export default () => ({
  environment: process.env.NODE_ENV,
  database: {
    url: process.env.DB_URL || './db/db.json',
    branchesWorkingHours:
      process.env.OPEN_CLOSE_TIMES_SRC ||
      join(__dirname, '..', 'db-scripts', 'branches-working-hours.xlsx'),
    withBranchesWorkingHours:
      process.env.DB_URL || './db/db-with_working_hours.json',
  },
  server: {
    port: process.env.PORT,
    timeout: process.env.TIMEOUT || 15000,
  },
});
