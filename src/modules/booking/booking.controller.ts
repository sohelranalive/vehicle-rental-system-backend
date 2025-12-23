import { Request, Response } from "express";
import { bookingServices } from "./booking.services";
import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

const createBooking = async (req: Request, res: Response) => {
  const currentUser = req.currentUser;
  const { email: currentUserEmail, role: currentUserRole } =
    currentUser as JwtPayload;

  try {
    const result = await bookingServices.createBooking(
      req.body,
      currentUserEmail,
      currentUserRole
    );

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Customer id didn't match or vehicle is already booked",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Booking created successfully",
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

const viewBookings = async (req: Request, res: Response) => {
  const currentUser = req.currentUser;
  const { email: currentUserEmail, role: currentUserRole } =
    currentUser as JwtPayload;

  try {
    const result = await bookingServices.viewBookings(
      currentUserEmail,
      currentUserRole
    );
    if (result.rowCount == 0) {
      res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: "No active bookings found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: result.rows,
      });
    }
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const currentUser = req.currentUser;
  const { email: currentUserEmail, role: currentUserRole } =
    currentUser as JwtPayload;

  try {
    if (currentUserRole == "admin" && req.body?.status == "returned") {
      const result = await bookingServices.updateBooking(
        req.body,
        req.params.bookingId as string,
        currentUserEmail,
        currentUserRole
      );
      if (!result.rows.length) {
        res.status(501).json({
          success: false,
          message: "Bookings not found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Booking marked as returned. Vehicle is now available",
          data: result.rows[0],
        });
      }
    } else if (
      currentUserRole == "customer" &&
      req.body?.status == "cancelled"
    ) {
      const result = await bookingServices.updateBooking(
        req.body,
        req.params.bookingId as string,
        currentUserEmail,
        currentUserRole
      );
      if (!result.rows.length) {
        res.status(501).json({
          success: false,
          message: "Not found or unauthorized",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Booking cancelled successfully",
          data: result.rows[0],
        });
      }
    } else {
      res.status(501).json({
        success: false,
        message: "Unauthorized or wrong actions",
      });
    }
  } catch (error: any) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  viewBookings,
  updateBooking,
};
