#!/bin/bash

echo "🚀 Vercel 部署助手"
echo "================================"
echo ""

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ 未安装 Vercel CLI"
    echo ""
    echo "安装命令："
    echo "  npm install -g vercel"
    echo ""
    exit 1
fi

echo "✅ Vercel CLI 已安装"
echo ""

# 获取后端 URL
read -p "请输入后端 URL (例: https://your-backend.railway.app): " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo "❌ 后端 URL 不能为空"
    exit 1
fi

echo ""
echo "📝 生成配置文件..."

# 商家手机端
cat > frontend/merchant-mobile/.env.production << EOF
VITE_API_URL=${BACKEND_URL}/api
VITE_SOCKET_URL=${BACKEND_URL}
EOF
echo "✅ frontend/merchant-mobile/.env.production"

# 商家电脑端
cat > frontend/merchant-desktop/.env.production << EOF
VITE_API_URL=${BACKEND_URL}/api
VITE_SOCKET_URL=${BACKEND_URL}
VITE_PAYMENT_URL=https://kkk-pos-payment.vercel.app
EOF
echo "✅ frontend/merchant-desktop/.env.production"

# 用户支付端
cat > frontend/user-payment/.env.production << EOF
VITE_API_URL=${BACKEND_URL}/api
VITE_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
VITE_CONTRACT_ADDRESS=0xYourContractAddress
VITE_WALLET_CONNECT_PROJECT_ID=1fba176f84da8ad01ca69caa0074f292
EOF
echo "✅ frontend/user-payment/.env.production"

echo ""
echo "================================"
echo "📱 部署前端项目："
echo ""
echo "1. 商家手机端："
echo "   cd frontend/merchant-mobile"
echo "   vercel --prod"
echo ""
echo "2. 商家电脑端："
echo "   cd frontend/merchant-desktop"
echo "   vercel --prod"
echo ""
echo "3. 用户支付端："
echo "   cd frontend/user-payment"
echo "   vercel --prod"
echo ""
echo "================================"
echo "💡 提示："
echo ""
echo "- 首次部署会要求配置项目"
echo "- 选择项目名称和设置"
echo "- 等待部署完成"
echo "- 获取部署的 URL"
echo ""
echo "部署后更新 merchant-desktop 的 .env.production"
echo "将 VITE_PAYMENT_URL 改为实际的支付端 URL"
echo ""
