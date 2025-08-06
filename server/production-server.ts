import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function setupProductionServer(app: express.Application) {
  console.log('🚀 Configuring production server...');
  
  // Serve static files from the dist/public directory
  const staticPath = path.join(__dirname, 'public');
  console.log(`📁 Serving static files from: ${staticPath}`);
  
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