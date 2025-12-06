import express from "express";
import { bookingControllers } from "./booking.controller";

const router = express.Router();

router.post("/", bookingControllers.createBooking);

export const bookingRoutes = router;
