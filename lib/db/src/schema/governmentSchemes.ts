import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const governmentSchemesTable = pgTable("government_schemes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  benefits: text("benefits").notNull(),
  eligibility: text("eligibility").notNull(),
  applicationProcess: text("application_process").notNull(),
  deadline: text("deadline"),
  isActive: boolean("is_active").notNull().default(true),
  ministry: text("ministry").notNull(),
  website: text("website"),
  helpline: text("helpline"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertGovernmentSchemeSchema = createInsertSchema(governmentSchemesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertGovernmentScheme = z.infer<typeof insertGovernmentSchemeSchema>;
export type GovernmentScheme = typeof governmentSchemesTable.$inferSelect;
