import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import transporter from "../configs/nodemailer.js";
import { getUserEmail } from "../utils/getUserEmail.js";


// ================= INTERNAL FUNCTION =================
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate }
    });
    return bookings.length === 0;
  } catch (error) {
    console.error(error.message);
    return false;
  }
};


// ================= CHECK ROOM AVAILABILITY =================
export const checkRoomAvailability = async (req, res) => {
  try {

    const { room, checkInDate, checkOutDate } = req.body;

    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room
    });

    res.json({ success:true, isAvailable });

  } catch (error) {
    res.json({ success:false, message:error.message });
  }
};


// ================= CREATE BOOKING =================
export const createBooking = async (req, res) => {
  try {

    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.userId;

    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room
    });

    if (!isAvailable) {
      return res.json({
        success:false,
        message:"Room is not available"
      });
    }

    const roomData = await Room.findById(room).populate("hotel");

    if (!roomData) {
      return res.json({ success:false, message:"Room not found" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const nights = Math.ceil(
      (checkOut - checkIn) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = roomData.pricePerNight * nights;

    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: Number(guests),
      checkInDate,
      checkOutDate,
      totalPrice
    });

    // ================= SEND EMAIL TO ACTUAL USER =================
    try {
      const userEmail = await getUserEmail(user); // 🔥 fetch from Clerk

      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: userEmail,   // ✅ actual user email
        subject: "Booking Confirmation",
        html: `
          <h2>Booking Confirmed</h2>
          <p><b>Hotel:</b> ${roomData.hotel.name}</p>
          <p><b>Location:</b> ${roomData.hotel.address}</p>
          <p><b>Total:</b> ₹${totalPrice}</p>
          <p><b>Check-in:</b> ${new Date(checkInDate).toDateString()}</p>
          <p><b>Check-out:</b> ${new Date(checkOutDate).toDateString()}</p>
        `
      });

      console.log("✅ Email sent to user:", userEmail);

    } catch (err) {
      console.log("❌ Email failed:", err.message);
    }

    // ================= RESPONSE =================
    res.json({
      success:true,
      message:"Booking created",
      booking
    });

  } catch (error) {
    res.json({ success:false, message:error.message });
  }
};


// ================= USER BOOKINGS =================
export const getUserBookings = async (req, res) => {
  try {

    const bookings = await Booking.find({ user:req.userId })
      .populate("room hotel")
      .sort({ createdAt:-1 });

    res.json({ success:true, bookings });

  } catch (error) {
    res.json({ success:false, message:"Failed to fetch bookings" });
  }
};


// ================= DASHBOARD =================
export const getHotelBookings = async (req, res) => {
  try {

    let bookings = [];

    const hotel = await Hotel.findOne({ owner:req.userId });

    if (hotel) {
      bookings = await Booking.find({ hotel:hotel._id });
    } else {
      bookings = await Booking.find(); // fallback
    }

    bookings = await Booking.populate(bookings, [
      { path: "room" },
      { path: "hotel" },
      { path: "user" }
    ]);

    bookings.sort((a, b) => b.createdAt - a.createdAt);

    const totalBookings = bookings.length;

    const totalRevenue = bookings.reduce(
      (acc,b)=> acc + b.totalPrice, 0
    );

    res.json({
      success:true,
      dashboardData:{
        totalBookings,
        totalRevenue,
        bookings
      }
    });

  } catch (error) {
    res.json({ success:false, message:"Failed to fetch dashboard" });
  }
};