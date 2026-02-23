#!/bin/bash

# ============================================================
# CodeAlchemist - Judge0 AWS Free Tier Setup Script
# Automatically configures an Ubuntu EC2 t2.micro/t3.micro (1GB RAM)
# to run Judge0 securely by adding Swap Space and a secret token.
# ============================================================

set -e # Exit immediately if a command fails

echo "🚀 Starting Judge0 Setup for AWS Free Tier (Ubuntu)..."

# 1. ADD SWAP SPACE (CRITICAL FOR 1GB RAM EC2 INSTANCES)
echo "💾 Checking RAM and Swap Space..."
if [ $(free | awk '/^Swap:/ {print $2}') -eq 0 ]; then
    echo "⚙️  No swap found. Creating 2GB swap file to prevent Out-Of-Memory crashes..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "✅ 2GB Swap Space created."
else
    echo "✅ Swap already exists. Skipping."
fi

# 2. INSTALL DOCKER & DOCKER COMPOSE
echo "🐳 Installing Docker & Docker Compose..."
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg unzip jq

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-compose

# 3. DOWNLOAD & CONFIGURE JUDGE0 (v1.13.1)
echo "⚖️  Downloading Judge0 CE v1.13.1..."
mkdir -p ~/judge0 && cd ~/judge0
wget -qO judge0.zip https://github.com/judge0/judge0/releases/download/v1.13.1/judge0-v1.13.1.zip
unzip -qo judge0.zip
cd judge0-v1.13.1

# 4. SECURE JUDGE0 WITH AN AUTH TOKEN
echo "🔒 Securing your Judge0 instance..."
# Generate a random 32-character secure token
SECRET_TOKEN=$(openssl rand -hex 16)

# Update the judge0.conf file with the new token
sed -i "s/^AUTH_CALLBACK_TOKEN=.*/AUTH_CALLBACK_TOKEN=$SECRET_TOKEN/" judge0.conf
sed -i "s/^# AUTH_CALLBACK_TOKEN/AUTH_CALLBACK_TOKEN/" judge0.conf # Uncomment if commented

# Enable token authentication for all requests (important for security!)
echo "ENABLE_AUTH=true" >> judge0.conf

# 5. START JUDGE0 SERVICES
echo "🟢 Starting Judge0 Databases (PostgreSQL & Redis)..."
sudo docker-compose up -d db redis

echo "⏳ Waiting 15 seconds for databases to initialize..."
sleep 15

echo "🟢 Starting Judge0 Server & Workers..."
sudo docker-compose up -d

# 6. VERIFY AND PRINT INSTRUCTIONS
echo "============================================================"
echo "🎉 SUCCESS! Judge0 is now running on your AWS EC2 Instance."
echo "============================================================"
echo ""
echo "🔥 CRITICAL: Copy the following values to your Vercel Environment Variables:"
echo ""
echo "1. JUDGE0_API_URL:    http://$(curl -s http://checkip.amazonaws.com):2358"
echo "2. JUDGE0_AUTH_TOKEN: $SECRET_TOKEN"
echo ""
echo "⚠️  IMPORTANT AWS REMINDER:"
echo "Make sure you have edited your EC2 'Security Group' to allow 'Custom TCP' on Port 2358 from 'Anywhere' (0.0.0.0/0)."
echo "============================================================"
