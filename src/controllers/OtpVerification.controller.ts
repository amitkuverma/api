import OtpService from '../services/otp.service'; // Adjust path as needed
import { Request, Response } from 'express';
import User from '../models/user/user.model';
import OTPVerification from '../models/user/otpVerification.model';

class OtpController {
  // Method to send OTP
  static async sendOtp(req: Request, res: Response) {
    const { userId, type } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    // Store OTP in database (assuming you have OtpVerification model)
    await OTPVerification.create({ userId, otp, verified: false });

    // Send OTP via email or mobile
    await OtpService.sendOtp(type === 'email' ? user.email : user.mobile, otp, type);

    return res.status(200).json({ message: 'OTP sent successfully' });
  }

  // Method to verify OTP
  static async verifyOtp(req: Request, res: Response) {
    const { userId, otp, type } = req.body;

    const otpVerification:any = await OTPVerification.findOne({
      where: { userId, otp, verified: false },
    });

    if (!otpVerification) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    otpVerification.verified = true;
    await otpVerification.save();

    const user:any = await User.findByPk(userId);
    if (type === 'email') {
      user.emailVerified = true;
    } else if (type === 'mobile') {
      user.mobileVerified = true;
    }

    await user.save();

    return res.status(200).json({ message: 'OTP verified successfully' });
  }
}

export default OtpController;
