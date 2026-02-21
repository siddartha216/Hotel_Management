import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const registerHotel = async (req, res) => {

  try {

    // ⭐ PUT DEBUG HERE (INSIDE FUNCTION)
    console.log("AUTH OBJECT:", req.auth);

    const { name, address, contact, city } = req.body;

    const owner = req.auth?.userId;

    if (!owner) {
      return res.status(401).json({
        success:false,
        message:"Unauthorized - login required"
      });
    }

    const existingHotel = await Hotel.findOne({ owner });

    if (existingHotel) {
      return res.json({
        success:false,
        message:"Hotel already registered"
      });
    }

    await Hotel.create({
      name,
      address,
      contact,
      city,
      owner
    });

    await User.findByIdAndUpdate(owner, {
      role:"hotelOwner"
    });

    res.json({
      success:true,
      message:"Hotel registered successfully"
    });

  } catch (error) {

    console.log("HOTEL ERROR:", error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};