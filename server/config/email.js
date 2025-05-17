import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

console.log('Initializing Resend with API key:', process.env.RESEND_API_KEY ? 'API key exists' : 'API key missing');

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetPasswordEmail = async (email, resetLink) => {
  try {
    console.log('Preparing to send email to:', email);
    console.log('Using reset link:', resetLink);

    const response = await resend.emails.send({
      from: 'SpendSmart <you@resend.dev>',
      to: email,
      subject: 'Reset Your SpendSmart Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0056b3;">Reset Your Password</h2>
          <p>You recently requested to reset your password for your SpendSmart account. Click the button below to reset it:</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #0056b3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
          <p>This password reset link will expire in 1 hour.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">SpendSmart - Smart financial management</p>
        </div>
      `
    });

    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error details:', error);
    throw error;
  }
};