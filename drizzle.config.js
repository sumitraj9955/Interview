/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:DshrJRU4iLo8@ep-red-mode-a5h8w3sc.us-east-2.aws.neon.tech/intervu?sslmode=require',
    }
  };