import { Request, Response } from 'express';
import UserService from '../services/user.service';
import User from '../models/user/user.model';
import { hashPassword } from '../utils/authUtils';

export default class UserController {
  static async getAllUsers(req: Request, res: Response) {
    const users = await UserService.getAllUsers();
    res.json(users);
  }

  static async createUser(req: Request, res: Response) {
    const { name, email, mobile, password } = req.body; // Exclude referralUrl from body
    const referralCode:any = req.params.referralCode || null; // Get referralCode from request parameters
  
    try {
      const newUser = await UserService.createUser({ name, email, mobile, password, referralCode });
      res.status(201).json(newUser);
    } catch (error:any) {
      res.status(400).json({ message: error.message });
    }
  }
  static async getReferralChain(req: Request, res: Response) {
    try {
      const { userId } = req.params; // Get the userId from request params
      const referralChain = await UserService.getReferralChain(Number(userId));

      if (!referralChain.length) {
        return res.status(404).json({ message: "No referral chain found" });
      }

      res.status(200).json(referralChain);
    } catch (error:any) {
      res.status(500).json({ message: "Error fetching referral chain", error: error.message });
    }
  }

  static async getUserReferralChainList(req: Request, res: Response) {
    try {
      const { userId } = req.params; // Get the userId from request params
      const referralChain = await UserService.getUserReferralChainList(Number(userId));

      if (!referralChain) {
        return res.status(404).json({ message: "No referral chain found" });
      }

      res.status(200).json(referralChain);
    } catch (error:any) {
      res.status(500).json({ message: "Error fetching referral chain", error: error.message });
    }
  }
  static async getReferralTree(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const referralChain = await UserService.getTreeLengthFromChildUserId(Number(userId));

      if (!referralChain) {
        return res.status(404).json({ message: "No referral chain found" });
      }

      res.status(200).json(referralChain);
    } catch (error:any) {
      res.status(500).json({ message: "Error fetching referral chain", error: error.message });
    }
  }

  // Optional: API to get the referrals made by a user
  static async getReferralChildren(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const referralChildren = await UserService.getReferralChildrenTaskCompleted(Number(userId));

      res.status(200).json(referralChildren);
    } catch (error:any) {
      res.status(500).json({ message: "Error fetching referral children", error: error.message });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { userId } = req.params; // Get the userId from request params
      const user = await UserService.getUserById(Number(userId));

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error:any) {
      res.status(500).json({ message: "Error fetching user", error: error.message });
    }
  }

  // Update User Status
  static async updateUserStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params; // Get the userId from request params
      const { status } = req.body; // Get the new status from request body

      const updatedUser = await UserService.updateUserStatus(Number(userId), status);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error:any) {
      res.status(500).json({ message: "Error updating user status", error: error.message });
    }
  }
  static async updateUser(req: Request, res: Response) {
    try {
      const { userId } = req.params; // Get the userId from request params

      const updatedUser = await UserService.updateUser(Number(userId), req.body);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error:any) {
      res.status(500).json({ message: "Error updating user status", error: error.message });
    }
  }

  
  static async resetPassword(req: Request, res: Response) {
    const { userId, token, newPassword } = req.body;
    const user = await User.findOne({ where: { id: userId, resetToken: token } });
    
    // Check if user exists and token is valid
    if (!user) return res.status(400).json({ message: 'Invalid token or user' });
    // if (user.resetTokenExpiry < Date.now()) return res.status(400).json({ message: 'Token expired' });
  
    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);
  
    // Update user password and clear the reset token
    user.password = hashedPassword;
    // user.resetToken = null;
    // user.resetTokenExpiry = null;
    await user.save();
  
    res.status(200).json({ message: 'Password reset successful!' });
  } 

  static async deleteUserProfile(req: Request, res: Response){
    try {
      const { userId } = req.params; // Get the userId from request params
      const user = await UserService.deleteUser(Number(userId));

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error:any) {
      res.status(500).json({ message: "Error fetching user", error: error.message });
    }
  }
}
