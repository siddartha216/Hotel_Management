import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  // Clerk userId stored here
  _id: { type: String, required: true },

  username: { type: String, required: true },

  email: { type: String, required: true },

  // ✅ NOT REQUIRED (IMPORTANT FIX)
  image: { type: String, default: "" },

  role: {
    type: String,
    enum: ["user", "hotelOwner"],
    default: "user"
  },

  // ✅ optional array
  recentSearchedCities: {
    type: [String],
    default: []
  }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;