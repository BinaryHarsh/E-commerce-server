import { AppDataSource } from '../../config/datasource';
import { User, UserRole } from '../../entities/User';
import { hashPassword } from '../../utils/password';
import { AppError } from '../../middlewares/error.middleware';

export class UsersService {
  private userRepository = AppDataSource.getRepository(User);

  async getAllUsers(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { users, total, page, limit };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const hashedPassword = await hashPassword(data.password);
    const user = this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || UserRole.USER,
      isActive: true,
    });

    return await this.userRepository.save(user);
  }

  async updateUser(id: string, data: {
    name?: string;
    email?: string;
    role?: UserRole;
    isActive?: boolean;
  }): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
      if (existingUser) {
        throw new AppError('Email already in use', 400);
      }
      user.email = data.email;
    }

    if (data.name) user.name = data.name;
    if (data.role) user.role = data.role;
    if (data.isActive !== undefined) user.isActive = data.isActive;

    return await this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    await this.userRepository.remove(user);
  }
}
