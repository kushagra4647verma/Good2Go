import dotenv from "dotenv";
dotenv.config();

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail(email, otp) {
  const mailOptions = {
    sender: {
      name: "Good2Go",
      email: process.env.BREVO_EMAIL,
    },
    to: [{ email: email }],
    subject: "Your Good2Go Verification Code",
    htmlContent: `
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
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY, // Use API key instead of SMTP key
      },
      body: JSON.stringify(mailOptions),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send email");
    }

    const data = await response.json();
    console.log("Email sent:", data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
}

// ============================================
// Setup Instructions for Brevo API:
// ============================================
// 1. Go to https://www.brevo.com/
// 2. Go to Settings → SMTP & API → API Keys
// 3. Click "Generate a new API key" (v3)
// 4. Add to Render environment variables:
//    - BREVO_EMAIL = your-verified-sender@example.com
//    - BREVO_API_KEY = xkeysib-xxxxx-xxxxx
// ============================================
