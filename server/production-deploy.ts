// Force production deployment with theater hero
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function forceProductionMode(app: express.Application) {
  console.log('🎭 FORCING PRODUCTION MODE - THEATER HERO DEPLOYMENT');
  
  // Override environment detection
  process.env.NODE_ENV = 'production';
  
  // Set static path to built files
  const staticPath = path.join(process.cwd(), 'dist', 'public');
  console.log(`📁 Production static path: ${staticPath}`);
  
  // Serve theater hero as main page
  app.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    const theaterPath = path.join(staticPath, 'index.html');
    console.log('🎭 Serving THEATER HERO from production build');
    res.sendFile(theaterPath);
  });
  
  // Serve static assets
  app.use(express.static(staticPath, {
    maxAge: 0,
    etag: false
  }));
  
  console.log('✅ Production theater hero mode activated');
}