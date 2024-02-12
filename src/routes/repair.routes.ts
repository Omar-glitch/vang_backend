import { Router } from "express";
import repairCtrl from "../controllers/repair.controller";

const repairRouter = Router();

repairRouter.get("/", repairCtrl.getRepairs);

repairRouter.get("/:id", repairCtrl.getRepair);

repairRouter.post("/", repairCtrl.postRepair);

repairRouter.put("/:id", repairCtrl.putRepair);

repairRouter.delete("/:id", repairCtrl.deleteRepair);

export default repairRouter;
