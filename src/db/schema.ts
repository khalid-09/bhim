import {
  pgTable,
  text,
  timestamp,
  boolean,
  decimal,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Auth tables

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

// App tables
export const company = pgTable("company", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const quality = pgTable("quality", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  payableRate: decimal("payable_rate", { precision: 10, scale: 2 }).notNull(),
  receivableRate: decimal("receivable_rate", {
    precision: 10,
    scale: 2,
  }).notNull(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => company.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const workLog = pgTable("work_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: timestamp("date").notNull(),
  machineNo: text("machine_no").notNull(),
  taar: decimal("taar", { precision: 10, scale: 3 }).notNull(),
  karigarName: text("karigar_name").notNull(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => company.id, { onDelete: "cascade" }),
  qualityId: uuid("quality_id")
    .notNull()
    .references(() => quality.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
  companies: many(company),
  workLogs: many(workLog),
}));

export const companyRelations = relations(company, ({ one, many }) => ({
  user: one(user, {
    fields: [company.userId],
    references: [user.id],
  }),
  qualities: many(quality),
  workLogs: many(workLog),
}));

export const qualityRelations = relations(quality, ({ one, many }) => ({
  company: one(company, {
    fields: [quality.companyId],
    references: [company.id],
  }),
  workLogs: many(workLog),
}));

export const workLogRelations = relations(workLog, ({ one }) => ({
  user: one(user, {
    fields: [workLog.userId],
    references: [user.id],
  }),
  company: one(company, {
    fields: [workLog.companyId],
    references: [company.id],
  }),
  quality: one(quality, {
    fields: [workLog.qualityId],
    references: [quality.id],
  }),
}));

// Types :
//  Select Types
export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;
export type Company = typeof company.$inferSelect;
export type Quality = typeof quality.$inferSelect;
export type WorkLog = typeof workLog.$inferSelect;

//  Insert Types
export type NewUser = typeof user.$inferInsert;
export type NewSession = typeof session.$inferInsert;
export type NewAccount = typeof account.$inferInsert;
export type NewVerification = typeof verification.$inferInsert;
export type NewCompany = typeof company.$inferInsert;
export type NewQuality = typeof quality.$inferInsert;
export type NewWorkLog = typeof workLog.$inferInsert;
