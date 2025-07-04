#!/bin/bash

# Typesense Sync Wrapper Script
# Handles locking, logging, and error handling for the actual sync process

set -euo pipefail

PROJECT_ROOT="/root/data/futeccons-shop"
SCRIPT_PATH="$PROJECT_ROOT/src/script/seed.ts"
LOG_FILE="/var/log/typesense-sync.log"
LOCK_FILE="/tmp/typesense-sync.lock"
NODE_BIN="/root/.nvm/versions/node/v22.12.0/bin"
MAX_RETRIES=3
RETRY_DELAY=5

# Set PATH to include Node.js for cron environment
export PATH="$NODE_BIN:$PATH"

# Logging function
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

# Cleanup function
cleanup() {
    if [[ -f "$LOCK_FILE" ]]; then
        rm -f "$LOCK_FILE"
    fi
}

# Signal handlers
trap cleanup EXIT
trap 'log "ERROR" "Script interrupted by signal"; exit 1' INT TERM

# Check if script is already running
if [[ -f "$LOCK_FILE" ]]; then
    pid=$(cat "$LOCK_FILE")
    if kill -0 "$pid" 2>/dev/null; then
        log "WARN" "Sync process already running with PID: $pid"
        exit 0
    else
        log "WARN" "Stale lock file found, removing"
        rm -f "$LOCK_FILE"
    fi
fi

# Create lock file
echo $$ > "$LOCK_FILE"

# Sync function with retry logic
attempt=1
start_time=$(date +%s)

while [[ $attempt -le $MAX_RETRIES ]]; do
    log "INFO" "Starting sync attempt $attempt/$MAX_RETRIES"
    
    if cd "$PROJECT_ROOT" && "$NODE_BIN/npx" tsx "$SCRIPT_PATH" >> "$LOG_FILE" 2>&1; then
        end_time=$(date +%s)
        duration=$((end_time - start_time))
        log "INFO" "Sync completed successfully in ${duration}s"
        exit 0
    else
        exit_code=$?
        log "ERROR" "Sync failed with exit code: $exit_code (attempt $attempt/$MAX_RETRIES)"
        
        if [[ $attempt -eq $MAX_RETRIES ]]; then
            log "ERROR" "Max retries reached. Sync failed permanently."
            exit 1
        fi
        
        log "INFO" "Retrying in ${RETRY_DELAY}s..."
        sleep $RETRY_DELAY
        ((attempt++))
    fi
done
