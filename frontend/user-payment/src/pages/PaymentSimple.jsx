import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2, Wallet } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function PaymentSimple() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
      if (response.data.success) {
        setOrder(response.data.data);
      } else {
        setError('订单不存在');
      }
    } catch (error) {
      console.error('获取订单失败:', error);
      setError('获取订单失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTestPay = () => {
    alert('测试支付功能\n\n实际支付需要配置 Web3 钱包连接');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">加载订单中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
          <p className="text-gray-600">订单ID: {orderId}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  if (order.status === 'completed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">支付成功！</h2>
          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">商品名称</span>
              <span className="font-semibold">{order.product_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">支付金额</span>
              <span className="font-semibold text-green-600">¥{order.amount}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (order.status === 'cancelled') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <XCircle className="w-20 h-20 text-red-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">订单已取消</h2>
          <p className="text-gray-600">该订单已被取消，无法继续支付</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">订单支付</h1>
          <p className="text-gray-600">{order.store_name}</p>
        </div>

        {/* 订单信息 */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="mb-4">
            <p className="text-gray-600 text-sm mb-1">商品名称</p>
            <p className="text-lg font-semibold text-gray-800">{order.product_name}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 text-sm mb-1">订单号</p>
            <p className="text-xs font-mono text-gray-800 break-all">{order.order_id}</p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">支付金额</p>
              <p className="text-3xl font-bold text-blue-600">¥{order.amount}</p>
            </div>
          </div>
        </div>

        {/* 提示信息 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800 text-center">
            ⚠️ 测试模式：需要配置 Web3 钱包才能真实支付
          </p>
        </div>

        {/* 支付按钮 */}
        <button
          onClick={handleTestPay}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg font-bold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
        >
          <Wallet className="w-5 h-5" />
          <span>连接钱包支付</span>
        </button>

        {/* 说明 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800 mb-2">
            💡 完整支付功能需要配置：
          </p>
          <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
            <li>WalletConnect Project ID</li>
            <li>Monad RPC URL</li>
            <li>智能合约地址</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
