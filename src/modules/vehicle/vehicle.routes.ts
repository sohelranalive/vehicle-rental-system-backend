import express, { Request, Response } from "express";
import { vehicleControllers } from "./vehicle.controllers";

const router = express.Router();

// create a vehicle
router.post("/", vehicleControllers.createVehicle);

// get all vehicles
router.get("/", vehicleControllers.getAllVehicle);

// get vehicles by id
router.get("/:vehicleId", vehicleControllers.getSingleVehicle);

// update vehicle information
router.put("/:vehicleId", vehicleControllers.updateVehicleInfo);

// delete vehicle entries
router.delete("/:vehicleId", vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
