import { Request, Response } from 'express';
import AuthService from '../services/auth.service';

class AuthController {
    async forgotPassword(req: Request, res: Response) {
        try {
          const { email } = req.body;
          await AuthService.requestPasswordReset(email);
          res.status(200).json({ message: 'Password reset link sent!' });
        } catch (error:any) {
          res.status(404).json({ message: error.message });
        }
      }
  }
  
  export default new AuthController();