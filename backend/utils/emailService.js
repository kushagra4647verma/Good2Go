// backend/utils/emailService.js
// Using Brevo (formerly Sendinblue) - Works on Render!
// Free: 300 emails/day

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Brevo SMTP configuration
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL, // Your Brevo login email
    pass: process.env.BREVO_SMTP_KEY, // Your Brevo SMTP key (NOT API key)
  },
  // Important: Increase timeout for cloud deployments
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

// Generate 6-digit OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP Email
export async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: `"Good2Go" <${process.env.BREVO_EMAIL}>`,
    to: email,
    subject: "Your Good2Go Verification Code",
    html: `
      <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #D00000; margin: 0;">Good2Go</h1>
          <p style="color: #546677;">Discover Hidden Places</p>
        </div>
        
        <div style="background: #F3F7F0; border-radius: 12px; padding: 30px; text-align: center;">
          <h2 style="color: #1C3144; margin-bottom: 10px;">Verify Your Email</h2>
          <p style="color: #546677; margin-bottom: 20px;">
            Enter this code to complete your registration:
          </p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; display: inline-block;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1C3144;">
              ${otp}
            </span>
          </div>
          
          <p style="color: #999; font-size: 14px; margin-top: 20px;">
            This code expires in 10 minutes.
          </p>
        </div>
        
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
          If you didn't request this code, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
}

// ============================================
// Setup Instructions for Brevo:
// ============================================
// 1. Go to https://www.brevo.com/ and create free account
// 2. Go to Settings → SMTP & API → SMTP
// 3. Click "Generate a new SMTP key"
// 4. Add to Render environment variables:
//    - BREVO_EMAIL = your-login-email@example.com
//    - BREVO_SMTP_KEY = xsmtpsib-xxxxx-xxxxx
// ============================================
