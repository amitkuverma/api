import OtpService from '../services/otp.service'; // Adjust path as needed
import { Request, Response } from 'express';
import User from '../models/user/user.model';

class OTPController {
  // Method to send OTP via email
  static async sendOtp(req: Request, res: Response) {
    const { userId } = req.body;

    // Find the user by userId
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update the User model to store the OTP and set verified to false
    await User.update(
      { otp, emailVerified: false }, // Assuming you want to store OTP and mark email as not verified
      { where: { userId } } // Find the user by userId
    );

    // Send the OTP via email
    await OtpService.sendOtp(user.email, otp);

    return res.status(200).json({ message: 'OTP sent successfully to email' });
  }

  // Method to verify OTP for email
  static async verifyOtp(req: Request, res: Response) {
    const { userId, otp } = req.body;

    // Find the OTP entry in the database
    const otpVerification: any = await User.findOne({
      where: { userId, otp, verified: false },
    });

    if (!otpVerification) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark the OTP as verified
    otpVerification.verified = true;
    await otpVerification.save();

    // Mark user's email as verified
    const user: any = await User.findByPk(userId);
    user.emailVerified = true;
    await user.save();

    return res.status(200).json({ message: 'OTP verified successfully, email verified' });
  }
}

export default OTPController;
