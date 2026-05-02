import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, marketPricesTable, governmentSchemesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const schemes = await db.select().from(governmentSchemesTable);
  const activeSchemes = schemes.filter((s) => s.isActive).length;

  const prices = await db.select().from(marketPricesTable);
  const cropCount = new Set(prices.map((p) => p.cropName)).size;

  const topGainer = prices.sort((a, b) => b.changePercent - a.changePercent)[0];
  const marketHighlight = topGainer
    ? `${topGainer.cropName} up ${topGainer.changePercent.toFixed(1)}% at ₹${topGainer.modalPrice}/qtl`
    : "Check market prices for today's updates";

  res.json({
    totalSchemes: schemes.length,
    activeSchemes,
    cropCount,
    recentDetections: 0,
    weatherAlert: false,
    marketHighlight,
  });
});

export default router;
