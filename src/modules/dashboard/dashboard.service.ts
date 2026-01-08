import { AppDataSource } from '../../config/datasource';
import { Order, OrderStatus } from '../../entities/Order';
import { OrderItem } from '../../entities/OrderItem';
import { Product } from '../../entities/Product';
import { Between } from 'typeorm';

export class DashboardService {
  private orderRepository = AppDataSource.getRepository(Order);
  private orderItemRepository = AppDataSource.getRepository(OrderItem);
  private productRepository = AppDataSource.getRepository(Product);

  async getSummary(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    totalProfit: number;
    totalLoss: number;
  }> {
    const orders = await this.orderRepository.find({
      where: { status: OrderStatus.PROCEEDED },
      relations: ['orderItems', 'orderItems.product'],
    });

    let totalRevenue = 0;
    let totalProfit = 0;
    let totalLoss = 0;

    for (const order of orders) {
      totalRevenue += parseFloat(order.totalAmount.toString());

      for (const orderItem of order.orderItems) {
        const product = orderItem.product;
        const salePrice = parseFloat(product.salePrice.toString());
        const purchasePrice = parseFloat(product.purchasePrice.toString());
        const margin = salePrice - purchasePrice;
        const itemProfit = margin * orderItem.quantity;

        if (itemProfit > 0) {
          totalProfit += itemProfit;
        } else {
          totalLoss += Math.abs(itemProfit);
        }
      }
    }

    return {
      totalOrders: orders.length,
      totalRevenue,
      totalProfit,
      totalLoss,
    };
  }

  async getCharts(days: number = 30): Promise<{
    ordersPerDay: Array<{ date: string; count: number }>;
    revenuePerDay: Array<{ date: string; amount: number }>;
    profitPerDay: Array<{ date: string; amount: number }>;
  }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await this.orderRepository.find({
      where: {
        status: OrderStatus.PROCEEDED,
        createdAt: Between(startDate, endDate),
      },
      relations: ['orderItems', 'orderItems.product'],
      order: { createdAt: 'ASC' },
    });

    const ordersMap = new Map<string, number>();
    const revenueMap = new Map<string, number>();
    const profitMap = new Map<string, number>();

    for (const order of orders) {
      const date = order.createdAt.toISOString().split('T')[0];
      
      // Orders count
      ordersMap.set(date, (ordersMap.get(date) || 0) + 1);
      
      // Revenue
      const revenue = parseFloat(order.totalAmount.toString());
      revenueMap.set(date, (revenueMap.get(date) || 0) + revenue);
      
      // Profit
      let orderProfit = 0;
      for (const orderItem of order.orderItems) {
        const product = orderItem.product;
        const salePrice = parseFloat(product.salePrice.toString());
        const purchasePrice = parseFloat(product.purchasePrice.toString());
        const margin = salePrice - purchasePrice;
        orderProfit += margin * orderItem.quantity;
      }
      profitMap.set(date, (profitMap.get(date) || 0) + orderProfit);
    }

    const ordersPerDay: Array<{ date: string; count: number }> = [];
    const revenuePerDay: Array<{ date: string; amount: number }> = [];
    const profitPerDay: Array<{ date: string; amount: number }> = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      ordersPerDay.push({
        date: dateStr,
        count: ordersMap.get(dateStr) || 0,
      });

      revenuePerDay.push({
        date: dateStr,
        amount: revenueMap.get(dateStr) || 0,
      });

      profitPerDay.push({
        date: dateStr,
        amount: profitMap.get(dateStr) || 0,
      });
    }

    return {
      ordersPerDay,
      revenuePerDay,
      profitPerDay,
    };
  }
}
