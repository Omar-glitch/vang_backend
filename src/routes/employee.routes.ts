import { Router } from "express";
import employeeCtrl from "../controllers/employee.controller";

const employeeRouter = Router();

employeeRouter.get("/", employeeCtrl.getEmployees);

employeeRouter.get("/:id", employeeCtrl.getEmployee);

employeeRouter.post("/", employeeCtrl.postEmployee);

employeeRouter.put("/:id", employeeCtrl.putEmployee);

employeeRouter.delete("/:id", employeeCtrl.deleteEmployee);

export default employeeRouter;
