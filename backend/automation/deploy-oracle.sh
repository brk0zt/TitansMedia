#!/bin/bash
# oracle-cloud-deploy.sh - Deploy Apollo Automation Service to Oracle Cloud Free Tier
# Requires: oci CLI configured with valid credentials

set -e

echo "🚀 Apollo Automation Service - Oracle Cloud Free Tier Deployment"
echo "================================================================"

# Check OCI CLI config
if [ ! -f ~/.oci/config ]; then
    echo "❌ OCI CLI not configured. Run 'oci setup config' first."
    echo "   You'll need:"
    echo "   - Tenancy OCID"
    echo "   - User OCID"
    echo "   - Fingerprint (from API key)"
    echo "   - Private key file path"
    echo "   - Region (e.g., us-ashburn-1, eu-frankfurt-1, uk-london-1)"
    exit 1
fi

# Verify OCI CLI works
oci iam compartment list --compartment-id-in-subtree true > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ OCI CLI authentication failed. Check your config."
    exit 1
fi

echo "✅ OCI CLI configured and authenticated"

# Get compartment OCID
COMPARTMENT_ID=$(oci iam compartment list --all --lifecycle-state ACTIVE --query "data[0].id" --raw-output)
echo "📦 Using compartment: $COMPARTMENT_ID"

# Check if SSH key exists
if [ ! -f ~/.ssh/id_rsa.pub ]; then
    echo "🔑 Generating SSH key..."
    ssh-keygen -t rsa -b 2048 -f ~/.ssh/id_rsa -N ""
fi

SSH_KEY=$(cat ~/.ssh/id_rsa.pub)
echo "🔑 Using SSH key: ${SSH_KEY:0:50}..."

# Create or get VCN
echo "🌐 Setting up networking..."
VCN_ID=$(oci network vcn create \
    --compartment-id $COMPARTMENT_ID \
    --cidr-block "10.0.0.0/16" \
    --display-name "apollo-vcn" \
    --dns-label "apollovcn" \
    --query "data.id" --raw-output 2>/dev/null || \
    oci network vcn list --compartment-id $COMPARTMENT_ID --display-name "apollo-vcn" --query "data[0].id" --raw-output)

echo "🌐 VCN: $VCN_ID"

# Create Internet Gateway
IG_ID=$(oci network internet-gateway create \
    --compartment-id $COMPARTMENT_ID \
    --vcn-id $VCN_ID \
    --is-enabled true \
    --display-name "apollo-ig" \
    --query "data.id" --raw-output 2>/dev/null || \
    oci network internet-gateway list --compartment-id $COMPARTMENT_ID --vcn-id $VCN_ID --query "data[0].id" --raw-output)

# Create Public Subnet
SUBNET_ID=$(oci network subnet create \
    --compartment-id $COMPARTMENT_ID \
    --vcn-id $VCN_ID \
    --cidr-block "10.0.1.0/24" \
    --display-name "apollo-public-subnet" \
    --dns-label "apollosubnet" \
    --prohibit-public-ip-on-vnic false \
    --query "data.id" --raw-output 2>/dev/null || \
    oci network subnet list --compartment-id $COMPARTMENT_ID --vcn-id $VCN_ID --display-name "apollo-public-subnet" --query "data[0].id" --raw-output)

# Create Security List
SEC_LIST_ID=$(oci network security-list create \
    --compartment-id $COMPARTMENT_ID \
    --vcn-id $VCN_ID \
    --display-name "apollo-security-list" \
    --egress-security-rules '[{"destination":"0.0.0.0/0","protocol":"all"}]' \
    --ingress-security-rules '[{"source":"0.0.0.0/0","protocol":"6","tcp-options":{"destination-port-range":{"max":3100,"min":3100}}},{"source":"0.0.0.0/0","protocol":"6","tcp-options":{"destination-port-range":{"max":22,"min":22}}},{"source":"0.0.0.0/0","protocol":"6","tcp-options":{"destination-port-range":{"max":80,"min":80}}},{"source":"0.0.0.0/0","protocol":"6","tcp-options":{"destination-port-range":{"max":443,"min":443}}}]' \
    --query "data.id" --raw-output 2>/dev/null || \
    oci network security-list list --compartment-id $COMPARTMENT_ID --vcn-id $VCN_ID --display-name "apollo-security-list" --query "data[0].id" --raw-output)

