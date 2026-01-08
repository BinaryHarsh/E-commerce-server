import { AppDataSource } from '../../config/datasource';
import { Notification } from '../../entities/Notification';
import { AppError } from '../../middlewares/error.middleware';

export class NotificationsService {
  private notificationRepository = AppDataSource.getRepository(Notification);

  async getAllNotifications(
    page: number = 1,
    limit: number = 10,
    isRead?: boolean
  ): Promise<{
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (isRead !== undefined) {
      where.isRead = isRead;
    }

    const [notifications, total] = await this.notificationRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { notifications, total, page, limit };
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    notification.isRead = true;
    return await this.notificationRepository.save(notification);
  }
}
