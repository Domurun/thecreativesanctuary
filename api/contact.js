const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { firstName, lastName, email, projectType, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        message: "Missing required form fields",
        received: req.body,
      });
    }

    await resend.emails.send({
      from: "The Creative Sanctuary <onboarding@resend.dev>",
      to: ["yourrealemail@gmail.com"],
      replyTo: email,
      subject: `New Project Inquiry: ${projectType || "General Inquiry"}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Project Type:</strong> ${projectType || "Not specified"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    await resend.emails.send({
      from: "The Creative Sanctuary <onboarding@resend.dev>",
      to: [email],
      subject: "We Received Your Inquiry — The Creative Sanctuary",
      html: `
        <h2>Hello ${firstName},</h2>
        <p>Thank you for reaching out to <strong>The Creative Sanctuary</strong>.</p>
        <p>Your inquiry has been received successfully.</p>
        <p><strong>Project Type:</strong> ${projectType || "General Inquiry"}</p>
        <p>We’ll review your message and respond soon.</p>
        <p>Warm regards,<br><strong>The Creative Sanctuary</strong></p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Email failed to send" });
  }
};