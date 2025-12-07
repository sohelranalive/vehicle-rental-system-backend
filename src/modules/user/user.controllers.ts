import { Request, Response } from "express";
import { userServices } from "./user.services";
import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";
import { vehicleServices } from "../vehicle/vehicle.services";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const editor = req.currentUser;
  const { email, role: editorRole } = editor as JwtPayload;
  const id = req.params.userId;

  try {
    const findUser = await pool.query(`SELECT * FROM Users WHERE email=$1`, [
      email,
    ]);
    if (
      findUser.rows.length == 0 ||
      (findUser.rows[0].email !== email && findUser.rows[0].role == "customer")
    ) {
      res.status(401).json({
        success: false,
        message: "You are not authorized to update",
      });
    } else {
      const result = await userServices.updateUser(
        req.body,
        editorRole,
        id as string
      );
      res.status(200).json({
        success: true,
        message: "User updated successfully",
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

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getVehiclesViaCustomer(
      req.params.userId as string
    );
    if (result.rows.length !== 0) {
      res.status(404).json({
        success: false,
        message: `No user found or has booked car`,
      });
    } else {
      const result = await userServices.deleteUser(req.params.userId as string);
      if (result.rows.length == 0) {
        res.status(404).json({
          success: false,
          message: `No user found`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "User deleted successfully",
        });
      }
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const userControllers = {
  getAllUsers,
  updateUser,
  deleteUser,
};
