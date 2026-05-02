import { Router, type IRouter } from "express";
import { eq, like, and, SQL } from "drizzle-orm";
import { db, governmentSchemesTable } from "@workspace/db";
import {
  ListGovernmentSchemesQueryParams,
  GetGovernmentSchemeParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/government-schemes", async (req, res): Promise<void> => {
  const params = ListGovernmentSchemesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions: SQL[] = [];
  if (params.data.category) {
    conditions.push(eq(governmentSchemesTable.category, params.data.category));
  }
  if (params.data.search) {
    conditions.push(like(governmentSchemesTable.name, `%${params.data.search}%`));
  }

  const schemes =
    conditions.length > 0
      ? await db.select().from(governmentSchemesTable).where(and(...conditions))
      : await db.select().from(governmentSchemesTable);

  res.json(schemes);
});

router.get("/government-schemes/:id", async (req, res): Promise<void> => {
  const params = GetGovernmentSchemeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [scheme] = await db
    .select()
    .from(governmentSchemesTable)
    .where(eq(governmentSchemesTable.id, params.data.id));

  if (!scheme) {
    res.status(404).json({ error: "Scheme not found" });
    return;
  }

  res.json(scheme);
});

export default router;
