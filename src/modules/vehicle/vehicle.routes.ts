import express, { Request, Response } from "express";
import { vehicleControllers } from "./vehicle.controllers";
import auth from "../../middleware/auth";

const router = express.Router();

// create a vehicle
router.post("/", auth("admin"), vehicleControllers.createVehicle);

// get all vehicles
router.get("/", vehicleControllers.getAllVehicle);

// get vehicles by id
router.get("/:vehicleId", vehicleControllers.getSingleVehicle);

// update vehicle information
router.put("/:vehicleId", auth("admin"), vehicleControllers.updateVehicleInfo);

// delete vehicle entries
router.delete("/:vehicleId", auth("admin"), vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
