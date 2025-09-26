import { workLog } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const baseWorkLogSchema = createInsertSchema(workLog, {
  machineNo: (schema) => schema.min(1, "Missing Mahine no."),
  karigarName: (schema) => schema.min(1, "Karigar name is required."),
  qualityId: z.uuid({ message: "Company is required." }),
}).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const createWorkLogSingleCompanySchema = baseWorkLogSchema.omit({
  companyId: true,
});

export const createWorkLogDashboardSchema = baseWorkLogSchema.extend({
  companyId: z.uuid("Company is required."),
});

export const createWorkLogServerSchema = baseWorkLogSchema.extend({
  companyId: z.uuid("Company is required."),
});

export type CreateWorkLogSingleCompany = z.infer<
  typeof createWorkLogSingleCompanySchema
>;
export type CreateWorkLogDashboard = z.infer<
  typeof createWorkLogDashboardSchema
>;
export type CreateWorkLogServerSchema = z.infer<
  typeof createWorkLogServerSchema
>;
