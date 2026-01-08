import { AppDataSource } from '../config/datasource';
import { User, UserRole } from '../entities/User';
import { hashPassword } from './password';

/**
 * Script to create an admin user
 * Run this after migrations: npm run dev, then call this function
 */
export async function createAdminUser() {
  try {
    await AppDataSource.initialize();
    
    const userRepository = AppDataSource.getRepository(User);
    
    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await hashPassword('admin123');
    const admin = userRepository.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    });

    await userRepository.save(admin);
    console.log('Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Run if called directly
if (require.main === module) {
  createAdminUser()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
