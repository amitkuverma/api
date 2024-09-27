import Payment from '../models/user/payment.model';
import User from '../models/user/user.model';
import { hashPassword } from '../utils/authUtils';
import PaymentService from '../services/payment.service'

interface UserRegistrationData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  referralCode?: string; // Change from referralUrl to referralCode
}

export default class UserService {
  // Fetch all users
  static async getAllUsers() {
    return await User.findAll();
  }

  static async getUserById(userId: any) {
    return await User.findByPk(userId);
  }

  static async updateUserStatus(userId: any, status: any) {
    // Find the user by ID
    const user = await User.findByPk(userId);

    // Check if the user exists
    if (!user) {
      throw new Error('User not found'); // Throw an error if the user is not found
    }

    // Update the user's status
    user.status = status;

    // Save the user and wait for the operation to complete
    await user.save();

    return user; // Return the updated user
  }
  // Create a user with optional referral handling
  static async createUser(data: UserRegistrationData) {
    return await this.registerUserWithReferral(data);
  }

  // Generate a unique referral code
  private static generateReferralCode(): string {
    const prefix = "REF"; // Define the prefix
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Generate a random number between 1000 and 9999

    // Generate two random letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Uppercase letters
    const randomLetter1 = letters.charAt(Math.floor(Math.random() * letters.length));
    const randomLetter2 = letters.charAt(Math.floor(Math.random() * letters.length));

    return `${prefix}${randomNum}${randomLetter1}${randomLetter2}`; // Combine everything
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

  // Register a user with referral functionality
  private static async registerUserWithReferral(data: UserRegistrationData) {
    const { name, email, mobile, password, referralCode } = data;

    // Hash the user's password
    const hashedPassword = await hashPassword(password);

    let parentUserId: number | null = null;

    // Check if a referral code is provided and valid
    if (referralCode) {
      const referrer: any = await User.findOne({ where: { referralCode } });
      if (referrer) {
        parentUserId = referrer.userId; // Set parent user ID if referral is valid

        const payment: any = await PaymentService.findPaymentByUserId(referrer.userId);

        // Check if the referrer meets the bonus conditions
        if (payment.status === 'completed') {
          payment.totalAmount += 100; // Add 100 to referrer's initial amount
          await payment.save(); // Save the updated referrer
        }
      }
    }

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      parentUserId,
      referralCode: await this.generateUniqueReferralCode(), // Generate and assign referral code
    });

    await newUser.save(); // Save the updated referral URL

    return newUser; // Return the newly created user
  }

  static async getReferralChain(userId: number): Promise<{ user: User; referrals: User[] }[]> {
    const referralChain: { user: User; referrals: User[] }[] = [];
    let currentUser: any = await User.findByPk(userId);

    while (currentUser) {
      // Find users who were referred by the current user
      const referrals = await User.findAll({ where: { parentUserId: currentUser.userId } });

      // Push the current user and their referrals into the chain
      referralChain.push({ user: currentUser, referrals });

      // Move to the next user in the chain (if any)
      currentUser = referrals.length > 0 ? referrals[0] : null; // You can change this logic based on your needs
    }

    return referralChain; // This will give you a structured array with users and their referrals
  }

  static async getUserReferralChainList(userId: number): Promise<{ user: User; referrals: any[] }> {
    // Recursive function to fetch the referral chain
    async function fetchChain(currentUser: User): Promise<{ user: User; referrals: any[] }> {
      if (!currentUser) null;

      // Find users who were referred by the current user
      const referrals = await User.findAll({ where: { parentUserId: currentUser.userId } });

      // For each referral, recursively fetch their referrals
      const referralChain = await Promise.all(
        referrals.map(async (referral) => await fetchChain(referral))
      );

      // Return the current user along with their referrals
      return { user: currentUser, referrals: referralChain };
    }

    // Start the referral chain with the initial user
    const initialUser: any = await User.findByPk(userId);
    return await fetchChain(initialUser);
  }

  // Optional: Fetch the chain of referrals made by a user (all the users they referred)
  static async getReferralChildrenTaskCompleted(userId: number): Promise<{ user: User | null; referrals: any[], completedSixInnerSharing: boolean }> {
    // Recursive function to fetch the referral chain
    async function fetchChain(currentUser: User | null): Promise<{ user: User | null; referrals: any[], completedSixInnerSharing: boolean }> {
      if (!currentUser) return { user: null, referrals: [], completedSixInnerSharing: false };

      // Find users who were referred by the current user
      const referrals = await User.findAll({ where: { parentUserId: currentUser.userId } });

      // Check if the current user has completed 6 inner sharings
      const completedSixInnerSharing = referrals.length >= 6;

      // For each referral, recursively fetch their referrals
      const referralChain = await Promise.all(
        referrals.map(async (referral) => await fetchChain(referral))
      );

      // Return the current user along with their referrals and completion status
      return { user: currentUser, referrals: referralChain, completedSixInnerSharing };
    }

    // Start the referral chain with the initial user
    const initialUser: User | null = await User.findByPk(userId); // Explicitly define initialUser as User | null
    if (!initialUser) throw new Error('User not found'); // Handle case where user is not found

    return await fetchChain(initialUser);
  }
}