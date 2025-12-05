import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.services";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllVehicle = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Vehicles retrieved successfully",
    data: "DATA",
  });
};

export const vehicleControllers = {
  getAllVehicle,
  createVehicle,
};
