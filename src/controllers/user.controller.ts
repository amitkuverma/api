import { Request, Response } from 'express';
import UserService from '../services/user.service';

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

  // Optional: API to get the referrals made by a user
  static async getReferralChildren(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const referralChildren = await UserService.getReferralChildren(Number(userId));

      res.status(200).json(referralChildren);
    } catch (error:any) {
      res.status(500).json({ message: "Error fetching referral children", error: error.message });
    }
  }
}
