import nodemailer from "nodemailer";

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !port || !user || !pass || !from) {
    throw new Error("SMTP is not configured properly");
  }

  const secure =
    process.env.SMTP_SECURE === "true" || process.env.SMTP_SECURE === "1" || port === 465;

  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    }),
    from,
  };
};

export const sendVerificationEmail = async ({ to, fullName, otp }) => {
  const { transporter, from } = getTransporter();

  const subject = "Verify your ProtoStack account";
  const text = `Hi ${fullName}, your verification code is ${otp}. It expires in 10 minutes.`;

  return transporter.sendMail({
    from,
    to,
    subject,
    text,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin: 0 0 12px;">Verify your email</h2>
        <p style="margin: 0 0 16px;">Hi ${fullName}, use the code below to verify your ProtoStack account.</p>
        <div style="display: inline-block; padding: 14px 20px; border-radius: 12px; background: #eff6ff; border: 1px solid #bfdbfe; font-size: 28px; font-weight: 700; letter-spacing: 0.2em;">
          ${otp}
        </div>
        <p style="margin: 16px 0 0; font-size: 14px; color: #475569;">This code expires in 10 minutes.</p>
      </div>
    `,
  });
};