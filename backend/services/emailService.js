import logger from "../utils/logger.js";

export const sendEmail = async ({ to, subject, html, text }) => {
  // In standard production, we would use nodemailer or an API like SendGrid/SES.
  // For development and robust operation, we log the emails via Winston.
  logger.info(`[Email Dispatcher] Sending email...`);
  logger.info(`To: ${to}`);
  logger.info(`Subject: ${subject}`);
  logger.info(`Body Preview: ${text || "HTML Content Supplied"}`);
  
  // Return true to mock successful send
  return true;
};

export const sendOtpEmail = async (email, otpCode) => {
  return await sendEmail({
    to: email,
    subject: "NovaCare Secure Login OTP Verification",
    text: `Your OTP code is ${otpCode}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #6366f1;">NovaCare Security Verification</h2>
        <p>You requested a secure login verification code for your NovaCare Hospital ERP Portal.</p>
        <p>Please enter the following 6-digit One-Time Password to authorize access:</p>
        <div style="font-size: 24px; font-weight: bold; background-color: #f3f4f6; padding: 15px; text-align: center; border-radius: 5px; color: #1e1b4b; letter-spacing: 5px; margin: 20px 0;">
          ${otpCode}
        </div>
        <p style="color: #6b7280; font-size: 12px;">This code is highly sensitive and is valid for the next 10 minutes. Do not share this code with anyone.</p>
      </div>
    `,
  });
};
