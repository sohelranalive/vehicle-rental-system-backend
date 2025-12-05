import express, { Request, Response } from "express";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import initializeDB from "./config/db";

// start using express app
const app = express();

// json parser
app.use(express.json());

// initialize db
initializeDB();

// root path
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Vehicle Rental System's Backend");
});

// working on vehicle modules
app.use("/api/v1/vehicles", vehicleRoutes);

// bad route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "route not found",
    path: req.path,
  });
});

export default app;
