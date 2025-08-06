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
  
  // Serve static files with NO CACHE to force refresh
  app.use(express.static(staticPath, {
    maxAge: 0,
    etag: false,
    lastModified: false,
    setHeaders: (res, filePath) => {
      // Force no cache for ALL files to ensure immediate updates
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
      } else if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=UTF-8');
      } else if (filePath.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      }
    }
  }));

  // Production health check
  app.get('/production-health', async (req, res) => {
    const fs = await import('fs');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json({
      status: 'production',
      timestamp: new Date().toISOString(),
      domain: req.hostname,
      userAgent: req.headers['user-agent'],
      staticPath: staticPath,
      filesExist: {
        indexHtml: fs.existsSync(path.join(staticPath, 'index.html')),
        assetsDir: fs.existsSync(path.join(staticPath, 'assets'))
      }
    });
  });

  // Domain-specific cache-busting endpoint
  app.get('/force-refresh', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    
    const timestamp = new Date().toISOString();
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Force Refresh - MTS Digital Services</title>
        <meta http-equiv="cache-control" content="no-cache">
        <meta http-equiv="refresh" content="3;url=/">
        <style>
          body { font-family: Arial; text-align: center; padding: 3rem; background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
          .container { background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 1rem; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔄 Force Refresh</h1>
          <p>Domain: ${req.hostname}</p>
          <p>Time: ${timestamp}</p>
          <p>Redirecting to main site in 3 seconds...</p>
          <p><a href="/" style="color: #fff;">Click here if not redirected</a></p>
        </div>
      </body>
      </html>
    `);
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
    
    // For the main route, serve the premium HTML version
    if (req.path === '/' || req.path === '/index.html') {
      // Force no cache headers for immediate refresh on custom domains
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      
      const premiumPath = path.join(process.cwd(), 'client', 'premium.html');
      console.log(`🔗 Serving premium.html for: ${req.path} (PREMIUM VERSION)`);
      return res.sendFile(premiumPath, (err) => {
        if (err) {
          console.error('❌ Error serving premium.html:', err);
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