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
import { eq } from "drizzle-orm";

export const editCompany = async (
  data: CreateCompanyWithQualitiesSchema,
  companyId: string,
) => {
  if (!companyId) {
    return { message: "Company Id is required to update the company." };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session || !session.user) {
    return { message: "Log in to edit a company" };
  }

  const parsedInput = createCompanyWithQualitiesSchema.safeParse(data);
  if (!parsedInput.success) {
    return {
      message: "Something went wrong, Try again later!",
    };
  }

  try {
    await db
      .update(company)
      .set({
        name: parsedInput.data.company.name,
      })
      .where(eq(company.id, companyId));

    await db.delete(quality).where(eq(quality.companyId, companyId));

    await db.insert(quality).values(
      parsedInput.data.qualities.map((q) => ({
        ...q,
        companyId: companyId,
      })),
    );

    revalidatePath(`/dashboard/company/${companyId}`);
  } catch (error) {
    console.error("Error creating company:", error);
    return { message: "Failed to create company" };
  }
};
