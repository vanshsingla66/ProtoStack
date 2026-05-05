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
    from,
    to,
    subject: "Verify your ProtoStack account",
    text: `Hi ${fullName}, your verification OTP is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family:sans-serif; max-width:480px; margin:auto;">
        <h2>Hi ${fullName},</h2>
        <p>Use the OTP below to verify your <strong>ProtoStack</strong> account:</p>
        <p style="font-size:32px; letter-spacing:6px; font-weight:bold; color:#4F46E5;">${otp}</p>
        <p style="color:#888; font-size:12px;">This OTP expires in 10 minutes. Do not share it with anyone.</p>
      </div>
    `,
  });

    console.log("EMAIL RESPONSE:", info);
    return info;
  } catch (err) {
    console.error("EMAIL SEND ERROR:", err);
    throw err;
  }
};
