import { Request, Response } from "express";
import Bill from "../models/bill";
import getErrorMessage from "../utils/errors";

const getBills = async (req: Request, res: Response) => {
  try {
    const bills = await Bill.find();
    return res.json(bills);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const getBill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const savedBill = await Bill.findById(id);
    if (!savedBill) return res.status(404).json("Factura no encontrada");
    return res.json(savedBill);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const postBill = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newBill = new Bill({
      amount: data.amount,
      paid: data.paid,
      id_repair: data.id_repair,
    });
    await newBill.save();
    return res.json(newBill);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const putBill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedBill = await Bill.findByIdAndUpdate(
      id,
      {
        $set: {
          amount: data.amount,
          paid: data.paid,
          id_repair: data.id_repair,
        },
      },
      { returnDocument: "after", runValidators: true }
    );
    if (!updatedBill) return res.status(404).json("Factura no encontrada");
    return res.json(updatedBill);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const deleteBill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const billToDelete = await Bill.findByIdAndDelete(id);
    if (!billToDelete) return res.status(404).json("Factura no encontrada");
    return res.json(billToDelete);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const billCtrl = {
  getBills,
  getBill,
  postBill,
  putBill,
  deleteBill,
};

export default billCtrl;
