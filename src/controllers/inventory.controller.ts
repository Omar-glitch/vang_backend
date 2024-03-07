import { Request, Response } from "express";
import Inventory, {
  INVENTORY_TYPES,
  InventoryDocument,
} from "../models/inventory";
import getErrorMessage from "../utils/errors";
import { FilterQuery } from "mongoose";
import {
  rangeQuery,
  validEnumQuery,
  validOrderQuery,
  validStrQuery,
} from "../utils/query";
import Purchase from "../models/purchase";

const inventoryFilter = (req: Request): FilterQuery<InventoryDocument> => {
  const q = req.query.q;
  if (validStrQuery(q, { minLength: 2, maxLength: 16 }))
    return { name: { $regex: q.toLowerCase() } };
  if (validStrQuery(req.query._id, { minLength: 24, maxLength: 24 }))
    return { _id: req.query._id };
  const filter: FilterQuery<InventoryDocument> = {};
  if (validEnumQuery(req.query.type, INVENTORY_TYPES))
    filter["type"] = req.query.type;
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

const getInventories = async (req: Request, res: Response) => {
  try {
    const inventories = await Inventory.find(inventoryFilter(req)).sort({
      _id: validOrderQuery(req.query.order),
    });
    return res.json(inventories);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const getInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const savedInventory = await Inventory.findById(id);
    if (!savedInventory)
      return res.status(404).json("Inventario no encontrado");
    return res.json(savedInventory);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const postInventory = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newInventory = new Inventory({
      name: data.name,
      description: data.description,
      stock: data.stock,
      type: data.type,
      cost: data.cost,
      min: data.min,
    });
    await newInventory.save();
    const newPurchase = new Purchase({
      cost: parseInt(data.cost) * parseInt(data.stock),
      description: `Compra de ${data.stock} ${data.name}, ${data.cost} c/u`,
      type: "inventario",
    });
    await newPurchase.save();
    return res.json(newInventory);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const putInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedInventory = await Inventory.findByIdAndUpdate(
      id,
      {
        $set: {
          name: data.name,
          description: data.description,
          stock: data.stock,
          type: data.type,
          cost: data.cost,
          min: data.min,
        },
      },
      { returnDocument: "after", runValidators: true }
    );
    if (!updatedInventory)
      return res.status(404).json("Inventario no encontrado");
    return res.json(updatedInventory);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const deleteInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const inventoryToDelete = await Inventory.findByIdAndDelete(id);
    if (!inventoryToDelete)
      return res.status(404).json("Inventario no encontrado");
    return res.json(inventoryToDelete);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const inventoryCtrl = {
  getInventories,
  getInventory,
  postInventory,
  putInventory,
  deleteInventory,
};

export default inventoryCtrl;
