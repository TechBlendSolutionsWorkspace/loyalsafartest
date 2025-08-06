import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupProductionServer(app: express.Application) {
  console.log('🚀 Configuring production server...');
  
  // Determine the correct static path based on current directory
  // In development: workspace root, look in dist/public
  // In production: dist directory, look in public
  let staticPath;
  
  if (__dirname.includes('/dist')) {
    // Running from dist directory (production build)
    staticPath = path.join(__dirname, 'public');
  } else {
    // Running from workspace root (development with REPLIT_DOMAINS)
    staticPath = path.join(process.cwd(), 'dist', 'public');
  }
  
  console.log(`📁 Serving static files from: ${staticPath}`);
  console.log(`📁 __dirname is: ${__dirname}`);
  console.log(`📁 process.cwd() is: ${process.cwd()}`);
  
  // Check if the path exists
  try {
    const fs = await import('fs');
    const stats = await fs.promises.stat(staticPath);
    console.log(`✅ Static path exists: ${staticPath}`);
    
    // List contents for debugging
    const files = await fs.promises.readdir(staticPath);
    console.log(`📂 Files in static directory:`, files);
  } catch (error) {
    console.error(`❌ Static path does not exist: ${staticPath}`, error);
    
    // Try alternative path
    const altPath = path.join(process.cwd(), 'dist', 'public');
    console.log(`🔍 Trying alternative path: ${altPath}`);
    try {
      const altStats = await fs.promises.stat(altPath);
      staticPath = altPath;
      console.log(`✅ Using alternative path: ${staticPath}`);
    } catch (altError) {
      console.error(`❌ Alternative path also failed: ${altPath}`, altError);
    }
  }
  
  // Serve static assets
  app.use(express.static(staticPath, {
    maxAge: '1h',
    etag: true,
    lastModified: true
  }));
  
  // API routes are already registered, they should work fine
  
  // Catch-all handler for client-side routing - serve index.html
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }
    
    const indexPath = path.join(staticPath, 'index.html');
    console.log(`🔗 Serving index.html for route: ${req.path}`);
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('❌ Error serving index.html:', err);
        res.status(500).send('Server Error');
      }
    });
  });
}