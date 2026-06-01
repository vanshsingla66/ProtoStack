import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !port || !user || !pass || !from) {
    throw new Error("SMTP is not configured properly");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false, // important for 587
    requireTLS: false,
    auth: {
      user,
      pass,
    },
  });

  // Debug check
  transporter.verify((err) => {
    if (err) {
      console.error("SMTP ERROR:", err);
    } else {
      console.log("SMTP READY");
    }
  });

  return { transporter, from };
};