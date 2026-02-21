import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {

    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // ✅ FIX: fallback if rawBody missing
    const payload = req.rawBody || JSON.stringify(req.body);

    // verify + parse automatically
    const evt = webhook.verify(payload, headers);

    const { data, type } = evt;

    switch (type) {

      case "user.created": {

        const userData = {
          _id: data.id,
          username: (data.first_name || "") + " " + (data.last_name || ""),
          email: data.email_addresses?.[0]?.email_address || "",
          image: data.image_url || "",
          recentSearchedCities: []
        };

        await User.findByIdAndUpdate(
          data.id,
          userData,
          { upsert: true, new: true }
        );

        console.log("✅ USER CREATED");
        break;
      }

      case "user.updated": {

        const userData = {
          _id: data.id,
          username: (data.first_name || "") + " " + (data.last_name || ""),
          email: data.email_addresses?.[0]?.email_address || "",
          image: data.image_url || "",
          recentSearchedCities: []
        };

        await User.findByIdAndUpdate(data.id, userData);
        break;
      }

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
    }

    res.json({ success: true });

  } catch (error) {

    console.log("❌ CLERK WEBHOOK ERROR:", error.message);
    res.status(400).json({ success: false });

  }
};

export default clerkWebhooks;