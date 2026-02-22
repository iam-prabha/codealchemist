#!/bin/bash

# Setup Piston Languages via API
# Installs Python 3.10.0, Rust 1.68.2, and TypeScript 5.0.3 into the Piston container.

echo "🧪 CodeAlchemist Piston Setup"
echo "------------------------------"

echo "🚀 Instructing Piston API to download languages (this might take a few minutes)..."

echo "📦 Installing Python 3.10.0..."
curl -s -X POST -H "Content-Type: application/json" -d '{"language": "python", "version": "3.10.0"}' http://127.0.0.1:2000/api/v2/packages

echo -e "\n📦 Installing Rust 1.68.2..."
curl -s -X POST -H "Content-Type: application/json" -d '{"language": "rust", "version": "1.68.2"}' http://127.0.0.1:2000/api/v2/packages

echo -e "\n📦 Installing TypeScript 5.0.3..."
curl -s -X POST -H "Content-Type: application/json" -d '{"language": "typescript", "version": "5.0.3"}' http://127.0.0.1:2000/api/v2/packages

echo -e "\n✅ Setup complete! The execution engine is ready."
