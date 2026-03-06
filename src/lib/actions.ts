"use server"

import { db } from "@/db"
import { userStats, userProgress } from "@/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function addXpAction(amount: number): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return

  const existing = await db.query.userStats.findFirst({
    where: eq(userStats.userId, session.user.id),
  })

  if (existing) {
    await db.update(userStats)
      .set({ xp: existing.xp + amount, updatedAt: new Date() })
      .where(eq(userStats.userId, session.user.id))
  } else {
    await db.insert(userStats).values({
      userId: session.user.id,
      xp: amount,
      streak: 1,
      lastActivityAt: new Date(),
    })
  }
}

export async function markProgressAction(
  chapterId: string,
  exerciseId: string,
  language: string,
): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return

  await db.insert(userProgress)
    .values({
      userId: session.user.id,
      chapterId,
      exerciseId,
      language,
      completed: true,
      completedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [
        userProgress.userId,
        userProgress.chapterId,
        userProgress.exerciseId,
        userProgress.language,
      ],
      set: {
        completed: true,
        completedAt: new Date(),
        updatedAt: new Date(),
      },
    })
}
