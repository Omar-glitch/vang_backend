import { Request, Response } from "express";
import Employee, { EMPLOYEE_ROLES, EmployeeDocument } from "../models/employee";
import getErrorMessage from "../utils/errors";
import {
  rangeQuery,
  validEnumQuery,
  validOrderQuery,
  validStrQuery,
} from "../utils/query";
import { FilterQuery } from "mongoose";
import Repair from "../models/repair";

const employeeFilter = (req: Request): FilterQuery<EmployeeDocument> => {
  const q = req.query.q;
  if (validStrQuery(q, { minLength: 2, maxLength: 16 }))
    return { name: { $regex: q.toLowerCase() } };
  if (validStrQuery(req.query._id, { minLength: 24, maxLength: 24 }))
    return { _id: req.query._id };
  let filter: FilterQuery<EmployeeDocument> = {};
  if (validEnumQuery(req.query.role, EMPLOYEE_ROLES))
    filter["role"] = req.query.role;
  rangeQuery(
    req.query.minAge,
    req.query.maxAge,
    { min: 16, max: 80 },
    "age",
    filter
  );
  return filter;
};

const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find(employeeFilter(req)).sort({
      _id: validOrderQuery(req.query.order),
    });
    return res.json(employees);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const getEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const savedEmployee = await Employee.findById(id);
    if (!savedEmployee) return res.status(404).json("Empleado no encontrado");
    return res.json(savedEmployee);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const postEmployee = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newEmployee = new Employee({
      name: data.name,
      age: data.age,
      email: data.email,
      direction: data.direction,
      phone: data.phone,
      role: data.role,
    });
    await newEmployee.save();
    return res.json(newEmployee);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const putEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const employeeToUpdate = await Employee.findById(id);
    if (!employeeToUpdate)
      return res.status(404).json("Empleado no encontrado");
    const updatedEmployee = await Employee.updateOne(
      { _id: id },
      {
        $set: {
          name: data.name,
          age: data.age,
          email: data.email,
          direction: data.direction,
          phone: data.phone,
          role: data.role,
        },
      },
      { runValidators: true }
    );
    if (!updatedEmployee.modifiedCount)
      return res.status(404).json("Empleado no encontrado");
    if (employeeToUpdate.name !== data.name) {
      await Repair.updateMany(
        { employee: employeeToUpdate.name },
        { $set: { employee: data.name } }
      );
    }
    return res.json({});
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employeeToDelete = await Employee.findByIdAndDelete(id);
    if (!employeeToDelete)
      return res.status(404).json("Empleado no encontrado");
    return res.json(employeeToDelete);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const employeeCtrl = {
  getEmployees,
  getEmployee,
  postEmployee,
  putEmployee,
  deleteEmployee,
};

export default employeeCtrl;
