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

const getAllVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicle();
    if (result.rows.length === 0) {
      res.status(400).json({
        success: true,
        message: "No vehicles found",
        data: result.rows,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicles retrieved successfully",
        data: result.rows,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getSingleVehicle(
      req.params.vehicleId as string
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: true,
        message: `No vehicles found for id ${req.params.vehicleId}`,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle retrieved successfully",
        data: result.rows,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateVehicleInfo = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getSingleVehicle(
      req.params.vehicleId as string
    );
    if (
      result.rows.length === 0 ||
      JSON.stringify(req.body) == undefined ||
      JSON.stringify(req.body) == "{}"
    ) {
      res.status(400).json({
        success: false,
        message: `Nothing to update`,
      });
    } else {
      const result = await vehicleServices.updateVehicleInfo(
        req.params.vehicleId as string,
        req.body
      );
      res.status(200).json({
        status: true,
        message: "Vehicle updated successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.deleteVehicle(
      req.params.vehicleId as string
    );
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: `No vehicles found or vehicle currently booked`,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const vehicleControllers = {
  createVehicle,
  getAllVehicle,
  getSingleVehicle,
  updateVehicleInfo,
  deleteVehicle,
};
