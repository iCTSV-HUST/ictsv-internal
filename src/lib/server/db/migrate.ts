// Run by pnpm run db:migrate
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { config } from 'dotenv';
config({ path: '.env' });
const sql = neon(process.env.DEVELOPER_ONLY_DATABASE_URL!);
const db = drizzle(sql);
const main = async () => {
	try {
		await migrate(db, {
			migrationsFolder: 'drizzle',
			migrationsTable: '__drizzle_migrations' // stays in public
		});
		console.log('Migration completed');
	} catch (error) {
		console.error('Error during migration:', error);
		process.exit(1);
	}
};
main();
