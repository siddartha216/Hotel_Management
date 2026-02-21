import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  address: {          // ✅ fixed spelling
    type: String,
    required: true
  },

  contact: {
    type: String,     // ✅ phone should be string (not number)
    required: true
  },

  owner: {
    type: String,     // ⭐ VERY IMPORTANT → MUST BE STRING (Clerk userId)
    required: true,
    ref: "User"
  },

  city: {
    type: String,
    required: true
  }

}, { timestamps: true });   // ✅ fixed timestamps spelling

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
