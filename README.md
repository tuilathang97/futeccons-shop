# Fuland
A real-estate E-commerce site for Fuland.

## Typesense Setup Guide

This guide will help you set up Typesense search engine with automatic PostgreSQL data synchronization on a new VPS.

### Prerequisites

- Ubuntu/Debian VPS with sudo access
- Node.js (v18+ recommended)
- PostgreSQL database
- pnpm package manager

### 1. Install Typesense Server

```bash
# Install Typesense Server
curl -O https://dl.typesense.org/releases/0.24.1/typesense-server-0.24.1-amd64.deb
sudo apt install ./typesense-server-0.24.1-amd64.deb

# Create Typesense configuration directory
sudo mkdir -p /etc/typesense

# Create configuration file
sudo tee /etc/typesense/typesense-server.ini > /dev/null <<EOF
[server]
api-key = your-api-key-here
data-dir = /var/lib/typesense
api-port = 8108
enable-cors = true
EOF

# Set proper permissions
sudo chown -R typesense:typesense /etc/typesense
sudo chmod 600 /etc/typesense/typesense-server.ini
```

### 2. Environment Variables

Create or update your `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Typesense Configuration
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=your-api-key-here
```

### 3. Update Script Paths

Update the paths in `scripts/setup-cron.sh` to match your VPS configuration:

```bash
# Update these paths in scripts/setup-cron.sh:
PROJECT_ROOT="/your/project/path"  # Change to your actual project path
NODE_BIN="/your/node/path/bin"     # Change to your Node.js installation path

# To find your Node.js path:
which node
# Example output: /home/user/.nvm/versions/node/v22.12.0/bin/node
```

### 4. Install Dependencies

```bash
# Install project dependencies
pnpm install

# Make scripts executable
chmod +x scripts/setup-cron.sh
```

### 5. Setup Typesense Sync

```bash
# Setup automatic sync (runs every minute)
pnpm run setup-typesense-cron

# Manual sync (for testing)
pnpm run sync-typesense

# Check cron job status
pnpm run crontab-typesense-check
```

### 6. Start Services

```bash
# Start Typesense server
pnpm run start:typesense

# Or start as a service
sudo systemctl start typesense-server
sudo systemctl enable typesense-server  # Auto-start on boot
```

### 7. Monitor and Manage

```bash
# View sync logs
tail -f /var/log/typesense-sync.log

# Manual sync with wrapper (includes retry logic)
pnpm run sync-typesense-manual

# Remove cron job
pnpm run crontab-typesense-remove
```

### Troubleshooting

#### Common Issues

1. **Permission Denied**: Ensure scripts are executable and you have proper permissions
   ```bash
   chmod +x scripts/setup-cron.sh
   sudo chown -R $USER:$USER /your/project/path
   ```

2. **Node.js Path Issues**: Update `NODE_BIN` path in `scripts/setup-cron.sh`
   ```bash
   # Find your Node.js path
   which node
   which npx
   ```

3. **Database Connection**: Verify your `DATABASE_URL` in `.env`
   ```bash
   # Test database connection
   psql "$DATABASE_URL" -c "SELECT 1;"
   ```

4. **Typesense Connection**: Check if Typesense is running
   ```bash
   curl http://localhost:8108/health
   ```

#### Log Files

- Sync logs: `/var/log/typesense-sync.log`
- Typesense logs: `/var/log/typesense/typesense.log`
- System logs: `journalctl -u typesense-server`

### Features

- **Automatic Sync**: Runs every minute via cron job
- **Process Locking**: Prevents concurrent sync operations
- **Retry Logic**: Automatic retry on failures (3 attempts)
- **Comprehensive Logging**: Detailed logs with timestamps
- **Error Handling**: Graceful error handling and reporting
- **Health Checks**: Validates environment and prerequisites

### Scripts Overview

- `setup-cron.sh`: Enterprise-grade cron setup with validation
- `sync-wrapper.sh`: Auto-generated wrapper with locking and retry logic
- `src/script/seed.ts`: Enhanced seed script with proper error handling

### Next Steps

1. Monitor the first few sync cycles
2. Set up log rotation if needed
3. Configure alerts for sync failures
4. Optimize sync frequency based on your needs
