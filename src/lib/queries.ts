/**
 * Database Queries — Typed server-side functions for CodeAlchemist
 * Uses pg Pool directly for database operations
 */

"use server";

import { Pool } from "pg";
import type { UserProgress, UserStats, Submission } from "@/types";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export interface SubmissionInput {
    userId: string;
    exerciseId: string;
    language: string;
    code: string;
    output: string | null;
    success: boolean;
    executionMs: number | null;
}

/** Get user progress for all completed exercises */
export async function getUserProgress(userId: string): Promise<UserProgress[]> {
    const result = await pool.query(`
        SELECT id, user_id as "userId", chapter_id as "chapterId", exercise_id as "exerciseId",
               language, completed, completed_at as "completedAt"
        FROM user_progress
        WHERE user_id = $1
        ORDER BY created_at DESC
    `, [userId]);

    return result.rows;
}

/** Upsert progress for an exercise */
export async function upsertProgress(
    userId: string,
    chapterId: string,
    exerciseId: string,
    language: string
): Promise<void> {
    await pool.query(`
        INSERT INTO user_progress (user_id, chapter_id, exercise_id, language, completed, completed_at, updated_at)
        VALUES ($1, $2, $3, $4, true, NOW(), NOW())
        ON CONFLICT (user_id, chapter_id, exercise_id, language)
        DO UPDATE SET
            completed = true,
            completed_at = NOW(),
            updated_at = NOW()
    `, [userId, chapterId, exerciseId, language]);
}

/** Get user stats (XP, streak, etc.) */
export async function getUserStats(userId: string): Promise<UserStats> {
    const result = await pool.query(`
        SELECT id, user_id as "userId", xp, streak, last_activity_at as "lastActivityAt"
        FROM user_stats
        WHERE user_id = $1
    `, [userId]);

    if (result.rows.length === 0) {
        // Create default stats if none exist
        const insertResult = await pool.query(`
            INSERT INTO user_stats (user_id, xp, streak)
            VALUES ($1, 0, 0)
            RETURNING id, user_id as "userId", xp, streak, last_activity_at as "lastActivityAt"
        `, [userId]);
        return insertResult.rows[0];
    }

    return result.rows[0];
}

/** Add XP to user and update streak */
export async function addXP(userId: string, amount: number): Promise<UserStats> {
    const result = await pool.query(`
        UPDATE user_stats
        SET xp = xp + $2, last_activity_at = NOW(), updated_at = NOW()
        WHERE user_id = $1
        RETURNING id, user_id as "userId", xp, streak, last_activity_at as "lastActivityAt"
    `, [userId, amount]);

    return result.rows[0];
}

/** Update user streak */
export async function updateStreak(userId: string): Promise<UserStats> {
    const result = await pool.query(`
        UPDATE user_stats
        SET streak = streak + 1, last_activity_at = NOW(), updated_at = NOW()
        WHERE user_id = $1
        RETURNING id, user_id as "userId", xp, streak, last_activity_at as "lastActivityAt"
    `, [userId]);

    return result.rows[0];
}

/** Save a code submission */
export async function saveSubmission(data: SubmissionInput): Promise<Submission> {
    const result = await pool.query(`
        INSERT INTO submission (user_id, exercise_id, language, code, output, success, execution_ms)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, user_id as "userId", exercise_id as "exerciseId", language, code, output, success, execution_ms as "executionMs", created_at as "createdAt"
    `, [data.userId, data.exerciseId, data.language, data.code, data.output, data.success, data.executionMs]);

    return result.rows[0];
}

/** Get submission history for an exercise */
export async function getSubmissionHistory(
    userId: string,
    exerciseId: string,
    language: string
): Promise<Submission[]> {
    const result = await pool.query(`
        SELECT id, user_id as "userId", exercise_id as "exerciseId", language, code, output, success,
               execution_ms as "executionMs", created_at as "createdAt"
        FROM submission
        WHERE user_id = $1 AND exercise_id = $2 AND language = $3
        ORDER BY created_at DESC
        LIMIT 50
    `, [userId, exerciseId, language]);

    return result.rows;
}