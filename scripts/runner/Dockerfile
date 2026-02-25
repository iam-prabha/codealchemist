# Use Ubuntu as the base for robust language support
FROM ubuntu:22.04

# Prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install core dependencies (Python, Rust, build tools)
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    python3-pip \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install Modern Node.js (Node 20) instead of Ubuntu's default ancient Node 12
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Install Rust globally for all users
ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --no-modify-path --profile minimal

# Install TypeScript globally (using tsx which handles ESM out of the box)
RUN npm install -g typescript tsx

# Create a restricted user to run the untrusted code securely
RUN useradd -m -s /bin/bash runneruser

# Setup the API Server
WORKDIR /app
COPY package.json .
RUN npm install

COPY server.js .

# Create a directory for code execution and give runneruser ownership
RUN mkdir -p /app/code && chown runneruser:runneruser /app/code

EXPOSE 2358

# Start the Node.js API server
CMD ["node", "server.js"]