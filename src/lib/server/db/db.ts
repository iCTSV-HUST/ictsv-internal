import * as schema from './schema';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$app/env/private';

const sql = neon(DATABASE_URL);
export const db = drizzle({ schema, client: sql, casing: 'snake_case' });
