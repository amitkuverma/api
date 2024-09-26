import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class OtpService {
  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'julee1544@gmail.com',
      pass: 'Julee@1234',
    },
  });

  private static fromEmail = 'julee1544@gmail.com';

  // Method to send OTP via email
  static async sendOtpEmail(recipient: string, otp: string): Promise<void> {
    const mailOptions = {
      from: OtpService.fromEmail,
      to: recipient,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    };

    try {
      await OtpService.transporter.sendMail(mailOptions);
      console.log(`OTP sent to email: ${recipient}`);
    } catch (error: any) {
      console.error(`Error sending OTP to email: ${error.message}`);
      throw new Error('Failed to send OTP to email');
    }
  }

  // Generic method to send OTP via email (since mobile OTP is removed)
  static async sendOtp(contact: string, otp: string): Promise<void> {
    await OtpService.sendOtpEmail(contact, otp);
  }
}

export default OtpService;
