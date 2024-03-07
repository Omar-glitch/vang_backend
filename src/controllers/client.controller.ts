import { Request, Response } from "express";
import Client, { ClientDocument } from "../models/client";
import getErrorMessage from "../utils/errors";
import { FilterQuery } from "mongoose";
import { validOrderQuery, validStrQuery } from "../utils/query";

const clientFilter = (req: Request): FilterQuery<ClientDocument> => {
  const q = req.query.q;
  if (validStrQuery(q, { minLength: 2, maxLength: 16 }))
    return { name: { $regex: q.toLowerCase() } };
  if (validStrQuery(req.query._id, { minLength: 24, maxLength: 24 }))
    return { _id: req.query._id };
  return {};
};

const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.find(clientFilter(req)).sort({
      _id: validOrderQuery(req.query.order),
    });
    return res.json(clients);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const getClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const savedClient = await Client.findById(id);
    if (!savedClient) return res.status(404).json("Cliente no encontrado");
    return res.json(savedClient);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const postClient = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newClient = new Client({
      name: data.name,
      contact: data.contact,
    });
    await newClient.save();
    return res.json(newClient);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const putClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedClient = await Client.findByIdAndUpdate(
      id,
      {
        $set: {
          name: data.name,
          contact: data.contact,
        },
      },
      { returnDocument: "after", runValidators: true }
    );
    if (!updatedClient) return res.status(404).json("Cliente no encontrado");
    return res.json(updatedClient);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const clientToDelete = await Client.findByIdAndDelete(id);
    if (!clientToDelete) return res.status(404).json("Cliente no encontrado");
    return res.json(clientToDelete);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const clientCtrl = {
  getClients,
  getClient,
  postClient,
  putClient,
  deleteClient,
};

export default clientCtrl;
