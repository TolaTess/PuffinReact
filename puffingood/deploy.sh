#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build

# Build backend
echo "📦 Building backend..."
cd ../backend
npm install

# Create deployment directory
echo "📁 Creating deployment directory..."
cd ..
mkdir -p deploy
cp -r frontend/dist deploy/frontend
cp -r backend/* deploy/backend
cp package.json deploy/
cp .env.production deploy/frontend/.env
cp backend/.env.production deploy/backend/.env

echo "✅ Deployment files ready in ./deploy"
echo "📝 Next steps:"
echo "1. Set up your production environment variables"
echo "2. Deploy the backend to your server"
echo "3. Deploy the frontend to your hosting service"
echo "4. Set up SSL certificates"
echo "5. Configure your domain DNS" 