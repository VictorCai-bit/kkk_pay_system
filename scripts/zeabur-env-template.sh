#!/bin/bash

# Zeabur 环境变量配置模板生成脚本
# 用于快速生成各个服务所需的环境变量配置

set -e

echo "🚀 Zeabur 环境变量配置生成器"
echo "=============================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 询问用户输入
echo -e "${BLUE}请输入以下信息（部署后需要的信息可以先跳过）：${NC}"
echo ""

# JWT Secret
echo -e "${YELLOW}1. JWT Secret (用于身份验证，建议使用随机字符串)${NC}"
read -p "   JWT_SECRET [留空自动生成]: " JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
    echo -e "   ${GREEN}✓ 已自动生成: $JWT_SECRET${NC}"
fi
echo ""

# Monad RPC URL
echo -e "${YELLOW}2. Monad RPC URL${NC}"
read -p "   MONAD_RPC_URL: " MONAD_RPC_URL
echo ""

# Contract Address
echo -e "${YELLOW}3. 支付合约地址${NC}"
read -p "   CONTRACT_ADDRESS: " CONTRACT_ADDRESS
echo ""

# WalletConnect Project ID
echo -e "${YELLOW}4. WalletConnect Project ID${NC}"
echo "   (如果还没有，访问 https://cloud.walletconnect.com/ 创建)"
read -p "   WALLETCONNECT_PROJECT_ID: " WALLETCONNECT_PROJECT_ID
echo ""

# Backend Domain (部署后填写)
echo -e "${YELLOW}5. 后端域名（部署后端后获得，现在可以留空）${NC}"
read -p "   BACKEND_DOMAIN [例: backend-xxx.zeabur.app]: " BACKEND_DOMAIN
echo ""

# Frontend Domains (部署后填写)
echo -e "${YELLOW}6. 前端域名（部署前端后获得，现在可以留空）${NC}"
read -p "   MERCHANT_MOBILE_DOMAIN [例: merchant-mobile-xxx.zeabur.app]: " MERCHANT_MOBILE_DOMAIN
read -p "   MERCHANT_DESKTOP_DOMAIN [例: merchant-desktop-xxx.zeabur.app]: " MERCHANT_DESKTOP_DOMAIN
read -p "   PAYMENT_DOMAIN [例: payment-xxx.zeabur.app]: " PAYMENT_DOMAIN
echo ""

# 生成配置文件
OUTPUT_FILE="zeabur-env-config.txt"

echo "📝 正在生成配置文件..."
echo ""

cat > "$OUTPUT_FILE" << EOF
# ============================================
# Zeabur 环境变量配置
# 生成时间: $(date)
# ============================================

# ===========================
# 1️⃣ 后端服务 (Backend)
# ===========================

NODE_ENV=production
PORT=3000

# JWT 密钥
JWT_SECRET=$JWT_SECRET

# CORS 允许的域名（部署前端后更新）
EOF

if [ -n "$MERCHANT_MOBILE_DOMAIN" ] && [ -n "$MERCHANT_DESKTOP_DOMAIN" ] && [ -n "$PAYMENT_DOMAIN" ]; then
    echo "CORS_ORIGINS=https://$MERCHANT_MOBILE_DOMAIN,https://$MERCHANT_DESKTOP_DOMAIN,https://$PAYMENT_DOMAIN" >> "$OUTPUT_FILE"
else
    echo "CORS_ORIGINS=  # 部署前端后填写，格式: https://domain1,https://domain2" >> "$OUTPUT_FILE"
fi

cat >> "$OUTPUT_FILE" << EOF

# Monad 区块链配置
EOF

if [ -n "$MONAD_RPC_URL" ]; then
    echo "MONAD_RPC_URL=$MONAD_RPC_URL" >> "$OUTPUT_FILE"
else
    echo "MONAD_RPC_URL=  # 填写 Monad RPC 节点地址" >> "$OUTPUT_FILE"
fi

if [ -n "$CONTRACT_ADDRESS" ]; then
    echo "CONTRACT_ADDRESS=$CONTRACT_ADDRESS" >> "$OUTPUT_FILE"
else
    echo "CONTRACT_ADDRESS=  # 填写支付合约地址" >> "$OUTPUT_FILE"
fi

cat >> "$OUTPUT_FILE" << EOF

# 支付页面 URL（部署前端后更新）
EOF

if [ -n "$PAYMENT_DOMAIN" ]; then
    echo "PAYMENT_URL=https://$PAYMENT_DOMAIN/pay" >> "$OUTPUT_FILE"