# Update subnet with security list
oci network subnet update --subnet-id $SUBNET_ID --security-list-ids "[\"$SEC_LIST_ID\"]" --force > /dev/null

# Create Route Table with Internet Gateway
ROUTE_TABLE_ID=$(oci network route-table create \
    --compartment-id $COMPARTMENT_ID \
    --vcn-id $VCN_ID \
    --display-name "apollo-route-table" \
    --route-rules '[{"destination":"0.0.0.0/0","destination-type":"CIDR_BLOCK","network-entity-id":"'$IG_ID'"}]' \
    --query "data.id" --raw-output 2>/dev/null || \
    oci network route-table list --compartment-id $COMPARTMENT_ID --vcn-id $VCN_ID --display-name "apollo-route-table" --query "data[0].id" --raw-output)

oci network subnet update --subnet-id $SUBNET_ID --route-table-id $ROUTE_TABLE_ID --force > /dev/null

echo "✅ Networking configured"

# Launch Free Tier Instance (VM.Standard.A1.Flex - 4 OCPU, 24GB RAM)
echo "🖥️  Launching Free Tier ARM instance (4 OCPU, 24GB)..."
INSTANCE_ID=$(oci compute instance launch \
    --availability-domain "$(oci iam availability-domain list --compartment-id $COMPARTMENT_ID --query "data[0].name" --raw-output)" \
    --compartment-id $COMPARTMENT_ID \
    --shape "VM.Standard.A1.Flex" \
    --shape-config '{"ocpus":4,"memory-in-gbs":24}' \
    --image-id "$(oci compute image list --compartment-id $COMPARTMENT_ID --shape "VM.Standard.A1.Flex" --operating-system "Canonical Ubuntu" --operating-system-version "22.04" --query "data[0].id" --raw-output)" \
    --subnet-id $SUBNET_ID \
    --display-name "apollo-automation" \
    --ssh-authorized-keys-file ~/.ssh/id_rsa.pub \
    --freeform-tags '{"Project":"Apollo","Environment":"Production"}' \
    --query "data.id" --raw-output --wait-for-state RUNNING)

echo "🖥️  Instance launched: $INSTANCE_ID"

# Get public IP
PUBLIC_IP=$(oci compute instance list-vnics --instance-id $INSTANCE_ID --query "data[0].\"public-ip\"" --raw-output)
echo "🌍 Public IP: $PUBLIC_IP"

# Wait for SSH to be ready
echo "⏳ Waiting for SSH..."
for i in {1..30}; do
    if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ubuntu@$PUBLIC_IP "echo 'SSH ready'" 2>/dev/null; then
        echo "✅ SSH ready"
        break
    fi
    sleep 10
done

# Deploy automation service
echo "📦 Deploying automation service..."
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ubuntu@$PUBLIC_IP << 'EOF'
    set -e
    echo "📦 Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker ubuntu
    
    echo "📦 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    echo "📦 Cloning automation service..."
    cd /home/ubuntu
    git clone https://github.com/your-repo/apollo-automation.git 2>/dev/null || echo "Repo not public, will copy files"
    
    echo "✅ VPS setup complete"
EOF

# Copy deployment files
echo "📁 Copying deployment files..."
scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -r * ubuntu@$PUBLIC_IP:/home/ubuntu/apollo-automation/

# Deploy with docker-compose
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ubuntu@$PUBLIC_IP << 'EOF'
    cd /home/ubuntu/apollo-automation
    docker-compose up -d --build
    echo "✅ Automation service deployed"
EOF

echo ""
echo "🎉 Deployment Complete!"
echo "========================"
echo "🌍 Public IP: $PUBLIC_IP"
echo "🔧 Automation API: http://$PUBLIC_IP:3100"
echo "📊 Health Check: http://$PUBLIC_IP:3100/health"
echo "🔐 SSH: ssh ubuntu@$PUBLIC_IP"
echo ""
echo "Next steps:"
echo "1. Set environment variables on the server:"
echo "   sudo nano /home/ubuntu/apollo-automation/.env.production"
echo "2. Restart service: docker-compose restart"
echo "3. Configure cron for health checks (already in docker-compose)"