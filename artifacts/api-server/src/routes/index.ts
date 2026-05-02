import { Router, type IRouter } from "express";
import healthRouter from "./health";
import conversationsRouter from "./conversations";
import diseaseDetectionRouter from "./diseaseDetection";
import weatherRouter from "./weather";
import marketPricesRouter from "./marketPrices";
import governmentSchemesRouter from "./governmentSchemes";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(conversationsRouter);
router.use(diseaseDetectionRouter);
router.use(weatherRouter);
router.use(marketPricesRouter);
router.use(governmentSchemesRouter);
router.use(dashboardRouter);

export default router;
