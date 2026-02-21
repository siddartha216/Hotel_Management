// GET USER DATA
export const getUserData = async (req, res) => {
    try {
  
      if (!req.user) {
        return res.json({ success:false, message:"User not found" });
      }
  
      const role = req.user.role;
      const recentSearchedCities = req.user.recentSearchedCities || [];
  
      res.json({ success:true, role, recentSearchedCities });
  
    } catch (error) {
      res.json({ success:false, message:error.message });
    }
  };
  
  
  
  // STORE RECENT SEARCHED CITY
  export const storeRecentSearchedCities = async (req, res) => {
  
    try {
  
      const { recentSearchedCity } = req.body;
  
      const user = req.user;   // ❌ you used await req.user (wrong)
  
      if (!user) {
        return res.json({ success:false, message:"User not found" });
      }
  
      if (!user.recentSearchedCities) {
        user.recentSearchedCities = [];
      }
  
      // prevent duplicates
      user.recentSearchedCities =
        user.recentSearchedCities.filter(city => city !== recentSearchedCity);
  
      user.recentSearchedCities.push(recentSearchedCity);
  
      // keep only last 3
      if (user.recentSearchedCities.length > 3) {
        user.recentSearchedCities.shift();
      }
  
      await user.save();
  
      res.json({ success:true, message:"City Added" });
  
    } catch (error) {
      res.json({ success:false, message:error.message });
    }
  
  };
  