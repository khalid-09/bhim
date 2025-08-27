"use server";

import { auth } from "@/auth";
import {
  createCompanyWithQualitiesSchema,
  type CreateCompanyWithQualitiesSchema,
} from "@/lib/validation/company";
import { headers } from "next/headers";
import { db } from "..";
import { company, quality } from "@/db/schema";
import { revalidatePath } from "next/cache";

export const createCompany = async (data: CreateCompanyWithQualitiesSchema) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session || !session.user) {
    return { message: "Log in to create a company" };
  }

  const parsedInput = createCompanyWithQualitiesSchema.safeParse(data);
  if (!parsedInput.success) {
    return {
      message: "Something went wrong, Try again later!",
    };
  }

  try {
    // Insert company
    const [newCompany] = await db
      .insert(company)
      .values({
        name: parsedInput.data.company.name,
        userId: session.user.id,
      })
      .returning();

    // Insert company qualities
    await db
      .insert(quality)
      .values(
        parsedInput.data.qualities.map((q) => ({
          ...q,
          companyId: newCompany?.id || "",
        })),
      )
      .returning();

    revalidatePath("/dashboard/company");
    revalidatePath(`/dashboard/company/${newCompany?.id}`);
  } catch (error) {
    console.error("Error creating company:", error);
    return { message: "Failed to create company" };
  }
};
