"use server";

import { auth } from "@/auth";

import { headers } from "next/headers";
import { db } from "..";
import { workLog } from "@/db/schema";
import { revalidatePath } from "next/cache";
import {
  createWorkLogServerSchema,
  type CreateWorkLogServerSchema,
} from "@/lib/validation/work-log";

export const createWorkLog = async (data: CreateWorkLogServerSchema) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session || !session.user) {
    return { message: "Log in to create a work log." };
  }

  const parsedInput = createWorkLogServerSchema.safeParse(data);
  if (!parsedInput.success) {
    return {
      message: "Something went wrong, Try again later!",
    };
  }

  try {
    await db.insert(workLog).values({
      ...parsedInput.data,
      userId: session.user.id,
    });

    revalidatePath(`/dashboard/company/${parsedInput.data.companyId}`);
  } catch (error) {
    console.error("Error creating company:", error);
    return { message: "Failed to create company" };
  }
};
