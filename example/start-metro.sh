#!/bin/bash
cd "$(dirname "$0")"
pkill -f "metro.*8081" 2>/dev/null
sleep 1
node node_modules/metro/src/cli.js start --port 8081 --host localhost
