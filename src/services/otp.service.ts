import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

class OtpService {
  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  private static twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  private static fromEmail = process.env.EMAIL_USER || '';
  private static fromMobile = process.env.TWILIO_PHONE_NUMBER || '';

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
    } catch (error:any) {
      console.error(`Error sending OTP to email: ${error.message}`);
      throw new Error('Failed to send OTP to email');
    }
  }

  static async sendOtpMobile(recipient: string, otp: string): Promise<void> {
    // Ensure the phone number is in E.164 format
    const formattedPhoneNumber = recipient.startsWith('+') ? recipient : `+${recipient}`;
  
    try {
      await OtpService.twilioClient.messages.create({
        body: `Your OTP code is: ${otp}`,
        from: OtpService.fromMobile,
        to: formattedPhoneNumber,
      });
      console.log(`OTP sent to mobile: ${recipient}`);
    } catch (error:any) {
      console.error(`Error sending OTP to mobile: ${error.message}`);
      throw new Error('Failed to send OTP to mobile');
    }
  }

  static async sendOtp(contact: string, otp: string, type: 'email' | 'mobile'): Promise<void> {
    if (type === 'email') {
      await OtpService.sendOtpEmail(contact, otp);
    } else if (type === 'mobile') {
      await OtpService.sendOtpMobile(contact, otp);
    } else {
      throw new Error('Invalid OTP type. Must be "email" or "mobile".');
    }
  }
}

export default OtpService;
