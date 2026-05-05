import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM;

if (!host || !port || !user || !pass || !from) {
  throw new Error("SMTP is not configured properly");
}

// ✅ Create transporter ONCE
const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, // correct handling
  auth: {
    user,
    pass,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
});

// ✅ Verify ONCE (startup only)
(async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP READY");
  } catch (err) {
    console.error("❌ SMTP ERROR:", err);
  }
})();

export const sendVerificationEmail = async ({ to, fullName, otp }) => {
  try {
    const info = await transporter.sendMail({
      from: user, // ⚠️ IMPORTANT: use SMTP user for testing
      to,
      subject: "Verify your ProtoStack account",
      text: `Hi ${fullName}, your OTP is ${otp}`,
      html: `
        <h2>Hi ${fullName}</h2>
        <p>Your OTP: <b>${otp}</b></p>
      `,
    });

    console.log("EMAIL RESPONSE:", info);
    return info;
  } catch (err) {
    console.error("EMAIL SEND ERROR:", err);
    throw err;
  }
};
