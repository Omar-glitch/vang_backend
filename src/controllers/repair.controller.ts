import { Request, Response } from "express";
import Repair, {
  REPAIR_STATUS,
  REPAIR_TYPES,
  RepairDocument,
} from "../models/repair";
import getErrorMessage from "../utils/errors";
import { FilterQuery } from "mongoose";
import {
  rangeDateQuery,
  rangeQuery,
  validEnumQuery,
  validOrderQuery,
  validStrQuery,
} from "../utils/query";

const repairFilter = (req: Request): FilterQuery<RepairDocument> => {
  const q = req.query.q;
  if (validStrQuery(q, { minLength: 2, maxLength: 16 }))
    return { type: { $regex: q.toLowerCase() } };
  if (validStrQuery(req.query._id, { minLength: 24, maxLength: 24 }))
    return { _id: req.query._id };
  if (validStrQuery(req.query.id_repairer, { minLength: 24, maxLength: 24 }))
    return { _id: req.query.id_repairer };
  if (validStrQuery(req.query.id_client, { minLength: 24, maxLength: 24 }))
    return { _id: req.query.id_client };
  if (validStrQuery(req.query.id_inventory, { minLength: 24, maxLength: 24 }))
    return { _id: req.query.id_inventory };
  const filter: FilterQuery<RepairDocument> = {};
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
  rangeDateQuery(req.query.minDate, req.query.maxDate, "createdAt", filter);
  return filter;
};

const getRepairs = async (req: Request, res: Response) => {
  try {
    const repairs = await Repair.find(repairFilter(req)).sort({
      _id: validOrderQuery(req.query.order),
    });
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
    const newRepair = new Repair({
      price: data.price,
      description: data.description,
      status: data.status,
      type: data.type,
      id_employee: data.id_employee,
      id_client: data.id_client,
      id_inventory: data.id_inventory,
      inventory_amount: data.inventory_amount,
      inventory_cost: data.inventory_cost,
    });
    await newRepair.save();
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
          id_employee: data.id_employee,
          id_client: data.id_client,
          id_inventory: data.id_inventory,
          inventory_amount: data.inventory_amount,
          inventory_cost: data.inventory_cost,
        },
      },
      { returnDocument: "after", runValidators: true }
    );
    if (!updatedRepair) return res.status(404).json("Reparación no encontrada");
    return res.json(updatedRepair);
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
  deleteRepair,
};

export default repairCtrl;
