import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function setupProductionMode(app: express.Application) {
  console.log('🚀 Setting up PRODUCTION mode server...');
  
  // Production static file serving
  const staticPath = path.join(process.cwd(), 'dist', 'public');
  console.log('📁 Static files path:', staticPath);
  
  // Serve static files with proper headers
  app.use(express.static(staticPath, {
    maxAge: '1h',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
      } else if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=UTF-8');
      } else if (filePath.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));

  // Production health check
  app.get('/production-health', async (req, res) => {
    const fs = await import('fs');
    res.json({
      status: 'production',
      timestamp: new Date().toISOString(),
      staticPath: staticPath,
      filesExist: {
        indexHtml: fs.existsSync(path.join(staticPath, 'index.html')),
        assetsDir: fs.existsSync(path.join(staticPath, 'assets'))
      }
    });
  });

  // Serve simple HTML version as fallback
  app.get('/simple', (req, res) => {
    const simplePath = path.join(process.cwd(), 'client', 'simple.html');
    res.sendFile(simplePath);
  });

  // Client-side routing fallback - MUST be last
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }
    
    // For the main route, serve the simple HTML version that works
    if (req.path === '/' || req.path === '/index.html') {
      const simplePath = path.join(process.cwd(), 'client', 'simple.html');
      console.log(`🔗 Serving simple.html for: ${req.path}`);
      return res.sendFile(simplePath, (err) => {
        if (err) {
          console.error('❌ Error serving simple.html:', err);
          res.status(500).send('Internal Server Error');
        }
      });
    }
    
    const indexPath = path.join(staticPath, 'index.html');
    console.log(`🔗 Serving index.html for: ${req.path}`);
    
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('❌ Error serving index.html:', err);
        res.status(500).send('Internal Server Error');
      }
    });
  });

  console.log('✅ Production mode configured');
}