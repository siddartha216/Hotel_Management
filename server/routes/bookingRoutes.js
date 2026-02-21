import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  checkRoomAvailability,
  createBooking,
  getUserBookings,
  getHotelBookings
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkRoomAvailability);

// ⭐ IMPORTANT → booking MUST be protected (needs req.userId)
bookingRouter.post("/book", protect, createBooking);

bookingRouter.get("/user", protect, getUserBookings);

bookingRouter.get("/hotel", protect, getHotelBookings);

export default bookingRouter;
