import { Request, Response } from 'express';
import User from '../models/user/user.model'; // Your Sequelize model
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateOtp, sendOtp } from '../utils/otp.utils';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user:any = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.userId, userName: user.name, status:user.status, emailVerified: user.emailVerified, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '8h', // Token expiration
    });

    return res.json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user: any = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a new OTP
    const otp = generateOtp(); // Example: a random 6-digit number
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Store OTP and its expiry in the database
    await user.update({ otp, otpExpiry });

    // Send OTP
    await sendOtp(email, otp); // Utility function to send OTP via email/SMS

    return res.json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error('Error resending OTP:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    // Check if user exists
    const user: any = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate OTP
    if (user.otp !== otp || new Date(user.otpExpiry) < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password and clear the OTP fields
    await user.update({
      password: hashedPassword,
      otp: null,
      otpExpiry: null,
    });

    return res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user: any = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP and expiration
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Update user with the OTP and expiration
    await user.update({ otp, otpExpiry });

    // Send OTP to user's email
    await sendOtp(email, otp);

    return res.json({ message: 'OTP sent successfully. Check your email.' });
  } catch (error) {
    console.error('Error in Forgot Password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { otp, email } = req.body;

  // Validate input
  if (!otp || !email) {
    return res.status(400).json({ status: "error", message: "OTP and Email are required" });
  }

  const user: any = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Validate OTP
  if (user.otp !== otp || new Date(user.otpExpiry) < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  // Check OTP validity
  if (email === user.email && otp === user.otp) {
    await user.update({
      emailVerified: true,
      otp: otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    return res.status(200).json({ 
      status: "success", 
      message: "OTP verified successfully",
    });
  }

  // Invalid OTP
  return res.status(401).json({ status: "error", message: "Invalid OTP or OTP expired" });
};