import { Router } from "express";
import clientCtrl from "../controllers/client.controller";

const clientRouter = Router();

clientRouter.get("/", clientCtrl.getClients);

clientRouter.get("/:id", clientCtrl.getClient);

clientRouter.post("/", clientCtrl.postClient);

clientRouter.put("/:id", clientCtrl.putClient);

clientRouter.delete("/:id", clientCtrl.deleteClient);

export default clientRouter;
