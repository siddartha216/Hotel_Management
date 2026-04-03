import dotenv from "dotenv";
dotenv.config(); // ✅ ADD THIS AT TOP

import nodemailer from "nodemailer";

console.log("SMTP USER:", process.env.SMTP_USER);
console.log("SMTP PASS:", process.env.SMTP_PASSWORD);

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP ERROR:", error.message);
  } else {
    console.log("✅ SMTP Ready");
  }
});

export default transporter;