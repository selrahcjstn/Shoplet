import 'dotenv/config';
import { Pool } from 'pg';

let pool: Pool | undefined;

/**
 * Plain SQL access for reports that need GROUP BY / date maths the ORM does not
 * express. Created on first use so importing this file costs nothing.
 */
export function getPool(): Pool {
  pool ??= new Pool({ connectionString: process.env['DATABASE_URL'] });
  return pool;
}
