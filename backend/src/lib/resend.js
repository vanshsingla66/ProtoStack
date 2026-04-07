import { Resend } from "resend";

export const sendVerificationEmail = async ({
  to,
  fullName,
  verificationUrl,
}) => {
  console.log("🔥 EMAIL FUNCTION CALLED");
  console.log("TO:", to);

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  console.log("ENV CHECK:", { apiKey, fromEmail });

  if (!apiKey || !fromEmail) {
    throw new Error("Resend is not configured properly");
  }

  const resend = new Resend(apiKey);

  try {
    const response = await resend.emails.send({
      from: fromEmail,
      to,
      subject: "Verify your ProtoStack account",
      text: `Hi ${fullName}, verify your account here: ${verificationUrl}`,
      html: `
        <div>
          <h2>Verify your email</h2>
          <p>Hi ${fullName}</p>
          <a href="${verificationUrl}">Verify Email</a>
        </div>
      `,
    });

    console.log("📩 RESEND RESPONSE:", response);

    if (response.error) {
      throw new Error(response.error.message);
    }

    console.log("✅ EMAIL SENT SUCCESS");

    return response;

  } catch (error) {
    console.error("❌ EMAIL FAILED:", error);
    throw error;
  }
};