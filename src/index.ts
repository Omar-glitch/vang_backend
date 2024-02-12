import express from "express";
import cors from "cors";
import employeeRouter from "./routes/employee.routes";
import "./env";
import connectToDatabase from "./database";
import path from "path";
import clientRouter from "./routes/client.routes";
import repairRouter from "./routes/repair.routes";
import inventoryRouter from "./routes/inventory.routes";
import billRouter from "./routes/bill.routes";
import Client from "./models/client";

const PORT = process.env.PORT;
if (!PORT) throw new Error("No port in .env");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, optionsSuccessStatus: 200 }));
app.use("/employees", employeeRouter);
app.use("/clients", clientRouter);
app.use("/repairs", repairRouter);
app.use("/inventories", inventoryRouter);
app.use("/bills", billRouter);

app.get("/", async (req, res) => {
  return res.render("pages/index", {
    tagline: "quepasa",
    mascots: [
      {
        name: "queso",
        organization: "ñalskjdf",
        birth_year: 2000,
      },
    ],
  });
});

app.get("/clase", async (req, res) => {
  return res.render("pages/clase.ejs", {
    clients: await Client.find(),
  });
});

connectToDatabase()
  .then((db) => {
    console.log("db is connected");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error(err));
