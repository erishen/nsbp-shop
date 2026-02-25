#!/bin/bash
set -e

echo "Building Docker image..."

# Get the directory where this script is located
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Extract project name from directory name
PROJECT_NAME=$(basename "$PROJECT_DIR" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]//g')

# Use project name as image name
IMAGE_NAME="${IMAGE_NAME:-${PROJECT_NAME}:latest}"

# Enable BuildKit for better performance
export DOCKER_BUILDKIT=1

echo "Project: $PROJECT_NAME"
echo "Image: $IMAGE_NAME"

# Build the image
docker build --network=host -t "$IMAGE_NAME" .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo "Image: $IMAGE_NAME"
else
    echo "❌ Docker build failed!"
    exit 1
fi
