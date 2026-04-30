const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { firstName, email } = req.body;

    if (!firstName || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    await resend.contacts.create({
      email,
      firstName,
      unsubscribed: false,
      segments: [
        {
          id: process.env.RESEND_SEGMENT_ID,
        },
      ],
    });

    await resend.emails.send({
      from: "The Growth Journal <onboarding@resend.dev>",
      to: [email],
      subject: `Welcome to The Growth Journal, ${firstName}`,
      html: `
        <h2>Hi ${firstName}, welcome!</h2>
        <p>Thank you for subscribing to <strong>The Growth Journal</strong>.</p>
        <p>You’ll receive weekly inspiration, updates, and helpful content from us.</p>
        <p>Warm regards,<br><strong>The Growth Journal</strong></p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);

    return res.status(500).json({
      message: "Subscription failed",
      error: error.message,
    });
  }
};