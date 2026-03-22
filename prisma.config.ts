import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

config({ path: '.env.local' });

const databaseUrl = process.env.DIRECT_URL!;

export default defineConfig({
  datasource: {
    url: databaseUrl,
  },
});
