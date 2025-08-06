#!/bin/bash

# MTS Digital Services - Production Startup Script
echo "🚀 Starting MTS Digital Services in PRODUCTION mode..."

# Kill any existing development processes
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "tsx server" 2>/dev/null || true

# Build the application
echo "📦 Building application for production..."
npm run build

# Start production server
echo "🌟 Starting production server on port 5000..."
NODE_ENV=production node dist/index.js

echo "✅ Production server started successfully!"