# Vercel 部署指南

## 🎯 推荐方案

### 前端：Vercel
- 商家手机端
- 商家电脑端
- 用户支付端

### 后端：Railway (免费额度充足)
- Express API
- Socket.IO
- 区块链监听
- JSON 存储（或升级到数据库）

## 🚀 快速开始

### 1. 部署后端到 Railway

```bash
# 1. 访问 https://railway.app/
# 2. 注册/登录
# 3. New Project → Deploy from GitHub
# 4. 选择仓库
# 5. 配置环境变量（参考 backend/env.example）
# 6. 部署完成，获取 URL
```

### 2. 部署前端到 Vercel

```bash
# 安装 CLI
npm install -g vercel

# 登录
vercel login

# 使用部署脚本
chmod +x scripts/deploy-vercel.sh
./scripts/deploy-vercel.sh

# 按照提示输入后端 URL 和部署
```

## 📋 详细步骤

查看完整文档：
- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

## 💰 费用

### Vercel
- Hobby Plan: **免费**
- 100GB 带宽/月
- 无限项目

### Railway
- Starter Plan: **$5/月**
- 或 500 小时免费（约 20 天）
- 8GB RAM, 8GB 存储

## 🔗 相关链接

- Vercel: https://vercel.com/
- Railway: https://railway.app/
- Render: https://render.com/ (备选)
