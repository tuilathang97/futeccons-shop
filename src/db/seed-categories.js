#!/usr/bin/env node

// Simple script to run the seed.ts file with ts-node
import { execSync } from "child_process"

console.log('Running category seed script...');
try {
  execSync('npx ts-node src/db/seed.ts', { stdio: 'inherit' });
  console.log('Seed completed successfully!');
} catch (error) {
  console.error('Error running seed:', error);
  process.exit(1);
} 