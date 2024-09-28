import { where } from 'sequelize';
import AccountDetails from '../models/user/account.model';

class AccountDetailsService {
  async createAccountDetails(data: any) {
    return AccountDetails.create(data);
  }

  async getAllAccountDetails() {
    return AccountDetails.findAll();
  }

  async getAccountDetailsById(id: number) {
    return AccountDetails.findOne({ where: { userId: id } });
  }

  async updateAccountDetails(id: number, data: any) {
    return AccountDetails.update(data, { where: { accId: id } });
  }

  async deleteAccountDetails(id: number) {
    return AccountDetails.destroy({ where: { accId: id } });
  }
}

export default new AccountDetailsService();
