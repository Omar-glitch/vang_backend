import { Router } from "express";
import purchaseCtrl from "../controllers/purchase.controller";

const purchaseRouter = Router();

purchaseRouter.get("/", purchaseCtrl.getPurchases);

purchaseRouter.get("/:id", purchaseCtrl.getPurchase);

purchaseRouter.post("/", purchaseCtrl.postPurchase);

purchaseRouter.put("/:id", purchaseCtrl.putPurchase);

purchaseRouter.delete("/:id", purchaseCtrl.deletePurchase);

export default purchaseRouter;
