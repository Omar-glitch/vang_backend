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
import purchaseCtrl from "./purchase.controller";
import Repair from "../models/repair";

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
    if (newInventory.stock > 80)
      return res.json(400).json("Máximo 80 al crear de inventario");
    await newInventory.save();
    await purchaseCtrl.createPurchase({
      cost: newInventory.cost * newInventory.stock,
      description: `Compra de ${newInventory.stock} ${newInventory.name}, ${newInventory.cost} c/u`,
      type: "inventario",
    });
    return res.json(newInventory);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const putInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const inventoryToUpdate = await Inventory.findById(id);
    if (!inventoryToUpdate)
      return res.status(404).json("Inventario no encontrado");
    const updatedInventory = await Inventory.updateOne(
      { _id: id },
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
      { runValidators: true }
    );
    if (!updatedInventory.modifiedCount)
      return res.status(404).json("Inventario no encontrado");
    await Repair.updateMany(
      { inventory: inventoryToUpdate.name },
      { $set: { inventory: data.name } }
    );
    return res.json({});
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const canDecrementInventory = async (
  name: string,
  amount: string
): Promise<boolean> => {
  try {
    const valueToQuit = parseInt(amount);
    if (!name) return false;
    if (isNaN(valueToQuit)) return false;
    if (valueToQuit < 1 || valueToQuit > 8) return false;
    const inventory = await Inventory.findOne({ name });
    if (!inventory) return false;
    if (inventory.stock - valueToQuit < 0) return false;
    return true;
  } catch (e) {
    return false;
  }
};

const putAddInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const valueToAdd = parseInt(data.toAdd);
    if (isNaN(valueToAdd))
      return res.status(400).json("El valor a agregar es inválido");
    if (valueToAdd <= 0) return res.status(400).json("El valor es menor que 1");
    if (valueToAdd > 80)
      return res.status(400).json("El valor es mayor que 80");

    const updatedInventory = await Inventory.findByIdAndUpdate(
      id,
      {
        $inc: {
          stock: valueToAdd,
        },
      },
      { returnDocument: "after", runValidators: true }
    );
    if (!updatedInventory)
      return res.status(404).json("Inventario no encontrado");
    await purchaseCtrl.createPurchase({
      cost: updatedInventory.cost * valueToAdd,
      description: `Compra de ${valueToAdd} ${updatedInventory.name}, ${updatedInventory.cost} c/u`,
      type: "inventario",
    });
    return res.json(updatedInventory);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const putDecrementInventory = async (repair: any) => {
  try {
    const updatedInventory = await Inventory.findOneAndUpdate(
      { name: repair.inventory },
      {
        $inc: {
          stock: -repair.inventory_amount,
        },
      },
      { returnDocument: "after", runValidators: true }
    );
    if (!updatedInventory) console.log("No hay inventario");
  } catch (e) {
    console.log(getErrorMessage(e));
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
  canDecrementInventory,
  putAddInventory,
  putDecrementInventory,
  deleteInventory,
};

export default inventoryCtrl;
