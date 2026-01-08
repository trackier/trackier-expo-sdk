#!/bin/bash

# Script to ensure Metro bundler is running before building/running the app

PORT=8081
MAX_WAIT=30

echo "🔍 Checking if Metro bundler is running on port $PORT..."

# Check if Metro is already running
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Metro bundler is already running on port $PORT"
    exit 0
fi

echo "⚠️  Metro bundler is not running. Starting it now..."

# Change to example directory
cd "$(dirname "$0")"

# Start Metro bundler
nohup node node_modules/metro/src/cli.js start --port $PORT --host 0.0.0.0 > /tmp/metro.log 2>&1 &

# Wait for Metro to be ready
echo "⏳ Waiting for Metro bundler to start..."
for i in $(seq 1 $MAX_WAIT); do
    if curl -s http://localhost:$PORT/status >/dev/null 2>&1; then
        echo "✅ Metro bundler is ready!"
        exit 0
    fi
    sleep 1
    echo -n "."
done

echo ""
echo "❌ Metro bundler failed to start within $MAX_WAIT seconds"
echo "Check logs: tail -f /tmp/metro.log"
exit 1

