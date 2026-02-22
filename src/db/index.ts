/**
 * Database — Drizzle ORM instance connected to Supabase PostgreSQL
 * Uses lazy initialization to avoid connection during build phase
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function createDb() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error(
            "DATABASE_URL is not set. Add it to .env.local with your Supabase connection string."
        );
    }

    // Create postgres.js client — disable prefetch for Supabase Transaction pooler compatibility
    const client = postgres(connectionString, {
        prepare: false,
    });

    return drizzle(client, { schema });
}

/** Lazily initialized Drizzle instance — only connects when first accessed at runtime */
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
    get(_target, prop, receiver) {
        if (!_db) {
            _db = createDb();
        }
        return Reflect.get(_db, prop, receiver);
    },
});
