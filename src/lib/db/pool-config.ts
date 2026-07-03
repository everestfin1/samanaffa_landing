import type pg from 'pg';

/**
 * Build a pg Pool config that does not let connection-string sslmode override
 * explicit TLS options (pg v8 treats prefer/require as verify-full).
 */
export function pgPoolConfig(
  connectionString: string,
  extra?: Omit<pg.PoolConfig, 'connectionString' | 'ssl'>,
): pg.PoolConfig {
  const parsed = new URL(connectionString);
  const sslmode = parsed.searchParams.get('sslmode');
  parsed.searchParams.delete('sslmode');

  let ssl: pg.PoolConfig['ssl'];
  if (!sslmode || sslmode === 'disable') {
    ssl = undefined;
  } else if (sslmode === 'verify-full') {
    ssl = { rejectUnauthorized: true };
  } else {
    // prefer, require, verify-ca — db-srv internal cert on private VLAN
    ssl = { rejectUnauthorized: false };
  }

  return {
    connectionString: parsed.toString(),
    ssl,
    max: 10,
    ...extra,
  };
}
