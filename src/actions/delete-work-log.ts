"use server";

import { auth } from "@/auth";
import { headers } from "next/headers";
import { db } from "..";
import { workLog } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export const deleteWorkLog = async (workLogId: string) => {
  if (!workLogId) {
    return { message: "Id is required to delete a worklog." };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session || !session.user) {
    return { message: "Log in to delete a company" };
  }

  try {
    await db.delete(workLog).where(eq(workLog.id, workLogId));

    revalidatePath(`/dashboard/company/${workLogId}`);

    return { message: "WorkLog deleted successfully!" };
  } catch (error) {
    console.error("Error deleting company:", error);
    return { message: "Failed to delete company" };
  }
};
