import Payment from '../models/user/payment.model';
import User from '../models/user/user.model';
import { hashPassword } from '../utils/authUtils';
import PaymentService from '../services/payment.service';

interface UserRegistrationData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  referralCode?: string;
}

export default class UserService {
  // Fetch all users with specific fields
  static async getAllUsers() {
    return await User.findAll({
      attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status'],
    });
  }

  static async getUserById(userId: any) {
    return await User.findByPk(userId, {
      attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status'],
    });
  }

  static async updateUserStatus(userId: any, status: any) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.status = status;
    await user.save();

    return user; // User will automatically only return selected attributes due to the above method definitions
  }

  // Create a user with optional referral handling
  static async createUser(data: UserRegistrationData) {
    return await this.registerUserWithReferral(data);
  }

  private static generateReferralCode(): string {
    const prefix = "REF";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter1 = letters.charAt(Math.floor(Math.random() * letters.length));
    const randomLetter2 = letters.charAt(Math.floor(Math.random() * letters.length));

    return `${prefix}${randomNum}${randomLetter1}${randomLetter2}`;
  }

  private static async generateUniqueReferralCode(): Promise<string> {
    let referralCode!: string;
    let isUnique = false;

    while (!isUnique) {
      referralCode = this.generateReferralCode();
      const existingUser = await User.findOne({ where: { referralCode } });
      isUnique = !existingUser;
    }

    return referralCode;
  }

  private static async registerUserWithReferral(data: UserRegistrationData) {
    const { name, email, mobile, password, referralCode } = data;
    const hashedPassword = await hashPassword(password);
    let parentUserId: number | null = null;

    if (referralCode) {
      const referrer: any = await User.findOne({ where: { referralCode } });
      if (referrer) {
        parentUserId = referrer.userId;

        const payment: any = await PaymentService.findPaymentByUserId(referrer.userId);
        if (payment.status === 'completed') {
          payment.totalAmount += 100;
          await payment.save();
        }
      }
    }

    const newUser = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      parentUserId,
      referralCode: await this.generateUniqueReferralCode(),
    });

    await newUser.save();

    return newUser;
  }

  static async getReferralChain(userId: number): Promise<{ user: User; referrals: User[] }[]> {
    const referralChain: { user: User; referrals: User[] }[] = [];
    let currentUser: any = await User.findByPk(userId, {
      attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status'],
    });

    while (currentUser) {
      const referrals = await User.findAll({
        where: { parentUserId: currentUser.userId },
        attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status'],
      });

      referralChain.push({ user: currentUser, referrals });

      currentUser = referrals.length > 0 ? referrals[0] : null;
    }

    return referralChain;
  }

  static async getUserReferralChainList(userId: number): Promise<{ user: User; referrals: any[] }> {
    async function fetchChain(currentUser: User): Promise<{ user: User; referrals: any[] }> {
      if (!currentUser) null;

      const referrals = await User.findAll({
        where: { parentUserId: currentUser.userId },
        attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status'],
      });

      const referralChain = await Promise.all(referrals.map(async (referral) => await fetchChain(referral)));

      return { user: currentUser, referrals: referralChain };
    }

    const initialUser: any = await User.findByPk(userId, {
      attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status'],
    });

    return await fetchChain(initialUser);
  }

  static async getReferralChildrenTaskCompleted(userId: number): Promise<{ user: User | null; referrals: any[], completedSixInnerSharing: boolean }> {
    async function fetchChain(currentUser: User | null): Promise<{ user: User | null; referrals: any[], completedSixInnerSharing: boolean }> {
      if (!currentUser) return { user: null, referrals: [], completedSixInnerSharing: false };

      const referrals = await User.findAll({
        where: { parentUserId: currentUser.userId },
        attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status'],
      });

      const completedSixInnerSharing = referrals.length >= 6;

      const referralChain = await Promise.all(referrals.map(async (referral) => await fetchChain(referral)));

      return { user: currentUser, referrals: referralChain, completedSixInnerSharing };
    }

    const initialUser: User | null = await User.findByPk(userId, {
      attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status'],
    });
    if (!initialUser) throw new Error('User not found');

    return await fetchChain(initialUser);
  }
}
