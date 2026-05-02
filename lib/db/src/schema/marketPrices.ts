import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const marketPricesTable = pgTable("market_prices", {
  id: serial("id").primaryKey(),
  cropName: text("crop_name").notNull(),
  variety: text("variety").notNull().default("General"),
  state: text("state").notNull(),
  market: text("market").notNull(),
  minPrice: real("min_price").notNull(),
  maxPrice: real("max_price").notNull(),
  modalPrice: real("modal_price").notNull(),
  unit: text("unit").notNull().default("Quintal"),
  date: text("date").notNull(),
  trend: text("trend").notNull().default("stable"),
  changePercent: real("change_percent").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertMarketPriceSchema = createInsertSchema(marketPricesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMarketPrice = z.infer<typeof insertMarketPriceSchema>;
export type MarketPrice = typeof marketPricesTable.$inferSelect;
