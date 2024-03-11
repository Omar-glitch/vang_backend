import { Request, Response } from "express";
import Repair, {
  REPAIR_STATUS,
  REPAIR_TYPES,
  RepairDocument,
} from "../models/repair";
import getErrorMessage from "../utils/errors";
import { FilterQuery } from "mongoose";
import {
  querySort,
  rangeDateQueryId,
  rangeQuery,
  validEnumQuery,
  validStrQuery,
} from "../utils/query";
import billCtrl from "./bill.controller";
import inventoryCtrl from "./inventory.controller";

const repairFilter = (req: Request): FilterQuery<RepairDocument> => {
  const q = req.query.q;
  if (validStrQuery(q, { minLength: 2, maxLength: 16 }))
    return { description: { $regex: q } };
  if (validStrQuery(req.query._id, { minLength: 24, maxLength: 24 }))
    return { _id: req.query._id };
  const filter: FilterQuery<RepairDocument> = {};
  if (validStrQuery(req.query.employee, { minLength: 3, maxLength: 32 }))
    filter.employee = req.query.employee;
  if (validStrQuery(req.query.client, { minLength: 3, maxLength: 32 }))
    filter.client = req.query.client;
  if (validStrQuery(req.query.inventory, { minLength: 3, maxLength: 32 }))
    filter.inventory = req.query.inventory;
  if (validEnumQuery(req.query.status, REPAIR_STATUS))
    filter.status = req.query.status;
  if (validEnumQuery(req.query.type, REPAIR_TYPES))
    filter.type = req.query.type;
  rangeQuery(
    req.query.minPrice,
    req.query.maxPrice,
    { min: 50, max: 200_000 },
    "price",
    filter
  );
  rangeDateQueryId(req.query.minDate, req.query.maxDate, "_id", filter);
  return filter;
};

const getRepairs = async (req: Request, res: Response) => {
  try {
    const repairs = await Repair.find(repairFilter(req)).sort(
      querySort(req, ["date", "price"])
    );
    return res.json(repairs);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const getRepair = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const savedRepair = await Repair.findById(id);
    if (!savedRepair) return res.status(404).json("Reparación no encontrada");
    return res.json(savedRepair);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const postRepair = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const canDelInventory = await inventoryCtrl.canDecrementInventory(
      data.inventory,
      data.inventory_amount
    );
    if (!canDelInventory) return res.status(404).json("Poco inventario");
    const newRepair = new Repair({
      price: data.price,
      description: data.description,
      status: data.status,
      type: data.type,
      employee: data.employee,
      client: data.client,
      inventory: data.inventory,
      inventory_amount: data.inventory_amount,
    });
    await newRepair.save();
    await inventoryCtrl.putDecrementInventory(newRepair);
    await billCtrl.createBill(newRepair);
    return res.json(newRepair);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const putRepair = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedRepair = await Repair.findByIdAndUpdate(
      id,
      {
        $set: {
          price: data.price,
          description: data.description,
          status: data.status,
          type: data.type,
          employee: data.employee,
          client: data.client,
          inventory: data.inventory,
          inventory_amount: data.inventory_amount,
          inventory_cost: data.inventory_cost,
        },
      },
      { returnDocument: "after", runValidators: true }
    );
    if (!updatedRepair) return res.status(404).json("Reparación no encontrada");
    await billCtrl.updateBill(updatedRepair);
    return res.json(updatedRepair);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const putGenerateBillRepair = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repair = await Repair.findById(id);
    if (!repair) return res.status(404).json("Reparación no encontrada");
    await billCtrl.updateBill(repair);
    return res.json(repair);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const deleteRepair = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repairToDelete = await Repair.findByIdAndDelete(id);
    if (!repairToDelete)
      return res.status(404).json("Reparación no encontrada");
    return res.json(repairToDelete);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const repairCtrl = {
  getRepairs,
  getRepair,
  postRepair,
  putRepair,
  putGenerateBillRepair,
  deleteRepair,
};

export default repairCtrl;
