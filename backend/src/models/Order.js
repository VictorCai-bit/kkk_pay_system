import { readJSON, writeJSON, generateId } from '../config/database.js';

const ORDERS_FILE = 'orders.json';
const MERCHANTS_FILE = 'merchants.json';

class Order {
  // 创建订单
  static async create({ orderId, merchantId, productId, productName, amount, status = 'pending' }) {
    const orders = await readJSON(ORDERS_FILE);
    const id = generateId(orders);
    
    const order = {
      id,
      order_id: orderId,
      merchant_id: merchantId,
      product_id: productId,
      product_name: productName,
      amount,
      status,
      tx_hash: null,
      user_wallet: null,
      paid_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    orders.push(order);
    await writeJSON(ORDERS_FILE, orders);
    
    return id;
  }

  // 根据订单ID查找（包含商家信息）
  static async findByOrderId(orderId) {
    const orders = await readJSON(ORDERS_FILE);
    const order = orders.find(o => o.order_id === orderId);
    
    if (!order) return null;
    
    // 获取商家信息
    const merchants = await readJSON(MERCHANTS_FILE);
    const merchant = merchants.find(m => m.id === order.merchant_id);
    
    return {
      ...order,
      store_name: merchant?.store_name || '',
      merchant_wallet: merchant?.wallet_address || null,
    };
  }

  // 根据ID查找
  static async findById(id) {
    const orders = await readJSON(ORDERS_FILE);
    return orders.find(o => o.id === id);
  }

  // 更新订单状态
  static async updateStatus(orderId, status, txHash = null, userWallet = null) {
    const orders = await readJSON(ORDERS_FILE);
    const index = orders.findIndex(o => o.order_id === orderId);
    
    if (index !== -1) {
      orders[index] = {
        ...orders[index],
        status,
        tx_hash: txHash,
        user_wallet: userWallet,
        paid_at: status === 'completed' ? new Date().toISOString() : orders[index].paid_at,
        updated_at: new Date().toISOString(),
      };
      
      await writeJSON(ORDERS_FILE, orders);
      return true;
    }
    
    return false;
  }

  // 获取商家的订单列表
  static async findByMerchantId(merchantId, status = null, page = 1, limit = 20) {
    const orders = await readJSON(ORDERS_FILE);
    let merchantOrders = orders.filter(o => o.merchant_id === merchantId);
    
    if (status) {
      merchantOrders = merchantOrders.filter(o => o.status === status);
    }
    
    merchantOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return merchantOrders.slice(start, end);
  }

  // 获取待支付订单
  static async getPendingOrders(merchantId) {
    const orders = await readJSON(ORDERS_FILE);
    return orders
      .filter(o => o.merchant_id === merchantId && o.status === 'pending')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  // 统计订单
  static async countByMerchant(merchantId, status = null) {
    const orders = await readJSON(ORDERS_FILE);
    let merchantOrders = orders.filter(o => o.merchant_id === merchantId);
    
    if (status) {
      merchantOrders = merchantOrders.filter(o => o.status === status);
    }
    
    return merchantOrders.length;
  }

  // 获取今日销售统计
  static async getTodayStats(merchantId) {
    const orders = await readJSON(ORDERS_FILE);
    const today = new Date().toISOString().split('T')[0];
    
    const todayOrders = orders.filter(o => {
      const orderDate = o.created_at.split('T')[0];
      return o.merchant_id === merchantId && orderDate === today;
    });
    
    const completedOrders = todayOrders.filter(o => o.status === 'completed');
    const totalAmount = completedOrders.reduce((sum, o) => sum + parseFloat(o.amount), 0);
    
    return {
      total_orders: todayOrders.length,
      completed_orders: completedOrders.length,
      total_amount: totalAmount.toFixed(2),
    };
  }
}

export default Order;
