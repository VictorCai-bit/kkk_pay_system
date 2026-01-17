import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Package, LogOut, ScanLine } from 'lucide-react';

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{user?.storeName}</h1>
            <p className="text-blue-100 text-sm mt-1">欢迎，{user?.username}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        {/* Today Stats */}
        {stats && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-blue-100 text-sm mb-2">今日销售</p>
            <div className="flex justify-around">
              <div>
                <p className="text-2xl font-bold">{stats.completed_orders}</p>
                <p className="text-blue-100 text-sm">订单数</p>
              </div>
              <div>
                <p className="text-2xl font-bold">¥{stats.total_amount}</p>
                <p className="text-blue-100 text-sm">销售额</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Actions */}
      <div className="p-6 space-y-4">
        <button
          onClick={() => navigate('/scan')}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3"
        >
          <ScanLine className="w-8 h-8" />
          <span className="text-xl font-bold">扫码收款</span>
        </button>

        <button
          onClick={() => navigate('/products')}
          className="w-full bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all flex items-center justify-center space-x-3"
        >
          <Package className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold text-gray-800">商品管理</span>
        </button>
      </div>

      {/* Instructions */}
      <div className="p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">使用说明</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>点击"扫码收款"扫描商品条码</li>
            <li>系统自动创建订单并同步到电脑端</li>
            <li>电脑端显示支付二维码供顾客扫描</li>
            <li>支付完成后自动语音播报</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
