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

export const sendVerificationEmail = async ({ to, fullName, otp }) => {
  const { transporter, from } = getTransporter();

  return transporter.sendMail({
  from,
  to,
  subject: "✨ Welcome to ProtoStack — Verify Your Email",
  text: `Hi ${fullName}, welcome to ProtoStack! Your OTP is ${otp}. It expires in 10 minutes.`,
  html: `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f4f6f8; padding:40px 0;">
    <div style="max-width:520px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed); padding:25px; text-align:center;">
        <h1 style="color:white; margin:0; font-size:22px;">🚀 ProtoStack</h1>
        <p style="color:#e0e7ff; margin:5px 0 0;">Build. Learn. Grow.</p>
      </div>

      <!-- Body -->
      <div style="padding:30px;">
        <h2 style="margin-top:0; color:#111;">Welcome, ${fullName}! 👋</h2>
        
        <p style="color:#555; font-size:15px; line-height:1.6;">
          We're excited to have you onboard. To get started, please verify your email using the OTP below:
        </p>

        <!-- OTP Box -->
        <div style="text-align:center; margin:30px 0;">
          <div style="display:inline-block; padding:15px 25px; font-size:28px; letter-spacing:8px; font-weight:bold; background:#f3f4f6; border-radius:10px; color:#4f46e5;">
            ${otp}
          </div>
        </div>

        <p style="color:#666; font-size:14px;">
          ⏳ This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone.
        </p>

        <hr style="border:none; border-top:1px solid #eee; margin:25px 0;" />

        <p style="font-size:14px; color:#777;">
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#fafafa; padding:15px; text-align:center; font-size:12px; color:#888;">
        © ${new Date().getFullYear()} ProtoStack. All rights reserved.
      </div>

    </div>
  </div>
  `,
});
};
