import { Router } from "express";
import purchaseCtrl from "../controllers/purchase.controller";

const purchaseRouter = Router();

purchaseRouter.get("/", purchaseCtrl.getPurchases);

purchaseRouter.get("/:id", purchaseCtrl.getPurchase);

purchaseRouter.delete("/:id", purchaseCtrl.deletePurchase);

export default purchaseRouter;
