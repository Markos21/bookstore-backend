import { LoginRepository } from '../repository/LoginRepository';

export class LoginService {
  constructor(private loginRepository: LoginRepository) {}

  async login(email: string, password: string): Promise<any | null> {
    try {
      const user = await this.loginRepository.getUserByEmail(email);
      if (!user) {
        return null; // User not found
      }
  
      if (user.password !== password) {
        return null; // Invalid password
      }
  
      return { userId: user.id, role: user.role_id,customer_points:user.points,name:user.customer_name, lastLogin: new Date() };
    } catch (error) {
      return error; 
    }
  }
  
}