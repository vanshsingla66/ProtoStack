import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Validate env once at startup
const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM;

if (!host || !port || !user || !pass || !from) {
  throw new Error("SMTP is not configured properly");
}

// ✅ Create transporter ONLY ONCE (important)
const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, // true for 465, false for 587
  auth: {
    user,
    pass,
  },
  connectionTimeout: 10000, // prevent long hanging
  greetingTimeout: 5000,
  socketTimeout: 10000,
});

// ✅ Verify ONLY ONCE at server start (not per request)
(async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP READY");
  } catch (err) {
    console.error("❌ SMTP CONNECTION ERROR:", err);
  }
})();

// ✅ Email sender function
export const sendVerificationEmail = async ({ to, fullName, otp }) => {
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: "Verify your ProtoStack account",
      text: `Hi ${fullName}, your OTP is ${otp}`,
      html: `
        <h2>Hi ${fullName}</h2>
        <p>Your OTP: <b>${otp}</b></p>
      `,
    });

    console.log("📧 EMAIL SENT:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ EMAIL SEND ERROR:", err);
    throw err;
  }
};
