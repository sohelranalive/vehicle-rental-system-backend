import express, { Request, Response } from "express";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import initializeDB from "./config/db";
import { bookingRoutes } from "./modules/booking/booking.routes";
import { authRoutes } from "./modules/auth/auth.routes";

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

// working on vehicle module
app.use("/api/v1/vehicles", vehicleRoutes);

// working with user module
// app.use("/api/v1/users", userRoutes);

// working with auth module "signup"
app.use("/api/v1/auth", authRoutes);

// // working with auth module "signin"
// app.use("/api/v1/auth/signin", authRoutes);

// working with booking module
app.use("/api/v1/bookings", bookingRoutes);

// bad route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "route not found",
    path: req.path,
  });
});

export default app;
