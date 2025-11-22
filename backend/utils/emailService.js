// backend/utils/emailService.js
import nodemailer from "nodemailer";

// Configure email transporter (using Gmail as example)
// You'll need to set up these environment variables:
// EMAIL_USER=your-email@gmail.com
// EMAIL_PASS=your-app-specific-password

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate 6-digit OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
export async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Good2Go - Email Verification OTP",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #D00000, #3F88C5);
            padding: 30px;
            text-align: center;
            color: white;
          }
          .content {
            padding: 40px 30px;
          }
          .otp-box {
            background-color: #F3F7F0;
            border: 2px dashed #3F88C5;
            border-radius: 10px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #D00000;
            letter-spacing: 8px;
            margin: 20px 0;
          }
          .footer {
            background-color: #1C3144;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 12px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🌍 Good2Go</div>
            <p style="margin: 0; font-size: 16px;">Discover Hidden Places</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1C3144; margin-top: 0;">Verify Your Email Address</h2>
            <p style="color: #666; font-size: 16px;">
              Thank you for registering with Good2Go! To complete your registration, 
              please use the following One-Time Password (OTP):
            </p>
            
            <div class="otp-box">
              <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; color: #666; font-size: 14px;">
                This code will expire in <strong>10 minutes</strong>
              </p>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              Never share this OTP with anyone. Good2Go will never ask for your OTP via phone or email.
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If you didn't request this code, please ignore this email or contact our support team.
            </p>
          </div>
          
          <div class="footer">
            <p style="margin: 5px 0;">Good2Go - Find Hidden Gems</p>
            <p style="margin: 5px 0;">© ${new Date().getFullYear()} Good2Go. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
}
