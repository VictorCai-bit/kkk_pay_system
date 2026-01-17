# Zeabur 部署指南

本指南将帮助您将整个 Web3 离线购物系统部署到 Zeabur 平台。

## 📋 部署前准备

### 1. 注册 Zeabur 账号

访问 [Zeabur](https://zeabur.com) 并使用 GitHub 账号登录。

### 2. 推送代码到 GitHub

确保您的项目已经推送到 GitHub 仓库：

```bash
# 如果还没有 git 仓库，先初始化
git init
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库后，推送代码
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 3. 准备智能合约信息

确保您有以下信息：
- ✅ Monad RPC URL
- ✅ 支付合约地址 (CONTRACT_ADDRESS)
- ✅ 合约 ABI (已在 `contracts/PaymentContract.abi.json`)
- ✅ WalletConnect Project ID

---

## 🚀 部署步骤

### 第一步：部署后端服务

#### 1. 在 Zeabur 创建项目

1. 登录 Zeabur 控制台
2. 点击 **"New Project"**（新建项目）
3. 输入项目名称，如 `web3-pos-system`
4. 选择地区（推荐：**Hong Kong** 或 **Tokyo**，国内访问较快）

#### 2. 添加后端服务

1. 在项目中点击 **"Add Service"**（添加服务）
2. 选择 **"GitHub"**
3. 授权并选择您的仓库
4. 选择 **"backend"** 目录作为服务根目录
5. Zeabur 会自动检测到 Node.js 项目

#### 3. 配置后端环境变量

在后端服务的 **"Variables"**（环境变量）页面添加：

```bash
# 服务器配置
NODE_ENV=production
PORT=3000

# JWT 密钥（请更换为您自己的随机字符串）
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# 前端 URL（部署后端后会获得域名，先留空）
CORS_ORIGINS=

# Monad 区块链配置
MONAD_RPC_URL=https://your-monad-rpc-url
CONTRACT_ADDRESS=0xYourContractAddress

# 支付页面 URL（部署前端后会获得，先留空）
PAYMENT_URL=
```

#### 4. 配置数据持久化存储

这是**非常重要**的一步，确保数据不会丢失：

1. 在后端服务页面，找到 **"Volumes"**（存储卷）
2. 点击 **"Add Volume"**
3. 配置：
   - **Mount Path**: `/app/backend/data`
   - **Volume Size**: `1 GB`（免费额度足够）
4. 保存配置

#### 5. 获取后端域名

1. 部署完成后，在服务页面找到 **"Domains"**（域名）
2. 点击 **"Generate Domain"**（生成域名）
3. 复制生成的域名，如：`backend-xxx.zeabur.app`

---

### 第二步：部署前端服务

您需要部署 **3 个前端服务**：

#### 1. 商家移动端（Merchant Mobile）

1. 在同一项目中点击 **"Add Service"**
2. 选择您的 GitHub 仓库
3. 选择 **"frontend/merchant-mobile"** 作为根目录
4. 配置环境变量：

```bash
VITE_API_BASE_URL=https://backend-xxx.zeabur.app
```

5. 生成域名，如：`merchant-mobile-xxx.zeabur.app`

#### 2. 商家桌面端（Merchant Desktop）

1. 重复上述步骤
2. 选择 **"frontend/merchant-desktop"** 作为根目录
3. 配置环境变量：

```bash
VITE_API_BASE_URL=https://backend-xxx.zeabur.app
```

4. 生成域名，如：`merchant-desktop-xxx.zeabur.app`

#### 3. 用户支付页（User Payment）

1. 重复上述步骤
2. 选择 **"frontend/user-payment"** 作为根目录
3. 配置环境变量：

```bash
VITE_API_BASE_URL=https://backend-xxx.zeabur.app
VITE_WALLETCONNECT_PROJECT_ID=1fba176f84da8ad01ca69caa0074f292
VITE_MONAD_RPC_URL=https://your-monad-rpc-url
VITE_CONTRACT_ADDRESS=0xYourContractAddress
```

4. 生成域名，如：`payment-xxx.zeabur.app`

---

### 第三步：更新后端环境变量

现在所有服务都部署完成，需要更新后端的环境变量：

1. 回到**后端服务**的环境变量页面
2. 更新以下变量：

```bash
# CORS 允许的前端域名（用逗号分隔）
CORS_ORIGINS=https://merchant-mobile-xxx.zeabur.app,https://merchant-desktop-xxx.zeabur.app,https://payment-xxx.zeabur.app

# 支付页面 URL
PAYMENT_URL=https://payment-xxx.zeabur.app/pay
```

3. 保存后，后端服务会自动重启

---

## 📱 访问您的应用

部署完成后，您可以通过以下地址访问：

| 服务 | 用途 | 访问地址 |
|------|------|----------|
| 商家移动端 | 商家手机扫码 | `https://merchant-mobile-xxx.zeabur.app` |
| 商家桌面端 | 商家电脑收银 | `https://merchant-desktop-xxx.zeabur.app` |
| 用户支付页 | 用户扫码支付 | `https://payment-xxx.zeabur.app/pay/{orderId}` |
| 后端 API | 后台接口 | `https://backend-xxx.zeabur.app` |

---

## 🔐 初始化管理员账号

部署完成后，需要创建管理员账号：

### 方法 1：通过 API 注册

```bash
curl -X POST https://backend-xxx.zeabur.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "phone": "13800138000"
  }'
```

### 方法 2：在 Zeabur 控制台直接编辑

1. 进入后端服务页面
2. 点击 **"Console"**（控制台）
3. 执行以下命令：

```bash
cd backend
node -e "
const bcrypt = require('bcryptjs');
const fs = require('fs');
const merchants = JSON.parse(fs.readFileSync('/app/backend/data/merchants.json'));
merchants.push({
  id: 1,
  username: 'admin',
  password: bcrypt.hashSync('admin123', 10),
  phone: '13800138000',
  created_at: new Date().toISOString()
});
fs.writeFileSync('/app/backend/data/merchants.json', JSON.stringify(merchants, null, 2));
console.log('Admin user created!');
"
```

---

## 🎯 测试部署

### 1. 测试后端 API

```bash
curl https://backend-xxx.zeabur.app/api/health
```

应该返回：`{"status":"ok"}`

### 2. 测试商家登录

1. 访问 `https://merchant-mobile-xxx.zeabur.app`
2. 使用创建的管理员账号登录
3. 尝试添加商品

### 3. 测试完整支付流程

1. 商家移动端扫描商品（或手动输入商品 ID）
2. 查看商家桌面端是否显示订单
3. 扫描生成的二维码（或复制链接）
4. 在支付页面连接钱包并支付
5. 确认商家端收到语音播报

---

## 🔧 常见问题

### 1. 前端无法连接后端

**问题**：前端显示网络错误

**解决方案**：
- 检查后端的 `CORS_ORIGINS` 是否包含所有前端域名
- 检查前端的 `VITE_API_BASE_URL` 是否正确
- 在浏览器开发者工具中查看网络请求

### 2. 订单数据丢失

**问题**：重启后数据消失

**解决方案**：
- 确保已配置 **Volume** 持久化存储
- Mount Path 必须是 `/app/backend/data`
- 检查 Zeabur 控制台的存储配置

### 3. WebSocket 连接失败

**问题**：实时订单同步不工作

**解决方案**：
- Zeabur 默认支持 WebSocket，无需额外配置
- 检查后端日志是否有 Socket.IO 错误
- 确认前端 API URL 使用 `https://` 而不是 `http://`

### 4. 支付页面钱包连接失败

**问题**：点击连接钱包没有反应

**解决方案**：
- 检查 `VITE_WALLETCONNECT_PROJECT_ID` 是否正确
- 检查 `VITE_MONAD_RPC_URL` 是否可访问
- 在浏览器控制台查看错误信息

### 5. 语音播报不工作

**问题**：收款后没有语音提示

**解决方案**：
- 确保浏览器允许自动播放音频
- 在 Chrome 中，进入 `chrome://settings/content/sound`
- 将商家桌面端域名添加到允许列表

---

## 🔄 自动部署（CI/CD）

Zeabur 支持 GitHub 自动部署：

1. 每次推送代码到 GitHub
2. Zeabur 会自动检测更改
3. 自动构建和部署更新的服务

**配置分支部署**：
1. 在服务设置中找到 **"Git Branch"**
2. 选择要监听的分支（默认：`main`）
3. 保存配置

---

## 💰 费用说明

### 免费额度

- **每月 $5 USD** 的免费额度
- 通常足够小型项目使用

### 估算使用量

对于本项目（4个服务）：
- 后端服务：~$2-3/月
- 3个前端服务：~$1-2/月
- 持久化存储（1GB）：~$0.5/月

**总计**：约 $3.5-5.5/月（可能超出免费额度）

### 节省费用的方法

1. **前端部署到 Vercel**（免费）
   - 将 3 个前端部署到 Vercel
   - 只在 Zeabur 部署后端
   - 成本降至 ~$2-3/月

2. **使用自定义域名**
   - Zeabur 生成的域名不收费
   - 自定义域名也不额外收费

---

## 📊 监控和日志

### 查看服务日志

1. 进入服务页面
2. 点击 **"Logs"**（日志）
3. 实时查看服务输出

### 监控资源使用

1. 在项目页面查看 **"Usage"**（使用量）
2. 监控 CPU、内存、网络使用情况
3. 及时发现性能问题

---

## 🎉 部署完成！

恭喜！您的 Web3 离线购物系统已成功部署到 Zeabur。

### 下一步

1. ✅ 配置自定义域名（可选）
2. ✅ 设置监控告警
3. ✅ 备份重要数据
4. ✅ 测试完整业务流程
5. ✅ 向用户推广您的应用

### 需要帮助？

- 📖 [Zeabur 官方文档](https://zeabur.com/docs)
- 💬 [Zeabur Discord 社区](https://discord.gg/zeabur)
- 📧 [技术支持](support@zeabur.com)

---

**祝您使用愉快！🚀**
