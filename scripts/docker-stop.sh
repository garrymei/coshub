#!/bin/bash

# Coshub 基础设施停止脚本

set -e

DOCKER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../infra/docker" && pwd)"

echo "🛑 Coshub 基础设施停止脚本"
echo "=============================="

# 进入 Docker 目录
cd "$DOCKER_DIR"

# 解析命令行参数
REMOVE_VOLUMES=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --volumes)
            REMOVE_VOLUMES=true
            shift
            ;;
        -h|--help)
            echo "用法: $0 [选项]"
            echo ""
            echo "选项:"
            echo "  --volumes      同时删除数据卷（警告：会丢失所有数据）"
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

echo "🚀 停止服务..."

if [ "$REMOVE_VOLUMES" = true ]; then
    echo "⚠️  警告：即将删除所有数据卷，这将永久删除所有数据！"
    echo "是否继续？(输入 'yes' 确认)"
    read -r confirmation
    
    if [ "$confirmation" = "yes" ]; then
        docker-compose down -v
        echo "✅ 服务已停止，数据卷已删除"
    else
        echo "❌ 操作已取消"
        exit 1
    fi
else
    docker-compose down
    echo "✅ 服务已停止（数据卷保留）"
fi

echo ""
echo "📝 有用的命令:"
echo "  重新启动:   ./scripts/docker-start.sh"
echo "  查看状态:   docker-compose ps"
echo "  清理系统:   docker system prune"
