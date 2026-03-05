import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
    try {
        const result = await pool.query('SELECT COUNT(*) as count FROM "user"');
        const userCount = parseInt(result.rows[0].count);

        return NextResponse.json({ userCount });
    } catch (error) {
        console.error("Failed to fetch user count:", error);
        // Fallback to static count if DB query fails
        return NextResponse.json({ userCount: 12000 });
    }
}