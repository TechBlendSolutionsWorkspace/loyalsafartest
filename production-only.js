#!/usr/bin/env node

// MTS Digital Services - Production Only Launcher
// Ensures application ALWAYS runs in production mode

console.log('🚀 MTS Digital Services - Production Mode Enforcer');

// Force production environment
process.env.NODE_ENV = 'production';

console.log('✅ Environment: PRODUCTION');
console.log('📊 Database: PostgreSQL via API');
console.log('🎭 Mode: Theater Hero Experience');

// Import and run the production server
import('./dist/index.js')
  .then(() => {
    console.log('✅ Production server started successfully');
  })
  .catch((err) => {
    console.error('❌ Production startup failed:', err);
    process.exit(1);
  });