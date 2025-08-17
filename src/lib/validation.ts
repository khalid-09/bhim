import { company, quality } from "@/db/schema";
import { z } from "better-auth";
import { createInsertSchema } from "drizzle-zod";

export const createCompanySchema = createInsertSchema(company, {
  name: (schema) => schema.min(1, "Company Name is required"),
}).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const createQualitySchema = createInsertSchema(quality, {
  name: (schema) => schema.min(1, "Quality Name is required"),
  payableRate: (schema) => schema.min(1, "Payable Rate is required"),
  receivableRate: (schema) => schema.min(1, "Receivable Rate is required"),
}).omit({
  id: true,
  companyId: true,
  createdAt: true,
  updatedAt: true,
});

export const createCompanyWithQualitiesSchema = z.object({
  company: createCompanySchema,
  qualities: z
    .array(createQualitySchema)
    .min(1, "At least one quality required"),
});

export type CreateCompanyWithQualitiesSchema = z.infer<
  typeof createCompanyWithQualitiesSchema
>;
