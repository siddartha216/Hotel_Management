import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

import {
  createRoom,
  getOwnerRooms,
  getRooms,
  toggleRoomAvailability,
  deleteRoom
} from "../controllers/roomController.js";

const roomRouter = express.Router();

// ⭐ IMPORTANT → protect BEFORE upload (better security)
roomRouter.post("/", protect, upload.array("images", 4), createRoom);

roomRouter.get("/", getRooms);
roomRouter.delete("/:id", protect, deleteRoom);

roomRouter.get("/owner", protect, getOwnerRooms);

// ⭐ better to use PUT for update (optional but recommended)
roomRouter.put("/toggle-availability/:id", protect, toggleRoomAvailability);

export default roomRouter;
