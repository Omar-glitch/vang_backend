import express from "express";
import cors from "cors";
import employeeRouter from "./routes/employee.routes";
import "./env";
import connectToDatabase from "./database";
import clientRouter from "./routes/client.routes";
import repairRouter from "./routes/repair.routes";
import inventoryRouter from "./routes/inventory.routes";
import billRouter from "./routes/bill.routes";
import purchaseRouter from "./routes/purchase.routes";
import hardwareRouter from "./routes/hardware.route";

const PORT = process.env.PORT;
if (!PORT) throw new Error("No port in .env");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, optionsSuccessStatus: 200 }));
app.use("/employees", employeeRouter);
app.use("/clients", clientRouter);
app.use("/repairs", repairRouter);
app.use("/inventories", inventoryRouter);
app.use("/bills", billRouter);
app.use("/purchases", purchaseRouter);
app.use("/hardwares", hardwareRouter);

connectToDatabase()
  .then((db) => {
    console.log("db is connected");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error(err));
