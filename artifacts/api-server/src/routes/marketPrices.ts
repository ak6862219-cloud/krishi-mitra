import { Router, type IRouter } from "express";
import { and, eq, like } from "drizzle-orm";
import { db, marketPricesTable } from "@workspace/db";
import { ListMarketPricesQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/market-prices/summary", async (_req, res): Promise<void> => {
  const allPrices = await db.select().from(marketPricesTable);

  const totalCrops = new Set(allPrices.map((p) => p.cropName)).size;
  const avgPriceChange =
    allPrices.length > 0
      ? allPrices.reduce((s, p) => s + p.changePercent, 0) / allPrices.length
      : 0;

  const sorted = [...allPrices].sort((a, b) => b.changePercent - a.changePercent);
  const topGainers = sorted.slice(0, 5);
  const topLosers = sorted.slice(-5).reverse();

  res.json({
    totalCrops,
    avgPriceChange: Math.round(avgPriceChange * 100) / 100,
    topGainers,
    topLosers,
    lastUpdated: new Date().toISOString(),
  });
});

router.get("/market-prices", async (req, res): Promise<void> => {
  const params = ListMarketPricesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.crop) {
    conditions.push(like(marketPricesTable.cropName, `%${params.data.crop}%`));
  }
  if (params.data.state) {
    conditions.push(eq(marketPricesTable.state, params.data.state));
  }

  const prices =
    conditions.length > 0
      ? await db.select().from(marketPricesTable).where(and(...conditions))
      : await db.select().from(marketPricesTable);

  res.json(prices);
});

export default router;
