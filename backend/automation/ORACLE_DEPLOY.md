# Apollo Automation Service - Oracle Cloud Free Tier Deployment Guide

## 🎯 Quick Start (5 minutes)

### 1. Prerequisites
- Oracle Cloud account (Free Tier): https://cloud.oracle.com/free
- OCI CLI installed ✅ (already done)
- SSH key pair: `~/.ssh/id_rsa.pub` ✅ (already exists)

### 2. Configure OCI CLI (Run once)
```bash
# Configure OCI CLI with your Oracle Cloud credentials
oci setup config
```
You'll need:
- **Tenancy OCID**: From Oracle Cloud Console → Profile → Tenancy
- **User OCID**: From Oracle Cloud Console → Profile → User
- **Fingerprint**: From Oracle Cloud Console → Profile → API Keys
- **Private Key Path**: e.g., `~/.oci/oci_api_key.pem`
- **Region**: e.g., `us-ashburn-1`, `eu-frankfurt-1`, `uk-london-1`

### 3. Deploy (Automated)
```bash
cd backend/automation
chmod +x deploy-oracle.sh
./deploy-oracle.sh oracle
```

---

## 🔧 Manual Oracle Cloud Setup (If automation fails)

### 1. Create Free Tier VM
1. Login to Oracle Cloud Console
2. **Compute → Instances → Create Instance**
   - **Name**: `apollo-automation`
   - **Compartment**: Your compartment
   - **Placement**: Select any AD
   - **Shape**: `VM.Standard.A1.Flex` (ARM) - **FREE TIER**
     - OCPUs: **4** (max free)
     - Memory: **24 GB** (max free)
   - **Image**: Canonical Ubuntu 22.04
   - **SSH Keys**: Paste your `~/.ssh/id_rsa.pub` content
   - **Networking**: Create new VCN + public subnet
   - **Public IP**: Assign public IPv4

### 2. Security List Rules (Add to subnet)
| Protocol | Port | Source | Description |
|----------|------|--------|-------------|
| TCP | 22 | 0.0.0.0/0 | SSH |
| TCP | 3100 | 0.0.0.0/0 | Automation API |
| TCP | 80 | 0.0.0.0/0 | HTTP |
| TCP | 443 | 0.0.0.0/0 | HTTPS |

### 3. Deploy on VM
```bash
# SSH into instance
ssh ubuntu@<PUBLIC_IP>

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone and deploy
cd /home/ubuntu
git clone https://github.com/your-repo/apollo-task.git 2>/dev/null || echo "Use scp to copy files"
cd apollo-automation
docker-compose up -d --build
```

---

## 📋 Files Ready for Deployment

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Full stack: automation + redis + health-cron |
| `Dockerfile` | Playwright + Chromium container |
| `server.mjs` | HTTP API (health, test-cookie, fetch-stats, page-insights, actions) |
| `browser.mjs` | Browser pool + stealth + proxy rotation + Redis |
| `redis.mjs` | Redis client + locks + proxy health + cookie health |
| `cookie-health-check.mjs` | 30-min cron for cookie monitoring |
| `deploy.sh` | Local/VPS/Oracle/Fly deployment |
| `deploy-oracle.sh` | Oracle Cloud Free Tier automated deploy |
| `.env.production` | Production env template |
| `.env.example | Config template |

---

## 🔐 Environment Variables (Required on Server)

```bash
# /home/ubuntu/apollo-automation/.env.production
PORT=3100
NODE_ENV=production
BROWSER_POOL_SIZE=3
BROWSER_MAX_PAGES=5
COOKIE_ENCRYPTION_KEY=FAa8Tlsue6TC83VZ+JIMrBcyISGUoSlYKoPKsdbYTIg=
PROXY_LIST=http://user:pass@proxy1:8080,http://user:pass@proxy2:8080
HEALTH_CHECK_INTERVAL_MS=1800000
HEALTH_CHECK_API_BASE=https://your-api.railway.app/api
REDIS_URL=redis://redis:6379
LOG_LEVEL=info
```

---

## 🌐 Endpoints After Deploy

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Service health check |
| `POST /api/automation/test-cookie` | Validate Facebook cookies |
| `POST /api/automation/fetch-stats` | Scrape ad account stats |
| `POST /api/automation/fetch-page-insights` | Scrape page insights |
| `POST /api/automation/perform-action` | Invite user, change role |
| `POST /api/automation/encrypt-cookie` | Encrypt cookies (AES-256-GCM) |
| `POST /api/automation/decrypt-cookie` | Decrypt cookies |

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| SSH timeout | Check security list port 22, correct subnet |
| Docker permission denied | `sudo usermod -aG docker ubuntu && newgrp docker` |
| OCI CLI auth failed | `oci setup config` with correct keys |
| Instance not free tier | Use `VM.Standard.A1.Flex` with 4 OCPU / 24GB |
| SSH key rejected | Ensure `~/.ssh/id_rsa.pub` pasted correctly |

---

## 📞 Quick Commands

```bash
# Check service status
ssh ubuntu@<IP> "docker-compose ps"

# View logs
ssh ubuntu@<IP> "docker-compose logs -f"

# Restart service
ssh ubuntu@<IP> "cd apollo-automation && docker-compose restart"

# Update and redeploy
scp -r . ubuntu@<IP>:/home/ubuntu/apollo-automation/
ssh ubuntu@<IP> "cd apollo-automation && docker-compose up -d --build"

# View health check logs
ssh ubuntu@<IP> "tail -f /home/ubuntu/apollo-automation/logs/cookie-health.log"
```

---

## 💰 Cost: $0/month (Oracle Cloud Free Tier Forever)
- 4 OCPU ARM Ampere A1
- 24 GB RAM
- 200 GB Block Storage
- 10 TB Network
- 2 VCNs

**Ready to deploy!** Run `./deploy-oracle.sh oracle` after configuring OCI CLI.