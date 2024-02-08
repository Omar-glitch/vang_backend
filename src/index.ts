import express from "express";
import cors from "cors";
import employeeRouter from "./routes/employee.routes";
import "./env";
import connectToDatabase from "./database";
import path from "path";

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

connectToDatabase()
  .then((db) => {
    console.log("db is connected");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error(err));
