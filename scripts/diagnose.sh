#!/bin/bash

echo "🔍 KKK POS 后端诊断工具"
echo "================================"
echo ""

# 1. 检查端口占用
echo "1️⃣ 检查端口 3000 是否被占用..."
PORT_CHECK=$(lsof -i :3000 2>/dev/null)
if [ -n "$PORT_CHECK" ]; then
    echo "⚠️  端口 3000 已被占用："
    echo "$PORT_CHECK"
    echo ""
    echo "解决方案："
    echo "  lsof -i :3000    # 查看占用进程"
    echo "  kill -9 <PID>    # 杀掉进程"
else
    echo "✅ 端口 3000 可用"
fi
echo ""

# 2. 检查 Node 版本
echo "2️⃣ 检查 Node.js 版本..."
NODE_VERSION=$(node -v 2>/dev/null)
if [ -z "$NODE_VERSION" ]; then
    echo "❌ 未安装 Node.js"
else
    echo "✅ Node.js $NODE_VERSION"
fi
echo ""

# 3. 检查依赖
echo "3️⃣ 检查依赖安装..."
if [ -d "backend/node_modules" ]; then
    echo "✅ node_modules 存在"
else
    echo "❌ node_modules 不存在"
    echo "   运行: cd backend && npm install"
fi
echo ""

# 4. 检查配置文件
echo "4️⃣ 检查配置文件..."
if [ -f "backend/.env" ]; then
    echo "✅ .env 文件存在"
    echo "   内容预览:"
    head -5 backend/.env | sed 's/^/   /'
else
    echo "❌ .env 文件不存在"
    echo "   运行: cd backend && cp env.example .env"
fi
echo ""

# 5. 检查数据文件
echo "5️⃣ 检查数据文件..."
if [ -d "backend/data" ]; then
    echo "✅ data 目录存在"
    ls -la backend/data/ | tail -n +2 | sed 's/^/   /'
else
    echo "❌ data 目录不存在"
    echo "   运行: cd backend && npm run init"
fi
echo ""

# 6. 测试后端连接
echo "6️⃣ 测试后端连接..."
HEALTH_CHECK=$(curl -s http://localhost:3000/health 2>/dev/null)
if [ -n "$HEALTH_CHECK" ]; then
    echo "✅ 后端响应正常"
    echo "   $HEALTH_CHECK"
else
    echo "❌ 后端未响应"
    echo "   确保后端已启动: cd backend && npm run dev"
fi
echo ""

# 7. 获取本机 IP
echo "7️⃣ 本机 IP 地址..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    IP=$(ipconfig getifaddr en0 2>/dev/null)
    if [ -z "$IP" ]; then
        IP=$(ipconfig getifaddr en1 2>/dev/null)
    fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    IP=$(hostname -I | awk '{print $1}')
fi

if [ -n "$IP" ]; then
    echo "✅ IP: $IP"
    echo "   访问地址: http://$IP:3000"
else
    echo "⚠️  无法自动检测 IP"
fi
echo ""

echo "================================"
echo "📋 快速修复命令："
echo ""
echo "  # 重新安装依赖"
echo "  cd backend && rm -rf node_modules && npm install"
echo ""
echo "  # 初始化数据"
echo "  cd backend && npm run init"
echo ""
echo "  # 创建配置文件"
echo "  cd backend && cp env.example .env"
echo ""
echo "  # 启动后端"
echo "  cd backend && npm run dev"
echo ""
