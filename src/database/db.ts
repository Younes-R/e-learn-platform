import { neon } from "@neondatabase/serverless";

//const sql = neon(process.env.DATABASE_URL!);

export async function getPostgresVersion() {
  const sql = neon(
    "postgres://neondb_owner:npg_n45eBSKAwYHZ@ep-lively-paper-a4s5doy2-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
  );
  const res = await sql`SELECT versionm();`;
  console.log(res);
}

getPostgresVersion();
