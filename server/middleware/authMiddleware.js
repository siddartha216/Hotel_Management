import User from "../models/User.js";

export const protect = async (req, res, next) => {

  try {

    if (!req.auth || !req.auth.userId) {
      return res.json({ success:false, message:"Unauthorized" });
    }

    const userId = req.auth.userId;

    // ⭐ try find user
    let user = await User.findById(userId);

    // ⭐ if user not exist → create automatically
    if (!user) {

      const clerkUser = req.auth.sessionClaims;

      user = await User.create({
        _id: userId,
        username: clerkUser?.name || "User",
        email: clerkUser?.email || "no-email@email.com",
        image: clerkUser?.picture || "https://via.placeholder.com/150",
        recentSearchedCities: []
      });
      

    }

    req.user = user;
    req.userId = userId;

    next();

  } catch (error) {
    res.json({ success:false, message:error.message });
  }

};
