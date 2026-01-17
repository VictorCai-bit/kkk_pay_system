# KKK POS 项目说明

## ⚠️ 重要提示

在正式使用前，您需要完成以下配置：

### 1. 智能合约配置

本项目需要您提供以下智能合约信息：

- **支付合约地址** (CONTRACT_ADDRESS)
- **USDT 合约地址** (USDT_CONTRACT_ADDRESS)
- **Monad RPC URL** (MONAD_RPC_URL)

请在以下文件中配置：
- `backend/.env` - 后端配置
- `frontend/user-payment/.env` - 用户支付端配置

### 2. WalletConnect 配置

访问 https://cloud.walletconnect.com/ 注册并获取 Project ID，然后配置到：
- `frontend/user-payment/.env` 中的 `VITE_WALLET_CONNECT_PROJECT_ID`

### 3. Monad 链配置

根据您使用的 Monad 网络（测试网或主网），更新以下文件中的链配置：
- `frontend/user-payment/src/config/index.js` 中的 `MONAD_CHAIN` 对象

包括：
- Chain ID
- RPC URLs
- Block Explorer URL

### 4. 合约 ABI

如果您的智能合约接口与示例不同，请更新：
- `backend/src/services/blockchainService.js` - 后端合约 ABI
- `frontend/user-payment/src/contracts/abi.js` - 前端合约 ABI

## 🚀 快速开始

完成上述配置后，请参考：
- [部署指南](./docs/DEPLOYMENT.md) - 详细的安装和部署步骤
- [API 文档](./docs/API.md) - API 接口说明

## 📂 项目结构

```
kkk_pos/
├── backend/                    # Node.js 后端
│   ├── src/
│   │   ├── config/            # 配置文件
│   │   ├── controllers/       # 控制器
│   │   ├── models/            # 数据模型
│   │   ├── routes/            # 路由
│   │   ├── services/          # 业务逻辑（含区块链监听）
│   │   ├── middleware/        # 中间件
│   │   └── utils/             # 工具函数
│   ├── package.json
│   └── env.example            # 环境变量示例
│
├── frontend/
│   ├── merchant-mobile/       # 商家手机端（扫码）
│   │   ├── src/
│   │   │   ├── pages/        # 页面组件
│   │   │   ├── contexts/     # React Context
│   │   │   ├── utils/        # 工具函数
│   │   │   └── config/       # 配置
│   │   └── package.json
│   │
│   ├── merchant-desktop/      # 商家电脑端（收银台）
│   │   ├── src/
│   │   │   ├── pages/        # 页面组件
│   │   │   ├── utils/        # 工具函数（含语音播报）
│   │   │   └── config/       # 配置
│   │   └── package.json
│   │
│   └── user-payment/          # 用户支付端（钱包连接）
│       ├── src/
│       │   ├── pages/        # 页面组件
│       │   ├── config/       # 配置（含 Web3）
│       │   ├── contracts/    # 合约 ABI
│       │   └── utils/        # 工具函数
│       └── package.json
│
├── contracts/                  # 智能合约 ABI
│   └── PaymentContract.abi.json
│
├── docs/                       # 文档
│   ├── API.md                 # API 文档
│   └── DEPLOYMENT.md          # 部署指南
│
└── README.md                   # 项目说明
```

## 🔑 核心功能实现

### 1. 后端服务 (Node.js + Express)
- ✅ 商家认证和管理
- ✅ 商品 CRUD
- ✅ 订单管理
- ✅ Socket.IO 实时通信
- ✅ 区块链合约事件监听

### 2. 商家手机端 (React)
- ✅ 登录/注册
- ✅ 扫码功能（@zxing/library）
- ✅ 创建订单
- ✅ 商品管理

### 3. 商家电脑端 (React)
- ✅ 收银台界面
- ✅ 实时接收订单（Socket.IO）
- ✅ 生成支付二维码（qrcode.react）
- ✅ 语音播报（Web Speech API）
- ✅ 订单统计

### 4. 用户支付端 (React + Web3)
- ✅ WalletConnect 集成
- ✅ 钱包连接
- ✅ USDT 授权和支付
- ✅ 智能合约交互（ethers.js）
- ✅ 支付状态实时反馈

## 🛠 技术栈

### 后端
- Node.js + Express
- MySQL + mysql2
- Socket.IO
- ethers.js
- JWT 认证
- bcryptjs 密码加密

### 前端
- React 18
- Vite
- TailwindCSS
- React Router
- Axios
- Socket.IO Client

### Web3
- ethers.js v6
- WalletConnect
- wagmi
- viem

## 📋 待办事项

在正式使用前，请确保：

- [ ] 配置智能合约地址
- [ ] 配置 Monad RPC URL
- [ ] 获取 WalletConnect Project ID
- [ ] 更新链配置信息
- [ ] 测试网环境测试
- [ ] 生产环境安全配置

## 📞 帮助

如有问题，请：
1. 查看 [部署指南](./docs/DEPLOYMENT.md) 的故障排除部分
2. 检查所有配置文件是否正确
3. 确保智能合约已正确部署
4. 验证网络连接和 RPC 可用性

## 🔐 安全提醒

- 不要将包含敏感信息的 `.env` 文件提交到版本控制
- 生产环境使用强密码和安全的 JWT 密钥
- 定期备份数据库
- 智能合约务必经过审计
- 先在测试网充分测试

## 📄 许可证

MIT License
