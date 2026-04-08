#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# EC2 First-Time Setup Script — bestcserum.com
# Run this ONCE after launching EC2 (Ubuntu 22.04 LTS, t2.micro)
#
# Usage:
#   chmod +x scripts/ec2-setup.sh
#   ssh ubuntu@YOUR_EC2_IP "bash -s" < scripts/ec2-setup.sh
# ═══════════════════════════════════════════════════════════════════

set -e
echo "🚀 Starting EC2 setup for bestcserum.com..."

# ── 1. System updates ───────────────────────────────────────────────
echo "📦 Updating system..."
sudo apt-get update -y
sudo apt-get upgrade -y

# ── 2. Install Node.js 20 (LTS) ────────────────────────────────────
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

node --version
npm --version

# ── 3. Install PM2 (process manager) ───────────────────────────────
echo "📦 Installing PM2..."
sudo npm install -g pm2
pm2 startup systemd -u ubuntu --hp /home/ubuntu | tail -1 | sudo bash

# ── 4. Install Nginx ────────────────────────────────────────────────
echo "📦 Installing Nginx..."
sudo apt-get install -y nginx

# ── 5. Configure Nginx as reverse proxy ────────────────────────────
echo "⚙️ Configuring Nginx..."
sudo tee /etc/nginx/sites-available/bestcserum.com > /dev/null << 'NGINX_EOF'
server {
    listen 80;
    server_name bestcserum.com www.bestcserum.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
    gzip_min_length 1000;

    # Next.js static files — serve directly (fast)
    location /_next/static/ {
        alias /home/ubuntu/app/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Public folder
    location /public/ {
        alias /home/ubuntu/app/public/;
        expires 30d;
    }

    # Everything else → Next.js server
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }
}
NGINX_EOF

sudo ln -sf /etc/nginx/sites-available/bestcserum.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# ── 6. Install Certbot (SSL) ────────────────────────────────────────
echo "📦 Installing Certbot for SSL..."
sudo apt-get install -y certbot python3-certbot-nginx

# ── 7. Create app directory ─────────────────────────────────────────
mkdir -p /home/ubuntu/app

# ── 8. Swap space (important for t2.micro!) ─────────────────────────
echo "⚙️ Adding 1GB swap (for t2.micro low memory)..."
if [ ! -f /swapfile ]; then
    sudo fallocate -l 1G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

echo ""
echo "✅ EC2 Setup Complete!"
echo "════════════════════════════════════════════"
echo "  Node.js: $(node --version)"
echo "  NPM:     $(npm --version)"
echo "  PM2:     $(pm2 --version)"
echo "  Nginx:   $(nginx -v 2>&1)"
echo "════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  1. SSL: sudo certbot --nginx -d bestcserum.com -d www.bestcserum.com"
echo "  2. Push code to GitHub → auto-deploy triggers"
