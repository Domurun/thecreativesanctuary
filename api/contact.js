const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      projectType,
      message,
    } = req.body;

    // 1. Send submission to you
    await resend.emails.send({
      from: "The Creative Sanctuary <onboarding@resend.dev>",
      to: ["deescreativesanctuary@gmail.com"],
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

    // 2. Send confirmation receipt to client
    await resend.emails.send({
      from: "The Creative Sanctuary <onboarding@resend.dev>",
      to: [email],
      subject: `We Received Your Inquiry — The Creative Sanctuary`,
      html: `
        <h2>Hello ${firstName},</h2>

        <p>Thank you for reaching out to <strong>The Creative Sanctuary</strong>.</p>

        <p>Your project inquiry has been received successfully and we’ll review it shortly.</p>

        <p><strong>Submission Summary:</strong></p>

        <p>
          <strong>Name:</strong> ${firstName} ${lastName}<br>
          <strong>Email:</strong> ${email}<br>
          <strong>Project Type:</strong> ${projectType || "General Inquiry"}<br>
        </p>

        <p>We aim to respond as soon as possible.</p>

        <p>
          Warm regards,<br>
          <strong>The Creative Sanctuary</strong>
        </p>
      `,
    });

    return res.status(200).json({
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Email failed to send",
    });
  }
};