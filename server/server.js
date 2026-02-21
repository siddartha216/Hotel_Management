import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// connect database + cloudinary
connectDB();
connectCloudinary();

const app = express();

app.use(cors());

// ✅ Clerk middleware FIRST
app.use(clerkMiddleware());


// ✅ Webhook must use RAW body BEFORE express.json()
app.use(
  "/api/clerk",
  express.raw({
    type: "application/json",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();   // ⭐ THIS LINE WAS MISSING
    },
  }),
  clerkWebhooks
);

// ✅ JSON parser AFTER webhook
app.use(express.json());


// test route
app.get("/", (req, res) => {
  res.send("API is working");
});


// routes
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);


// ⭐ ADD GLOBAL ERROR HANDLER (VERY IMPORTANT)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success:false, message:"Server error" });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
