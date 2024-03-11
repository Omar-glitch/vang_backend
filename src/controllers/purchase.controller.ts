import { Request, Response } from "express";
import Purchase, { PURCHASE_TYPES, PurchaseDocument } from "../models/purchase";
import getErrorMessage from "../utils/errors";
import {
  querySort,
  rangeDateQueryId,
  rangeQuery,
  validEnumQuery,
  validOrderQuery,
  validStrQuery,
} from "../utils/query";
import { FilterQuery } from "mongoose";

const purchaseFilter = (req: Request): FilterQuery<PurchaseDocument> => {
  const q = req.query.q;
  if (validStrQuery(q, { minLength: 2, maxLength: 16 }))
    return { description: { $regex: q } };
  if (validStrQuery(req.query._id, { minLength: 24, maxLength: 24 }))
    return { _id: req.query._id };
  const filter: FilterQuery<PurchaseDocument> = {};
  if (validEnumQuery(req.query.type, PURCHASE_TYPES))
    filter.type = req.query.type;
  rangeQuery(
    req.query.minCost,
    req.query.maxCost,
    { min: 20, max: 1_000_000 },
    "cost",
    filter
  );
  rangeDateQueryId(req.query.minDate, req.query.maxDate, "_id", filter);
  return filter;
};

const getPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await Purchase.find(purchaseFilter(req)).sort(
      querySort(req, ["date", "cost"])
    );
    return res.json(purchases);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const getPurchase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const savedPurchase = await Purchase.findById(id);
    if (!savedPurchase) return res.status(404).json("Compra no encontrada");
    return res.json(savedPurchase);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const createPurchase = async (item: {
  cost: number;
  description: string;
  type: "equipo" | "inventario";
}) => {
  try {
    const newPurchase = new Purchase({
      cost: item.cost,
      description: item.description,
      type: item.type,
    });
    await newPurchase.save();
  } catch (e) {
    console.log(getErrorMessage(e));
  }
};

const deletePurchase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const purchaseToDelete = await Purchase.findByIdAndDelete(id);
    if (!purchaseToDelete) return res.status(404).json("Compra no encontrada");
    return res.json(purchaseToDelete);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const purchaseCtrl = {
  getPurchases,
  getPurchase,
  createPurchase,
  deletePurchase,
};

export default purchaseCtrl;
