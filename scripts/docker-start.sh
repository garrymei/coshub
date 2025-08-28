#!/bin/bash

# Coshub 基础设施启动脚本

set -e

DOCKER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../infra/docker" && pwd)"
ENV_FILE="$DOCKER_DIR/.env"

echo "🐳 Coshub 基础设施启动脚本"
echo "=============================="

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose 未安装，请先安装 docker-compose"
    exit 1
fi

# 进入 Docker 目录
cd "$DOCKER_DIR"

# 检查环境文件
if [ ! -f "$ENV_FILE" ]; then
    echo "📝 创建环境配置文件..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件，请根据需要修改配置"
fi

# 解析命令行参数
ENVIRONMENT="prod"
DETACHED=true
RECREATE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --dev)
            ENVIRONMENT="dev"
            shift
            ;;
        --prod)
            ENVIRONMENT="prod"
            shift
            ;;
        --fg|--foreground)
            DETACHED=false
            shift
            ;;
        --recreate)
            RECREATE=true
            shift
            ;;
        -h|--help)
            echo "用法: $0 [选项]"
            echo ""
            echo "选项:"
            echo "  --dev          使用开发环境配置"
            echo "  --prod         使用生产环境配置（默认）"
            echo "  --fg           前台运行（显示日志）"
            echo "  --recreate     强制重新创建容器"
            echo "  -h, --help     显示帮助信息"
            exit 0
            ;;
        *)
            echo "未知选项: $1"
            echo "使用 -h 或 --help 查看帮助"
            exit 1
            ;;
    esac
done

# 构建 docker-compose 命令
COMPOSE_CMD="docker-compose -f docker-compose.yml"

if [ "$ENVIRONMENT" = "dev" ]; then
    COMPOSE_CMD="$COMPOSE_CMD -f docker-compose.dev.yml"
    echo "🔧 使用开发环境配置"
else
    echo "🏭 使用生产环境配置"
fi

# 添加额外参数
UP_ARGS=""
if [ "$DETACHED" = true ]; then
    UP_ARGS="$UP_ARGS -d"
fi

if [ "$RECREATE" = true ]; then
    UP_ARGS="$UP_ARGS --force-recreate"
fi

echo ""
echo "🚀 启动服务..."

# 启动服务
$COMPOSE_CMD up $UP_ARGS

if [ "$DETACHED" = true ]; then
    echo ""
    echo "✅ 服务启动完成！"
    echo ""
    echo "📊 服务状态:"
    $COMPOSE_CMD ps
    
    echo ""
    echo "🌐 管理界面:"
    echo "  MinIO Console:    http://localhost:9001"
    echo "  PgAdmin:          http://localhost:5050" 
    echo "  Redis Commander:  http://localhost:8081"
    
    echo ""
    echo "🔗 连接信息:"
    if [ "$ENVIRONMENT" = "dev" ]; then
        echo "  PostgreSQL: postgresql://coshub_user:dev123@localhost:5432/coshub"
        echo "  Redis:      redis://:dev123@localhost:6379"
        echo "  MinIO:      http://dev123:dev123456@localhost:9000"
    else
        echo "  PostgreSQL: postgresql://coshub_user:coshub_password@localhost:5432/coshub"
        echo "  Redis:      redis://:coshub_redis_password@localhost:6379"
        echo "  MinIO:      http://coshub_minio_user:coshub_minio_password@localhost:9000"
    fi
    
    echo ""
    echo "📝 有用的命令:"
    echo "  查看日志:   $COMPOSE_CMD logs -f [service_name]"
    echo "  停止服务:   $COMPOSE_CMD down"
    echo "  重启服务:   $COMPOSE_CMD restart [service_name]"
fi
