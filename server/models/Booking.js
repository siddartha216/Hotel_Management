import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

  user: {
    type: String,              // ✅ correct (Clerk userId is string)
    ref: "User",
    required: true
  },

  room: {
    type: mongoose.Schema.Types.ObjectId,   // ✅ MUST be ObjectId
    ref: "Room",
    required: true
  },

  hotel: {
    type: mongoose.Schema.Types.ObjectId,   // ✅ MUST be ObjectId
    ref: "Hotel",
    required: true
  },

  checkInDate: {
    type: Date,
    required: true
  },

  checkOutDate: {
    type: Date,
    required: true
  },

  totalPrice: {
    type: Number,
    required: true
  },

  guests: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending"
  },

  paymentMethod: {
    type: String,
    default: "Pay at Hotel"
  },

  isPaid: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });   // ✅ fixed spelling

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
