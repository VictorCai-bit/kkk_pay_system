# Zeabur 部署故障排除指南

## 🔴 错误："/backend": not found

### 错误信息
```
ERROR: failed to calculate checksum of ref xpvjvotcqjis2o7i93tgip966::rr805tbel0gsgiwpoi8ym13j7: "/backend": not found
```

---

## 🎯 解决方案

### 方案 1: 修改 Root Directory 配置（最简单）⭐️

#### 步骤 1: 进入服务设置
1. 登录 Zeabur: https://zeabur.com
2. 进入您的项目
3. 点击**后端服务**

#### 步骤 2: 修改构建配置
1. 点击服务页面右上角的 **"Settings"**（设置）图标 ⚙️
2. 或者在左侧菜单找到 **"Build Settings"**（构建设置）

#### 步骤 3: 修正 Root Directory
找到 **"Root Directory"** 或 **"Source Directory"** 选项：

❌ **错误的配置**:
```
/backend
```

✅ **正确的配置**:
```
backend
```

**重要提示**：
- ✅ 使用 `backend`（相对路径，无前导斜杠）
- ❌ 不要使用 `/backend`（绝对路径）
- ❌ 不要使用 `./backend`（虽然可能有效，但不推荐）

#### 步骤 4: 保存并重新部署
1. 点击 **"Save"**（保存）
2. 点击 **"Redeploy"**（重新部署）
3. 查看构建日志

---

### 方案 2: 使用 Zeabur 界面选择目录

如果 Zeabur 提供了目录选择器（UI）：

#### 步骤 1: 删除当前服务
1. 进入后端服务
2. 点击 **"Settings"** → **"Delete Service"**
3. 确认删除

#### 步骤 2: 重新添加服务
1. 在项目页面点击 **"Add Service"**
2. 选择 **"GitHub"**
3. 选择仓库：`linshaolie/kkk_pay_system`

#### 步骤 3: 选择目录（关键）
当 Zeabur 扫描仓库后：
- **如果显示目录列表**：直接点击 `backend` 目录
- **如果需要手动输入**：输入 `backend`（不带斜杠）

#### 步骤 4: 配置环境变量
参考下面的"环境变量配置"部分

---

### 方案 3: 检查 GitHub 仓库（确认结构正确）

#### 验证仓库结构
访问您的 GitHub 仓库：https://github.com/linshaolie/kkk_pay_system

确认目录结构如下：
```
kkk_pay_system/
├── backend/              ← 应该在这里
│   ├── package.json
│   ├── src/
│   └── zeabur.json
├── frontend/
│   ├── merchant-mobile/
│   ├── merchant-desktop/
│   └── user-payment/
├── contracts/
└── docs/
```

如果 `backend/` 目录在根目录下，则配置应该是 `backend`。

---

## 🔧 后端环境变量配置

部署成功后，配置以下环境变量：

### 必需变量

```bash
# Node.js 环境
NODE_ENV=production
PORT=3000

# JWT 密钥（请替换为随机字符串）
JWT_SECRET=your-super-secret-jwt-key-change-me

# Monad 区块链配置
MONAD_RPC_URL=https://your-monad-rpc-url
CONTRACT_ADDRESS=0xYourContractAddress

# CORS 配置（部署前端后填写）
CORS_ORIGINS=https://merchant-mobile-xxx.zeabur.app,https://merchant-desktop-xxx.zeabur.app,https://payment-xxx.zeabur.app

# 支付页面 URL（部署前端后填写）
PAYMENT_URL=https://payment-xxx.zeabur.app/pay
```

### 可选变量

```bash
# HTTPS 配置（Zeabur 自动提供 HTTPS，无需配置）
USE_HTTPS=false
```

---

## 📦 持久化存储配置（重要！）

### 步骤 1: 添加 Volume
1. 在后端服务页面，找到 **"Volumes"** 或 **"Storage"** 标签
2. 点击 **"Add Volume"** 或 **"Create Volume"**

### 步骤 2: 配置存储路径
```
Mount Path: /app/backend/data
Size: 1 GB
```

⚠️ **警告**：不配置 Volume 会导致数据在服务重启后丢失！

---

## 🔍 部署检查清单

### 部署前检查
- [ ] Root Directory 设置为 `backend`（无前导斜杠）
- [ ] GitHub 仓库中 `backend/` 目录存在
- [ ] `backend/package.json` 文件存在
- [ ] `backend/zeabur.json` 文件存在

### 部署中检查
- [ ] 构建日志没有 "not found" 错误
- [ ] npm install 成功
- [ ] 服务状态显示 "Running"

### 部署后检查
- [ ] 环境变量已全部配置
- [ ] Volume 已添加并挂载
- [ ] 服务可以访问（健康检查）
- [ ] 生成域名成功

---

## 🐛 其他常见错误

### 错误 1: "Cannot find module"
**原因**：依赖安装失败

**解决**：
1. 检查 `backend/package.json` 是否存在
2. 查看构建日志中的 npm install 输出
3. 确认网络连接正常

### 错误 2: "Port already in use"
**原因**：PORT 环境变量冲突

**解决**：
1. 删除 PORT 环境变量（Zeabur 会自动分配）
2. 或确保 PORT=3000 与代码一致

### 错误 3: "ENOENT: no such file or directory"
**原因**：文件路径错误

**解决**：
1. 检查代码中的相对路径
2. 确认 Volume 挂载路径正确
3. 查看日志定位具体文件

---

## 📝 Zeabur 部署完整流程

### 1. 添加后端服务
```
Project → Add Service → GitHub → Select Repo
```

### 2. 配置构建
```
Root Directory: backend
Auto-detect: Node.js
```

### 3. 等待构建
```
Building... → npm install → npm start
```

### 4. 配置环境变量
```
Variables → Add all required env vars
```

### 5. 添加存储卷
```
Volumes → Create → Mount Path: /app/backend/data
```

### 6. 生成域名
```
Domains → Generate Domain → Copy URL
```

### 7. 测试健康检查
```bash
curl https://backend-xxx.zeabur.app/health
```

---

## 🆘 仍然失败？

### 查看构建日志
1. 进入后端服务
2. 点击 **"Logs"** 或 **"Build Logs"**
3. 找到错误的具体行
4. 将完整日志发给我

### 提供以下信息
- [ ] 完整的错误日志
- [ ] Root Directory 配置截图
- [ ] GitHub 仓库链接
- [ ] Zeabur 项目 URL

---

## ✅ 成功标志

部署成功后，您应该看到：

### 构建日志
```
✓ Installing dependencies...
✓ Starting application...
✓ Service is running on port 3000
```

### 服务状态
```
Status: Running
Health: Healthy
```

### 测试 API
```bash
curl https://backend-xxx.zeabur.app/health
# 返回: {"status":"ok","timestamp":"..."}
```

---

请按照**方案 1**修改 Root Directory 配置后重试。如果还有问题，把完整的错误日志发给我！💪
