import { Request, Response } from "express";
import Purchase, { PURCHASE_TYPES, PurchaseDocument } from "../models/purchase";
import getErrorMessage from "../utils/errors";
import {
  rangeQuery,
  validEnumQuery,
  validOrderQuery,
  validStrQuery,
} from "../utils/query";
import { FilterQuery } from "mongoose";

const purchaseFilter = (req: Request): FilterQuery<PurchaseDocument> => {
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
  return filter;
};

const getPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await Purchase.find(purchaseFilter(req)).sort({
      _id: validOrderQuery(req.query.order),
    });
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

const postPurchase = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newPurchase = new Purchase({
      cost: data.cost,
      description: data.description,
      type: data.type,
    });
    await newPurchase.save();
    return res.json(newPurchase);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const putPurchase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      id,
      {
        $set: {
          cost: data.cost,
          description: data.description,
          type: data.type,
        },
      },
      { returnDocument: "after", runValidators: true }
    );
    if (!updatedPurchase) return res.status(404).json("Compra no encontrada");
    return res.json(updatedPurchase);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
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
  postPurchase,
  putPurchase,
  deletePurchase,
};

export default purchaseCtrl;
