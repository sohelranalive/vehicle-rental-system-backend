import express, { Request, Response } from "express";
import { vehicleControllers } from "./vehicle.controllers";

const router = express.Router();

// create a vehicle
router.post("/", vehicleControllers.createVehicle);

// get all vehicles
router.get("/", vehicleControllers.getAllVehicle);

export const vehicleRoutes = router;
