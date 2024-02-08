import { Request, Response } from "express";
import Employee from "../models/employee";
import getErrorMessage from "../utils/errors";

const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find();
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
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
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
      { returnDocument: "after" }
    );
    if (!updatedEmployee) return res.status(404).json("Empleado no encontrado");
    return res.json(updatedEmployee);
  } catch (e) {
    return res.status(400).json(getErrorMessage(e));
  }
};

const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employeeToDelete = await Employee.findByIdAndDelete(id);
    if (!employeeToDelete) res.status(404).json("Empleado no encontrado");
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
