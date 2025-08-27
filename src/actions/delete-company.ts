"use server";

import { auth } from "@/auth";
import { headers } from "next/headers";
import { db } from "..";
import { company } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export const deleteCompany = async (companyId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session || !session.user) {
    return { message: "Log in to delete a company" };
  }

  try {
    await db.delete(company).where(eq(company.id, companyId));

    revalidatePath("/dashboard/company");
    revalidatePath(`/dashboard/company/${companyId}`);

    // Return a success message.
    return { message: "Company deleted successfully!" };
  } catch (error) {
    // Log and return an error message if the deletion fails.
    console.error("Error deleting company:", error);
    return { message: "Failed to delete company" };
  }
};
