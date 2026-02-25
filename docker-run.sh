#!/bin/bash
set -e

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 加载环境变量
load_env_file() {
    local env_file="$1"
    if [[ -f "$env_file" ]]; then
        echo -e "${GREEN}✅ 加载环境变量: $env_file${NC}"
        while IFS='=' read -r key value || [[ -n "$key" ]]; do
            [[ $key =~ ^#.*$ ]] && continue
            [[ -z $key ]] && continue
            value="${value%\"}"
            value="${value#\"}"
            value="${value%\'}"
            value="${value#\'}"
            key="${key# }"
            key="${key% }"
            value="${value# }"
            value="${value% }"
            if [[ -n $key && -n $value ]]; then
                export "$key=$value"
            fi
        done < "$env_file"
    fi
}

# 获取项目目录
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME=$(basename "$PROJECT_DIR" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]//g')

CONTAINER_NAME="${CONTAINER_NAME:-$PROJECT_NAME}"
IMAGE_NAME="${IMAGE_NAME:-${PROJECT_NAME}:latest}"

echo "Project: $PROJECT_NAME"
echo "Container: $CONTAINER_NAME"
echo "Image: $IMAGE_NAME"
echo ""
echo "Stopping existing container..."
docker stop "$CONTAINER_NAME" 2>/dev/null || true
docker rm "$CONTAINER_NAME" 2>/dev/null || true

# 加载环境变量文件
load_env_file ".env.production"

echo "Starting container..."

# 构建 docker run 命令
DOCKER_CMD=("docker" "run" "-d")
DOCKER_CMD+=("--name" "$CONTAINER_NAME")
DOCKER_CMD+=("-p" "3001:3001")
DOCKER_CMD+=("-e" "PORT=3001")

# 添加环境变量
if [[ -f ".env.production" ]]; then
    while IFS='=' read -r line || [[ -n "$line" ]]; do
        [[ $line =~ ^#.*$ ]] && continue
        [[ -z $line ]] && continue
        key="${line%%=*}"
        key="${key# }"
        key="${key% }"
        [[ -z $key ]] && continue
        if [[ -n "${!key}" ]]; then
            DOCKER_CMD+=("-e" "$key=${!key}")
        fi
    done < ".env.production"
fi

DOCKER_CMD+=("$IMAGE_NAME")

# 执行
"${DOCKER_CMD[@]}"

echo ""
echo -e "${GREEN}✅ Container started successfully!${NC}"
echo "Access at: http://localhost:3001"
echo ""
echo "Useful commands:"
echo "  View logs:    docker logs -f $CONTAINER_NAME"
echo "  Stop:         docker stop $CONTAINER_NAME"
echo "  Shell access: docker exec -it $CONTAINER_NAME sh"
