import { Request, Response } from "express";
import Hardware from "../models/hardware";
import getErrorMessage from "../utils/errors";

const getHardwares = async (req: Request, res: Response) => {
  try {
    const hardwares = await Hardware.find();
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
      min: data.min,
    });
    await newHardware.save();
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
