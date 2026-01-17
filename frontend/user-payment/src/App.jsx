import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { Toaster } from 'react-hot-toast';
import { config } from './config/wagmi';
import Payment from './pages/Payment';
import './index.css';

function App() {
  return (
    <WagmiConfig config={config}>
      <BrowserRouter>
        <Routes>
          <Route path="/pay/:orderId" element={<Payment />} />
          <Route path="/" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">KKK POS 支付系统</h1>
                <p className="text-gray-600 mb-2">请扫描商家提供的支付二维码</p>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
                  <p className="text-sm text-blue-800">
                    💡 Web3 钱包支付界面已启用
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    配置 WalletConnect 后可进行真实支付
                  </p>
                </div>
              </div>
            </div>
          } />
        </Routes>
        <Toaster position="top-center" />
      </BrowserRouter>
    </WagmiConfig>
  );
}

export default App;
