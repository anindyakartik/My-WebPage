#!/bin/bash

# Deployment Helper Script
# This script helps you deploy your portfolio to various platforms

echo "╔════════════════════════════════════════════════════╗"
echo "║                                                    ║"
echo "║        Portfolio Deployment Helper                ║"
echo "║                                                    ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo -e "${YELLOW}Please create .env file first. See .env.example${NC}"
    exit 1
fi

echo -e "${GREEN}✅ .env file found${NC}"
echo ""

# Menu
echo "Choose deployment platform:"
echo ""
echo "1) Vercel (Recommended - Easiest)"
echo "2) Railway"
echo "3) DigitalOcean/VPS"
echo "4) Heroku"
echo "5) Test locally first"
echo "6) Exit"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}Deploying to Vercel...${NC}"
        echo ""
        
        # Check if vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
            npm install -g vercel
        fi
        
        echo -e "${GREEN}✅ Vercel CLI ready${NC}"
        echo ""
        echo "Steps to deploy:"
        echo "1. Run: vercel login"
        echo "2. Run: vercel"
        echo "3. Follow the prompts"
        echo "4. Set environment variables in Vercel dashboard"
        echo ""
        echo "Environment variables needed:"
        echo "  - MONGODB_URI"
        echo "  - ADMIN_USERNAME"
        echo "  - ADMIN_PASSWORD"
        echo "  - JWT_SECRET"
        echo "  - SESSION_SECRET"
        echo "  - EMAIL_USER"
        echo "  - EMAIL_PASS"
        echo ""
        read -p "Ready to deploy? (y/n): " ready
        
        if [ "$ready" = "y" ]; then
            vercel
        fi
        ;;
        
    2)
        echo ""
        echo -e "${BLUE}Deploying to Railway...${NC}"
        echo ""
        echo "Steps to deploy:"
        echo "1. Go to https://railway.app"
        echo "2. Sign up with GitHub"
        echo "3. Create new project from GitHub repo"
        echo "4. Add environment variables"
        echo "5. Deploy!"
        echo ""
        echo "See DEPLOYMENT_GUIDE.md for detailed instructions"
        ;;
        
    3)
        echo ""
        echo -e "${BLUE}Deploying to DigitalOcean/VPS...${NC}"
        echo ""
        echo "This requires manual setup. Steps:"
        echo "1. Create a droplet/VPS"
        echo "2. SSH into server"
        echo "3. Install Node.js, MongoDB, Nginx"
        echo "4. Clone repository"
        echo "5. Setup PM2"
        echo "6. Configure Nginx"
        echo "7. Setup SSL with Certbot"
        echo ""
        echo "See DEPLOYMENT_GUIDE.md for detailed instructions"
        ;;
        
    4)
        echo ""
        echo -e "${BLUE}Deploying to Heroku...${NC}"
        echo ""
        
        # Check if heroku CLI is installed
        if ! command -v heroku &> /dev/null; then
            echo -e "${YELLOW}Heroku CLI not found.${NC}"
            echo "Install from: https://devcenter.heroku.com/articles/heroku-cli"
            exit 1
        fi
        
        echo "Steps to deploy:"
        echo "1. Run: heroku login"
        echo "2. Run: heroku create your-app-name"
        echo "3. Run: git push heroku main"
        echo "4. Set environment variables with: heroku config:set KEY=VALUE"
        echo ""
        read -p "Ready to create Heroku app? (y/n): " ready
        
        if [ "$ready" = "y" ]; then
            heroku login
            read -p "Enter app name: " appname
            heroku create $appname
            echo ""
            echo "Now set your environment variables:"
            echo "heroku config:set MONGODB_URI=your-mongodb-uri"
            echo "heroku config:set ADMIN_USERNAME=admin"
            echo "heroku config:set ADMIN_PASSWORD=your-password"
            echo "# ... etc"
            echo ""
            echo "Then deploy with: git push heroku main"
        fi
        ;;
        
    5)
        echo ""
        echo -e "${BLUE}Testing locally...${NC}"
        echo ""
        
        # Check if MongoDB is running
        if ! pgrep -x "mongod" > /dev/null; then
            echo -e "${RED}❌ MongoDB is not running${NC}"
            echo -e "${YELLOW}Start MongoDB first with: mongod${NC}"
            exit 1
        fi
        
        echo -e "${GREEN}✅ MongoDB is running${NC}"
        echo ""
        
        # Install dependencies
        echo "Installing dependencies..."
        npm install
        
        echo ""
        echo "Starting server..."
        npm start
        ;;
        
    6)
        echo ""
        echo "Goodbye!"
        exit 0
        ;;
        
    *)
        echo ""
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Done!${NC}"
echo ""
echo "For detailed deployment instructions, see:"
echo "  📖 DEPLOYMENT_GUIDE.md"
echo ""
