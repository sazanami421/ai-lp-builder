import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

config({ path: '.env' });

const databaseUrl = process.env.DIRECT_URL!;

export default defineConfig({
  datasource: {
    url: databaseUrl,
  },
  migrate: {
    async adapter() {
      const pool = new Pool({ connectionString: databaseUrl });
      return new PrismaPg(pool);
    },
  },
});