else
    echo "PAYMENT_URL=  # 部署前端后填写，格式: https://payment-xxx.zeabur.app/pay" >> "$OUTPUT_FILE"
fi

cat >> "$OUTPUT_FILE" << EOF


# ===========================
# 2️⃣ 商家移动端 (Merchant Mobile)
# ===========================

EOF

if [ -n "$BACKEND_DOMAIN" ]; then
    echo "VITE_API_BASE_URL=https://$BACKEND_DOMAIN" >> "$OUTPUT_FILE"
else
    echo "VITE_API_BASE_URL=  # 部署后端后填写，格式: https://backend-xxx.zeabur.app" >> "$OUTPUT_FILE"
fi

cat >> "$OUTPUT_FILE" << EOF


# ===========================
# 3️⃣ 商家桌面端 (Merchant Desktop)
# ===========================

EOF

if [ -n "$BACKEND_DOMAIN" ]; then
    echo "VITE_API_BASE_URL=https://$BACKEND_DOMAIN" >> "$OUTPUT_FILE"
else
    echo "VITE_API_BASE_URL=  # 部署后端后填写，格式: https://backend-xxx.zeabur.app" >> "$OUTPUT_FILE"
fi

cat >> "$OUTPUT_FILE" << EOF


# ===========================
# 4️⃣ 用户支付页 (User Payment)
# ===========================

EOF

if [ -n "$BACKEND_DOMAIN" ]; then
    echo "VITE_API_BASE_URL=https://$BACKEND_DOMAIN" >> "$OUTPUT_FILE"
else
    echo "VITE_API_BASE_URL=  # 部署后端后填写，格式: https://backend-xxx.zeabur.app" >> "$OUTPUT_FILE"
fi

if [ -n "$WALLETCONNECT_PROJECT_ID" ]; then
    echo "VITE_WALLETCONNECT_PROJECT_ID=$WALLETCONNECT_PROJECT_ID" >> "$OUTPUT_FILE"
else
    echo "VITE_WALLETCONNECT_PROJECT_ID=  # 填写 WalletConnect Project ID" >> "$OUTPUT_FILE"
fi

if [ -n "$MONAD_RPC_URL" ]; then
    echo "VITE_MONAD_RPC_URL=$MONAD_RPC_URL" >> "$OUTPUT_FILE"
else
    echo "VITE_MONAD_RPC_URL=  # 填写 Monad RPC 节点地址" >> "$OUTPUT_FILE"
fi

if [ -n "$CONTRACT_ADDRESS" ]; then
    echo "VITE_CONTRACT_ADDRESS=$CONTRACT_ADDRESS" >> "$OUTPUT_FILE"
else
    echo "VITE_CONTRACT_ADDRESS=  # 填写支付合约地址" >> "$OUTPUT_FILE"
fi

cat >> "$OUTPUT_FILE" << EOF


# ============================================
# 📋 使用说明
# ============================================
#
# 1. 部署后端服务：
#    - 在 Zeabur 后端服务的环境变量页面
#    - 复制 "后端服务" 部分的所有变量
#    - 粘贴并保存
#
# 2. 配置持久化存储：
#    - 在后端服务添加 Volume
#    - Mount Path: /app/backend/data
#    - Size: 1 GB
#
# 3. 部署三个前端服务：
#    - 分别为每个前端服务配置对应的环境变量
#
# 4. 获取域名后更新：
#    - 回到后端服务
#    - 更新 CORS_ORIGINS 和 PAYMENT_URL
#    - 服务会自动重启
#
# 5. 测试部署：
#    - 访问商家移动端注册账号
#    - 添加测试商品
#    - 完整测试支付流程
#
# ============================================

EOF

echo -e "${GREEN}✅ 配置文件已生成: $OUTPUT_FILE${NC}"
echo ""
echo -e "${BLUE}📋 接下来的步骤：${NC}"
echo ""
echo "1. 查看生成的配置文件："
echo -e "   ${YELLOW}cat $OUTPUT_FILE${NC}"
echo ""
echo "2. 在 Zeabur 控制台中："
echo "   - 创建新项目"
echo "   - 添加服务（从 GitHub 导入）"
echo "   - 复制对应服务的环境变量"
echo "   - 配置后端的持久化存储 Volume"
echo ""
echo "3. 部署完成后："
echo "   - 获取各服务的域名"
echo "   - 更新后端的 CORS_ORIGINS 和 PAYMENT_URL"
echo ""
echo -e "${BLUE}📖 详细文档：docs/ZEABUR_DEPLOY.md${NC}"
echo ""
