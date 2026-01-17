#!/bin/bash

echo "🇨🇳 国内平台部署助手"
echo "================================"
echo ""

echo "请选择部署平台："
echo ""
echo "1. Zeabur（推荐，$5 免费额度）"
echo "2. Laf（完全免费，需要改造）"
echo "3. 腾讯云开发（免费额度充足）"
echo "4. Sealos（按量付费）"
echo "5. Vercel + Railway（国际平台）"
echo ""

read -p "请输入选项 (1-5): " choice

case $choice in
  1)
    echo ""
    echo "📦 Zeabur 部署指南"
    echo "================================"
    echo ""
    echo "1. 访问 https://zeabur.com/"
    echo "2. 使用 GitHub 登录"
    echo "3. 创建新项目"
    echo "4. 选择 '从 Git 部署'"
    echo "5. 选择 kkk_pos 仓库"
    echo ""
    echo "环境变量配置："
    echo "PORT=3000"
    echo "NODE_ENV=production"
    echo "JWT_SECRET=your_secret_key"
    echo "MONAD_RPC_URL=https://testnet-rpc.monad.xyz"
    echo "CONTRACT_ADDRESS=0xYourAddress"
    echo ""
    echo "6. 部署完成后获取 URL"
    echo "7. 前端也可以部署到 Zeabur"
    echo ""
    echo "📚 详细文档：docs/DEPLOY_CHINA.md"
    ;;
    
  2)
    echo ""
    echo "🔥 Laf 部署指南"
    echo "================================"
    echo ""
    echo "1. 访问 https://laf.dev/"
    echo "2. 微信扫码登录"
    echo "3. 创建应用"
    echo ""
    echo "⚠️  注意：Laf 使用云函数架构"
    echo "需要改造当前的 Express 代码"
    echo ""
    echo "是否需要我帮您生成 Laf 版本的代码？"
    echo "完全免费，但需要一些改造工作"
    ;;
    
  3)
    echo ""
    echo "☁️  腾讯云开发部署指南"
    echo "================================"
    echo ""
    echo "1. 安装 CLI："
    echo "   npm install -g @cloudbase/cli"
    echo ""
    echo "2. 登录："
    echo "   tcb login"
    echo ""
    echo "3. 初始化："
    echo "   tcb init"
    echo ""
    echo "4. 部署："
    echo "   tcb deploy"
    echo ""
    echo "📚 需要实名认证"
    echo "📚 免费额度充足"
    ;;
    
  4)
    echo ""
    echo "🐳 Sealos 部署指南"
    echo "================================"
    echo ""
    echo "1. 访问 https://sealos.io/"
    echo "2. 注册账号"
    echo "3. 创建应用"
    echo "4. 选择 Docker 部署"
    echo ""
    echo "💰 费用：约 ¥30-50/月"
    echo "📚 支持 Docker 和 Kubernetes"
    ;;
    
  5)
    echo ""
    echo "🌍 国际平台部署"
    echo "================================"
    echo ""
    echo "前端部署到 Vercel："
    echo "  ./scripts/deploy-vercel.sh"
    echo ""
    echo "后端部署到 Railway："
    echo "  https://railway.app/"
    echo ""
    echo "⚠️  国内访问可能较慢"
    ;;
    
  *)
    echo "无效选项"
    exit 1
    ;;
esac

echo ""
echo "================================"
echo "📞 需要更多帮助？"
echo ""
echo "查看完整文档："
echo "  docs/DEPLOY_CHINA.md"
echo ""
echo "或告诉我您选择的平台，"
echo "我会提供详细的配置和部署步骤！"
echo ""
