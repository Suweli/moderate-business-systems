import { Pool, type QueryResultRow } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __mbsPgPool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured.');
  }

  const sslEnabled = process.env.DATABASE_SSL === 'true';

  return new Pool({
    connectionString,
    ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
  });
}

export function getPool() {
  if (!global.__mbsPgPool) {
    global.__mbsPgPool = createPool();
  }
  return global.__mbsPgPool;
}

export async function dbQuery<T extends QueryResultRow>(text: string, params: unknown[] = []) {
  return getPool().query<T>(text, params);
}
