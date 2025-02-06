#!/bin/bash
set -e

# Only install dependencies for drizzle migration. Those are not bundled via `next build` as its optimized to only install dependencies that are used`
echo "Installing production dependencies"
pnpm run db-update
pnpm run dev