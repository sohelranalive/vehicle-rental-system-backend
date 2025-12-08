import express from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";

const router = express.Router();

// create bookings
router.post("/", auth("admin", "customer"), bookingControllers.createBooking);

// view booking data
router.get("/", auth("admin", "customer"), bookingControllers.viewBookings);

// update booking
router.put(
  "/:bookingId",
  auth("admin", "customer"),
  bookingControllers.updateBooking
);

export const bookingRoutes = router;
