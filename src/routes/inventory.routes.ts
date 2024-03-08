import { Router } from "express";
import inventoryCtrl from "../controllers/inventory.controller";

const inventoryRouter = Router();

inventoryRouter.get("/", inventoryCtrl.getInventories);

inventoryRouter.get("/:id", inventoryCtrl.getInventory);

inventoryRouter.post("/", inventoryCtrl.postInventory);

inventoryRouter.put("/:id", inventoryCtrl.putInventory);

inventoryRouter.put("/add/:id", inventoryCtrl.putAddInventory);

inventoryRouter.delete("/:id", inventoryCtrl.deleteInventory);

export default inventoryRouter;
