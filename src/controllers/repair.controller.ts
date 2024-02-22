import { Request, Response } from "express";
import Repair from "../models/repair";
import getErrorMessage from "../utils/errors";

const getRepairs = async (req: Request, res: Response) => {
  try {
    const repairs = await Repair.find();
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
    console.log(data);
    // const newRepair = new Repair({
    //   name: data.name,
    //   contact: data.contact,
    // });
    // await newRepair.save();
    // return res.json(newRepair);
    return res.json([]);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const putRepair = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    console.log(data);
    // const updatedRepair = await Repair.findByIdAndUpdate(
    //   id,
    //   {
    //     $set: {
    //       name: data.name,
    //       contact: data.contact,
    //     },
    //   },
    //   { returnDocument: "after", runValidators: true }
    // );
    // if (!updatedRepair) return res.status(404).json("Reparación no encontrada");
    // return res.json(updatedRepair);
    return res.json([]);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const deleteRepair = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repairToDelete = await Repair.findByIdAndDelete(id);
    if (!repairToDelete) res.status(404).json("Reparación no encontrada");
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
