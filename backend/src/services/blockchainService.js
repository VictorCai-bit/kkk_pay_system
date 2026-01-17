import { ethers } from 'ethers';
import config from '../config/index.js';
import Order from '../models/Order.js';

// 合约 ABI
const CONTRACT_ABI = [
  'event PaymentCompleted(bytes32 indexed orderId, address indexed user, address indexed merchant, uint256 amount, uint256 timestamp)',
  'function pay(bytes32 orderId) external payable',
];

class BlockchainService {
  constructor(io) {
    this.io = io;
    this.provider = null;
    this.contract = null;
    this.isListening = false;
  }

  // 初始化
  async initialize() {
    try {
      if (!config.blockchain.rpcUrl || !config.blockchain.contractAddress) {
        console.warn('区块链配置不完整，跳过初始化');
        return;
      }

      this.provider = new ethers.JsonRpcProvider(config.blockchain.rpcUrl);
      this.contract = new ethers.Contract(
        config.blockchain.contractAddress,
        CONTRACT_ABI,
        this.provider
      );

      console.log('区块链服务初始化成功');
      console.log('支付代币：MON (Monad 原生代币)');
      await this.startListening();
    } catch (error) {
      console.error('区块链服务初始化失败:', error);
    }
  }

  // 开始监听合约事件
  async startListening() {
    if (this.isListening || !this.contract) {
      return;
    }

    try {
      console.log('开始监听支付完成事件...');

      this.contract.on('PaymentCompleted', async (orderId, user, merchant, amount, timestamp, event) => {
        try {
          console.log('收到支付完成事件:', {
            orderId: orderId,
            user,
            merchant,
            amount: ethers.formatEther(amount) + ' MON',
            timestamp: timestamp.toString(),
            txHash: event.log.transactionHash,
          });

          // 将 bytes32 转换为 UUID 字符串
          const orderIdStr = this.bytes32ToUUID(orderId);
          
          // 更新订单状态
          await Order.updateStatus(
            orderIdStr,
            'completed',
            event.log.transactionHash,
            user
          );

          // 获取订单详情
          const order = await Order.findByOrderId(orderIdStr);

          if (order) {
            // 通知商家电脑端
            this.io.to(`merchant_${order.merchant_id}`).emit('payment_completed', {
              orderId: orderIdStr,
              amount: order.amount,
              txHash: event.log.transactionHash,
              userWallet: user,
            });

            console.log(`订单 ${orderIdStr} 支付成功，已通知商家`);
          }
        } catch (error) {
          console.error('处理支付完成事件失败:', error);
        }
      });

      this.isListening = true;
      console.log('合约事件监听已启动');
    } catch (error) {
      console.error('启动事件监听失败:', error);
    }
  }

  // 停止监听
  stopListening() {
    if (this.contract && this.isListening) {
      this.contract.removeAllListeners('PaymentCompleted');
      this.isListening = false;
      console.log('合约事件监听已停止');
    }
  }

  // UUID 转 bytes32
  uuidToBytes32(uuid) {
    const hex = uuid.replace(/-/g, '');
    return '0x' + hex;
  }

  // bytes32 转 UUID
  bytes32ToUUID(bytes32) {
    const hex = bytes32.slice(2);
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32),
    ].join('-');
  }

  // 获取交易详情
  async getTransaction(txHash) {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    return await this.provider.getTransaction(txHash);
  }

  // 获取交易回执
  async getTransactionReceipt(txHash) {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    return await this.provider.getTransactionReceipt(txHash);
  }
}

export default BlockchainService;
