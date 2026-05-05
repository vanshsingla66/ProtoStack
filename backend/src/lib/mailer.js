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

// ✅ Created ONCE at module load — reused for every email
const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  requireTLS: port === 587,
  auth: { user, pass },
  connectionTimeout: 10000,
  socketTimeout: 10000,
});

// ✅ Verified ONCE at startup
transporter.verify().then(() => {
  console.log("✅ SMTP ready");
}).catch((err) => {
  console.error("⚠️ SMTP verification failed:", err.message);
});

export const sendVerificationEmail = async ({ to, fullName, otp }) => {
  if (!to || !fullName || !otp) {
    throw new Error("sendVerificationEmail: missing required fields");
  }

  const info = await transporter.sendMail({
    from,
    to,
    subject: "Verify your ProtoStack account",
    text: `Hi ${fullName}, your OTP is ${otp}. Expires in 10 minutes.`,
    html: `
      <div style="font-family:sans-serif; max-width:480px; margin:auto;">
        <h2>Hi ${fullName},</h2>
        <p>Your <strong>ProtoStack</strong> verification OTP:</p>
        <p style="font-size:32px; letter-spacing:6px; font-weight:bold; color:#4F46E5;">${otp}</p>
        <p style="color:#888; font-size:12px;">Expires in 10 minutes. Do not share it.</p>
      </div>
    `,
  });

  console.log("✅ Email sent to:", to, "| messageId:", info.messageId);

  if (info.rejected?.length > 0) {
    throw new Error(`Email rejected for: ${info.rejected.join(", ")}`);
  }

  return info;
};
