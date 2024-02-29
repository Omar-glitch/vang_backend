import { Router } from "express";
import hardwareCtrl from "../controllers/hardware.controller";

const hardwareRouter = Router();

hardwareRouter.get("/", hardwareCtrl.getHardwares);

hardwareRouter.get("/:id", hardwareCtrl.getHardware);

hardwareRouter.post("/", hardwareCtrl.postHardware);

hardwareRouter.put("/:id", hardwareCtrl.putHardware);

hardwareRouter.delete("/:id", hardwareCtrl.deleteHardware);

export default hardwareRouter;
