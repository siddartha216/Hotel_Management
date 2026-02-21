import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";


// ================= CREATE ROOM =================
export const createRoom = async (req, res) => {

  try {

    const userId = req.userId || req.auth?.userId;

    const { roomType, pricePerNight, amenities } = req.body;

    const hotel = await Hotel.findOne({ owner: userId });

    if (!hotel) {
      return res.json({ success:false, message:"Hotel not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.json({ success:false, message:"Please upload images" });
    }

    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });

    const images = await Promise.all(uploadImages);

    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: Number(pricePerNight),
      amenities:
        typeof amenities === "string"
          ? JSON.parse(amenities)
          : amenities || [],
      images,
      isAvailable: true
    });

    res.json({ success:true, message:"Room created successfully" });

  } catch (error) {
    res.json({ success:false, message:error.message });
  }
};



// ================= GET OWNER ROOMS =================
export const getOwnerRooms = async (req, res) => {

  try {

    const userId = req.userId || req.auth?.userId;

    const hotelData = await Hotel.findOne({ owner:userId });

    if (!hotelData) {
      return res.json({ success:false, message:"Hotel not found" });
    }

    const rooms = await Room.find({ hotel:hotelData._id })
      .populate("hotel")
      .sort({ createdAt:-1 });

    res.json({ success:true, rooms });

  } catch (error) {
    res.json({ success:false, message:error.message });
  }

};



// ================= GET ALL ROOMS =================
export const getRooms = async (req, res) => {

  try {

    const rooms = await Room.find({ isAvailable:true })
      .populate("hotel")
      .sort({ createdAt:-1 });

    res.json({ success:true, rooms });

  } catch (error) {

    res.json({ success:false, message:error.message });

  }

};

export const deleteRoom = async (req,res)=>{
  try{

    const userId = req.userId || req.auth?.userId;

    // find owner hotel
    const hotel = await Hotel.findOne({ owner:userId });

    if(!hotel){
      return res.json({success:false,message:"Unauthorized"});
    }

    // find the room
    const room = await Room.findById(req.params.id);

    if(!room){
      return res.json({success:false,message:"Room not found"});
    }

    // VERY IMPORTANT → check this room belongs to owner
    if(room.hotel.toString() !== hotel._id.toString()){
      return res.json({success:false,message:"Not your room"});
    }

    await Room.findByIdAndDelete(req.params.id);

    res.json({success:true,message:"Room deleted"});

  }catch(err){
    res.json({success:false,message:err.message});
  }
};

// ================= TOGGLE AVAILABILITY =================
export const toggleRoomAvailability = async (req, res) => {

  try {

    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
      return res.json({ success:false, message:"Room not found" });
    }

    room.isAvailable = !room.isAvailable;

    await room.save();

    res.json({ success:true, message:"Room availability updated" });

  } catch (error) {

    res.json({ success:false, message:error.message });

  }

};