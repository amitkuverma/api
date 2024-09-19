import { Request, Response } from 'express';
import UserService from '../services/user.service';

export default class UserController {
  static async getAllUsers(req: Request, res: Response) {
    const users = await UserService.getAllUsers();
    res.json(users);
  }

  static async createUser(req: Request, res: Response) {
    const newUser = await UserService.createUser(req.body);
    res.status(201).json(newUser);
  }
}
