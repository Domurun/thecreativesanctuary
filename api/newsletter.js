const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

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
      from: "The Creative Sanctuary <hello@thecreativesanctuary.com>",
      to: [email],
      subject: `Welcome to The Creative Sanctuary, ${firstName}`,
      html: `
        <h2>Hi ${firstName}, welcome!</h2>
        <p>Thank you for subscribing to The Creative Sanctuary newsletter.</p>
        <p>You’ll receive creative insights, project updates, and weekly inspiration from us.</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Subscription failed" });
  }
};