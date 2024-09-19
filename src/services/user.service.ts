import User from '../models/user/user.model';
import bcrypt from 'bcrypt';

export default class UserService {
  static async getAllUsers() {
    return await User.findAll();
  }

  static async createUser(data: any) {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Replace the plain text password with the hashed password
    data.password = hashedPassword;

    // Create the user
    return await User.create(data);
  }
}
