import crypto from 'crypto';
import  User from '../models/user/user.model'; // ORM model for User
import { sendEmail } from '../utils/email.service'; // Utility for sending emails

class AuthService {
  async requestPasswordReset(email: string): Promise<void> {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    // Generate reset token and expiry time
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    // Update user record with the reset token
    // user.resetToken = resetToken;
    // user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email
    const resetLink = `https://gorkhacoin.com/reset-password?token=${resetToken}&id=${user.userId}`;
    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      text: `Click the following link to reset your password: ${resetLink}`,
    });
  }
}

export default new AuthService();