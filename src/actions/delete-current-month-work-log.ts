"use server";

import { auth } from "@/auth";
import { headers } from "next/headers";
import { db } from "..";
import { workLog } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { and, eq, gte, lte } from "drizzle-orm";

export const deleteCurrentMonthWorkLogs = async (companyId: string) => {
  if (!companyId) {
    return { message: "Company id is required." };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session || !session.user) {
    return { message: "Log in to delete work logs." };
  }

  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    await db
      .delete(workLog)
      .where(
        and(
          eq(workLog.companyId, companyId),
          gte(workLog.date, firstDay),
          lte(workLog.date, lastDay),
        ),
      );

    revalidatePath(`/dashboard/company/${companyId}`);

    return { message: "All work logs for this month deleted successfully!" };
  } catch (error) {
    console.error("Error deleting monthly work logs:", error);
    return { message: "Failed to delete monthly work logs." };
  }
};
