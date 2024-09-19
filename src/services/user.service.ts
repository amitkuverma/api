import User from '../models/user/user.model';

export default class UserService {
  static async getAllUsers() {
    return await User.findAll();
  }

  static async createUser(data: any) {
    return await User.create(data);
  }
}
