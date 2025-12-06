import express from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";

const router = express.Router();

// create bookings
router.post("/", auth("admin", "customer"), bookingControllers.createBooking);

// get all bookings

export const bookingRoutes = router;
