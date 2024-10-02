import { Request, Response } from 'express';
import User from '../models/user/user.model'; // Your Sequelize model
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
