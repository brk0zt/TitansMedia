#!/bin/bash
# deploy.sh - Production deployment script for Apollo Automation Service
# Usage: ./deploy.sh [local|vps|oracle|gcp|fly]

set -e

DEPLOY_TARGET=${1:-local}

echo "🚀 Apollo Automation Service Deployment"
echo "Target: $DEPLOY_TARGET"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

check_env() {
    if [ ! -f .env.production ]; then
        echo -e "${RED}❌ .env.production not found!${NC}"
        echo "Copy .env.example to .env.production and fill in values"
        exit 1
    fi
    
    # Load env
    export $(grep -v '^#' .env.production | xargs)
    
    if [ -z "$COOKIE_ENCRYPTION_KEY" ] || [ "$COOKIE_ENCRYPTION_KEY" = "your-32-byte-base64-key-here" ]; then
        echo -e "${RED}❌ COOKIE_ENCRYPTION_KEY not set in .env.production${NC}"
        echo "Generate with: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""
        exit 1
    fi
    
    echo -e "${GREEN}✅ Environment validated${NC}"
}

deploy_local() {
    echo -e "${YELLOW}📦 Deploying locally with docker-compose...${NC}"
    
    # Build images
    docker-compose build --no-cache
    
    # Start services
    docker-compose up -d
    
    echo -e "${GREEN}✅ Local deployment complete${NC}"
    echo ""
    echo "Services:"
    echo "  - Automation API: http://localhost:3100"
    echo "  - Redis: localhost:6379"
    echo "  - Health cron: running in background"
    echo ""
    echo "Check logs: docker-compose logs -f"
}

deploy_vps() {
    local SERVER=$1
    local USER=${2:-root}
    
    if [ -z "$SERVER" ]; then
        echo -e "${RED}Usage: ./deploy.sh vps <server-ip> [user]${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}🚀 Deploying to VPS: $SERVER${NC}"
    
    # Create deployment package
    tar -czf deploy-package.tar.gz \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='logs' \
        --exclude='*.log' \
        --exclude='.git' \
        --exclude='.env*' \
        --exclude='deploy-package.tar.gz' \
        .
    
    # Copy to server
    echo "📤 Copying files to $SERVER..."
    scp deploy-package.tar.gz $USER@$SERVER:/tmp/
    scp .env.production $USER@$SERVER:/tmp/
    
    # Deploy on server
    ssh $USER@$SERVER << 'EOF'
        set -e
        cd /opt/apollo-automation 2>/dev/null || sudo mkdir -p /opt/apollo-automation && cd /opt/apollo-automation
        sudo tar -xzf /tmp/deploy-package.tar.gz
        sudo mv /tmp/.env.production .env.production
        
        # Install Docker if not present
        if ! command -v docker &> /dev/null; then
            curl -fsSL https://get.docker.com | sh
        fi
        
        if ! command -v docker-compose &> /dev/null; then
            sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            sudo chmod +x /usr/local/bin/docker-compose
        fi
        
        # Deploy
        docker-compose down 2>/dev/null || true
        docker-compose build --no-cache
        docker-compose up -d
        
        # Cleanup
        rm /tmp/deploy-package.tar.gz /tmp/.env.production
        
        echo "✅ VPS deployment complete"
EOF
}

deploy_oracle() {
    echo -e "${YELLOW}☁️  Oracle Cloud Free Tier Deployment${NC}"
    echo ""
    echo "Prerequisites:"
    echo "  1. Oracle Cloud account with Free Tier"
    echo "  2. SSH key pair generated"
    echo "  3. Compartment created"
    echo ""
    echo "Steps:"
    echo "  1. Create VM instance: VM.Standard.A1.Flex (4 OCPU, 24GB RAM)"
    echo "  2. Image: Canonical Ubuntu 22.04"
    echo "  3. SSH keys: Add your public key"
    echo "  4. VCN: Default with public subnet"
    echo "  5. Run: ./deploy.sh vps <public-ip> ubuntu"
    echo ""
    echo "After VM is ready:"
    echo "  ./deploy.sh vps <public-ip> ubuntu"
    echo ""
    echo "Open ports in Oracle Security Lists:"
    echo "  - 3100 (Automation API)"
    echo "  - 6379 (Redis - restrict to VCN only)"
}

deploy_fly() {
    echo -e "${YELLOW}🪰 Fly.io Deployment${NC}"
    echo ""
    echo "Prerequisites:"
    echo "  1. Fly.io account: fly.io"
    echo "  2. flyctl installed: curl -L https://fly.io/install.sh | sh"
    echo "  3. fly auth login"
    echo ""
    echo "Deploy:"
    echo "  fly launch --name apollo-automation --dockerfile Dockerfile"
    echo "  fly secrets set COOKIE_ENCRYPTION_KEY=<your-key>"
    echo "  fly secrets set PROXY_LIST=your-proxy-list"
    echo "  fly deploy"
    echo ""
    echo "Add Redis:"
    echo "  fly redis create"
    echo "  fly redis attach <redis-app>"
}

deploy_gcp() {
    echo -e "${YELLOW}☁️  Google Cloud Run Deployment${NC}"
    echo ""
    echo "Note: Cloud Run is stateless. For browser automation, use Cloud Run with"
    echo "Cloud Scheduler + Cloud Tasks, or deploy to Compute Engine instead."
    echo ""
    echo "Alternative: Deploy to Cloud Run Jobs for scheduled health checks"
    echo "  gcloud run jobs create cookie-health-check --image gcr.io/PROJECT/automation"
    echo "  gcloud scheduler jobs create http health-check --schedule='*/30 * * * *' --uri=..."
}

show_help() {
    echo "Apollo Automation Service - Deployment Script"
    echo ""
    echo "Usage: ./deploy.sh [command] [args]"
    echo ""
    echo "Commands:"
    echo "  local              Deploy locally with docker-compose"
    echo "  vps <ip> [user]    Deploy to VPS via SSH"
    echo "  oracle             Oracle Cloud Free Tier setup guide"
    echo "  fly                Fly.io deployment guide"
    echo "  gcp                Google Cloud Run guide"
    echo "  help               Show this help"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh local"
    echo "  ./deploy.sh vps 192.168.1.100 ubuntu"
    echo "  ./deploy.sh oracle"
}

# Main
case $DEPLOY_TARGET in
    local)
        check_env
        deploy_local
        ;;
    vps)
        check_env
        deploy_vps $2 $3
        ;;
    oracle)
        deploy_oracle
        ;;
    fly)
        deploy_fly
        ;;
    gcp)
        deploy_gcp
        ;;
    help|*)
        show_help
        ;;
esac