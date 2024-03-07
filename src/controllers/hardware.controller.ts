import { Request, Response } from "express";
import Hardware, {
  HARDWARE_PRIORITIES,
  HardwareDocument,
} from "../models/hardware";
import getErrorMessage from "../utils/errors";
import { FilterQuery } from "mongoose";
import {
  rangeQuery,
  validEnumQuery,
  validOrderQuery,
  validStrQuery,
} from "../utils/query";
import Purchase from "../models/purchase";

const hardwareFilter = (req: Request): FilterQuery<HardwareDocument> => {
  const q = req.query.q;
  if (validStrQuery(q, { minLength: 2, maxLength: 16 }))
    return { name: { $regex: q.toLowerCase() } };
  if (validStrQuery(req.query._id, { minLength: 24, maxLength: 24 }))
    return { _id: req.query._id };
  let filter: FilterQuery<HardwareDocument> = {};
  if (validEnumQuery(req.query.priority, HARDWARE_PRIORITIES))
    filter["priority"] = req.query.priority;
  rangeQuery(
    req.query.minCost,
    req.query.maxCost,
    { min: 20, max: 120_000 },
    "cost",
    filter
  );
  rangeQuery(
    req.query.minStock,
    req.query.maxStock,
    { min: 0, max: 2500 },
    "stock",
    filter
  );
  return filter;
};

const getHardwares = async (req: Request, res: Response) => {
  try {
    const hardwares = await Hardware.find(hardwareFilter(req)).sort({
      _id: validOrderQuery(req.query.order),
    });
    return res.json(hardwares);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const getHardware = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const savedHardware = await Hardware.findById(id);
    if (!savedHardware) return res.status(404).json("Equipo no encontrado");
    return res.json(savedHardware);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const postHardware = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newHardware = new Hardware({
      name: data.name,
      description: data.description,
      type: data.type,
      stock: data.stock,
      cost: data.cost,
      priority: data.priority,
      min: data.min,
    });
    await newHardware.save();
    const newPurchase = new Purchase({
      cost: parseInt(data.cost) * parseInt(data.stock),
      description: `Compra de ${data.stock} ${data.name}, ${data.cost} c/u`,
      type: "equipo",
    });
    await newPurchase.save();
    return res.json(newHardware);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const putHardware = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedHardware = await Hardware.findByIdAndUpdate(
      id,
      {
        $set: {
          name: data.name,
          description: data.description,
          type: data.type,
          stock: data.stock,
          cost: data.cost,
          priority: data.priority,
          min: data.min,
        },
      },
      { returnDocument: "after", runValidators: true }
    );
    if (!updatedHardware) return res.status(404).json("Equipo no encontrado");
    return res.json(updatedHardware);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const deleteHardware = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hardwareToDelete = await Hardware.findByIdAndDelete(id);
    if (!hardwareToDelete) return res.status(404).json("Equipo no encontrado");
    return res.json(hardwareToDelete);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const hardwareCtrl = {
  getHardwares,
  getHardware,
  postHardware,
  putHardware,
  deleteHardware,
};

export default hardwareCtrl;
