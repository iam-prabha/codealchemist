# Use Ubuntu as the base for robust language support
FROM ubuntu:22.04

# Prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies (Python, Node.js, Rust, build tools)
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    python3-pip \
    nodejs \
    npm \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install Rust globally for all users
ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --no-modify-path --profile minimal

# Install TypeScript globally
RUN npm install -g typescript ts-node

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