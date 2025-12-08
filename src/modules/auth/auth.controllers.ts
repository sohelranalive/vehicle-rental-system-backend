import { Request, Response } from "express";
import { authServices } from "./auth.services";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.createUser(req.body);
    if (!result) {
      res.status(400).json({
        success: false,
        message: "No valid information found",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
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

const userSignIn = async (req: Request, res: Response) => {
  try {
    const result = await authServices.userSignIn(req.body);

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Your'e not authorized or invalid input",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const authControllers = {
  createUser,
  userSignIn,
};
