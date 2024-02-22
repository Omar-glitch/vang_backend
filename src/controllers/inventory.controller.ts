import { Request, Response } from "express";
import Inventory from "../models/inventory";
import getErrorMessage from "../utils/errors";

const getInventories = async (req: Request, res: Response) => {
  try {
    const inventories = await Inventory.find();
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
    if (!inventoryToDelete) res.status(404).json("Inventario no encontrado");
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
