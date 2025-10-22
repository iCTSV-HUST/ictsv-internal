import * as schema from './schema'
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { env } from '$env/dynamic/private';

const sql = neon(env.DATABASE_URL!);
export const db = drizzle({ schema, client: sql, casing: 'snake_case' });
