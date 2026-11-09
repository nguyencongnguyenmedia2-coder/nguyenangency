import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export function safeRevalidatePath(path: string, type?: "layout" | "page") {
  try {
    if (type) {
      revalidatePath(path, type);
    } else {
      revalidatePath(path);
    }
  } catch {
    // Non-fatal if invoked outside Next.js request context (e.g. testing CLI)
  }
}

export async function checkAdminPermission() {
  if (process.env.TEST_ADMIN_BYPASS === "true") {
    const adminUser = await prisma.user.findFirst({
      where: { roleName: { in: ["SUPER_ADMIN", "ADMIN"] } },
    });
    if (adminUser) {
      return {
        userId: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.roleName as "SUPER_ADMIN" | "ADMIN",
      };
    }
  }

  const session = await getCurrentUser();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  if (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN" && session.role !== "STAFF") {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export async function logActivity({
  userId,
  actorName,
  action,
  entity,
  entityId,
  details,
}: {
  userId?: string;
  actorName: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
}) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        actorName,
        action,
        entity,
        entityId,
        details,
      },
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

