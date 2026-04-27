const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_AUDIENCE_ID);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { firstName, email } = req.body;

    if (!firstName || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    await resend.contacts.create({
      email,
      firstName,
    });

    await resend.emails.send({
      from: "The Growth Journal <onboarding@resend.dev>",
      to: [email],
      subject: `Welcome to The Growth Journal, ${firstName}`,
      html: `
        <h2>Hi ${firstName}, welcome!</h2>
        <p>Thank you for subscribing to The Growth Journal.</p>
        <p>You’ll receive weekly inspiration from us.</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Subscription failed" });
  }
};