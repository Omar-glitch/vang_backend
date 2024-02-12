import { Router } from "express";
import billCtrl from "../controllers/bill.controller";

const billRouter = Router();

billRouter.get("/", billCtrl.getBills);

billRouter.get("/:id", billCtrl.getBill);

billRouter.post("/", billCtrl.postBill);

billRouter.put("/:id", billCtrl.putBill);

billRouter.delete("/:id", billCtrl.deleteBill);

export default billRouter;
