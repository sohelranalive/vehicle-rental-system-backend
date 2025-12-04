import express, { Request, Response } from "express";
const app = express();

// json parser
app.use(express.json());

// root path
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Vehicle Rental System's Backend");
});

// create vehicle

// get all vehicle
app.get("/api/v1/vehicles", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Vehicles retrieved successfully",
    data: "DATA",
  });
});

// bad route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "route not found",
    path: req.path,
  });
});

export default app;
