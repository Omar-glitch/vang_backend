import { Request, Response } from "express";
import Bill, { BillDocument } from "../models/bill";
import getErrorMessage from "../utils/errors";
import {
  rangeDateQuery,
  rangeQuery,
  validEnumQuery,
  validOrderQuery,
  validStrQuery,
} from "../utils/query";
import mongoose, { FilterQuery } from "mongoose";
import { REPAIR_TYPES } from "../models/repair";

const billFilter = (req: Request): FilterQuery<BillDocument> => {
  const q = req.query.q;
  if (validStrQuery(q, { minLength: 2, maxLength: 16 }))
    return { description: { $regex: q } };
  if (validStrQuery(req.query._id, { minLength: 24, maxLength: 24 }))
    return { _id: req.query._id };
  if (validStrQuery(req.query.id_repair, { minLength: 24, maxLength: 24 }))
    return { id_repair: req.query.id_repair };
  const filter: FilterQuery<BillDocument> = {};
  if (validEnumQuery(req.query.type, REPAIR_TYPES))
    filter.type = req.query.type;
  rangeQuery(
    req.query.minAmount,
    req.query.maxAmount,
    { min: 20, max: 1_000_000 },
    "amount",
    filter
  );
  rangeDateQuery(req.query.minDate, req.query.maxDate, "createdAt", filter);
  if (req.query.paid) {
    if (req.query.paid === "true") filter.paid = true;
    if (req.query.paid === "false") filter.paid = false;
  }
  return filter;
};

const getBills = async (req: Request, res: Response) => {
  try {
    const bills = await Bill.find(billFilter(req)).sort({
      _id: validOrderQuery(req.query.order),
    });
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

const createBill = async (repair: any) => {
  try {
    const newBill = new Bill({
      amount: repair.price,
      description: repair.description,
      paid: false,
      type: repair.type,
      id_repair: repair._id,
    });
    await newBill.save();
  } catch (e) {
    console.log(getErrorMessage(e));
  }
};

const updateBill = async (repair: any) => {
  try {
    const updatedBill = await Bill.findOneAndUpdate(
      { id_repair: new mongoose.Types.ObjectId(repair._id) },
      {
        $set: {
          description: repair.description,
          amount: repair.price,
        },
      },
      { returnDocument: "after", runValidators: true }
    );
    if (!updatedBill) await createBill(repair);
  } catch (e) {
    console.log(getErrorMessage(e));
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
          paid: data.paid,
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
  createBill,
  updateBill,
  putBill,
  deleteBill,
};

export default billCtrl;
