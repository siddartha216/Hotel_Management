import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({

  hotel: {
    type: mongoose.Schema.Types.ObjectId,   // ✅ IMPORTANT (was String)
    ref: "Hotel",
    required: true
  },

  roomType: {
    type: String,
    required: true
  },

  pricePerNight: {
    type: Number,
    required: true
  },

  amenities: {
    type: [String],     // ✅ better than Array
    default: []
  },

  images: [{ type: String }],

  isAvailable: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });   // ✅ fixed spelling

const Room = mongoose.model("Room", roomSchema);

export default Room;
