/**
 * Database Schema — Better Auth core tables + CodeAlchemist custom fields
 * Uses Drizzle ORM pgTable definitions for Supabase PostgreSQL
 */

import {
    pgTable,
    text,
    timestamp,
    boolean,
    integer,
} from "drizzle-orm/pg-core";

/* ============================================================
   User — Better Auth core + CodeAlchemist extensions
   ============================================================ */

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),

    // CodeAlchemist-specific fields
    xp: integer("xp").notNull().default(0),
    streak: integer("streak").notNull().default(0),
    role: text("role").notNull().default("user"),
});

/* ============================================================
   Session — Better Auth core
   ============================================================ */

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

/* ============================================================
   Account — Better Auth core (OAuth + credential providers)
   ============================================================ */

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/* ============================================================
   Verification — Better Auth core (email verification, etc.)
   ============================================================ */

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/* ============================================================
   CodeAlchemist App-Specific Tables
   ============================================================ */

/** User progress per chapter */
export const userProgress = pgTable("user_progress", {
    id: text("id").primaryKey().default("gen_random_uuid()::text"),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    chapterId: text("chapter_id").notNull(),
    exerciseId: text("exercise_id").notNull(),
    language: text("language").notNull(),
    completed: boolean("completed").notNull().default(false),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/** XP and streak tracking */
export const userStats = pgTable("user_stats", {
    id: text("id").primaryKey().default("gen_random_uuid()::text"),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }).unique(),
    xp: integer("xp").notNull().default(0),
    streak: integer("streak").notNull().default(0),
    lastActivityAt: timestamp("last_activity_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/** Code submissions history */
export const submission = pgTable("submission", {
    id: text("id").primaryKey().default("gen_random_uuid()::text"),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    exerciseId: text("exercise_id").notNull(),
    language: text("language").notNull(),
    code: text("code").notNull(),
    output: text("output"),
    success: boolean("success").notNull().default(false),
    executionMs: integer("execution_ms"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
