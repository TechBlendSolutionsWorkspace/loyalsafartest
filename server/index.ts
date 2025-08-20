import express from "express";
import { createServer } from "http";
import path from "path";
import cors from "cors";
import fs from "fs";
import apiRoutes from "./routes";
import { setupVite, serveStatic } from "./vite";

const app = express();
const port = parseInt(process.env.PORT || "5001", 10);
const server = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("💎 Starting Luxury Jewellery E-Commerce Server");

// API routes
app.use('/api', apiRoutes);

// Temporary test route
app.get("/test", (req, res) => {
  console.log("🧪 Test route accessed");
  res.sendFile(path.resolve(import.meta.dirname, "..", "test.html"));
});

// API health check
app.get("/api/health", (req, res) => {
  console.log("✅ Health check requested");
  res.json({ 
    status: "healthy", 
    message: "Luxury Jewellery E-Commerce API is running",
    timestamp: new Date().toISOString()
  });
});

// Setup and start server
async function startServer() {
  try {
    console.log(`📦 Environment: ${process.env.NODE_ENV}`);
    
    // Temporarily force production mode to serve built files
    console.log("🏭 Serving static build files");
    
    // Serve static files from dist/public if available, otherwise from client
    const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");
    const clientPath = path.resolve(import.meta.dirname, "..", "client");
    
    if (fs.existsSync(distPath)) {
      console.log("📦 Serving from dist/public (production build)");
      app.use(express.static(distPath, {
        setHeaders: (res, filePath) => {
          console.log(`Serving file: ${filePath}`);
          if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
          } else if (filePath.endsWith('.mjs')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
          } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=utf-8');
          }
        }
      }));
    } else {
      console.log("📁 Serving from client directory (fallback)");
      app.use(express.static(clientPath));
    }
    
    // SPA fallback - serve index.html for all non-API routes
    app.get('*', (req, res) => {
      if (!req.originalUrl.startsWith('/api')) {
        try {
          const indexPath = fs.existsSync(distPath) 
            ? path.join(distPath, 'index.html')
            : path.join(clientPath, 'index.html');
          res.sendFile(indexPath);
        } catch (err) {
          res.status(500).json({ error: 'Unable to serve application' });
        }
      }
    });

    server.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Luxury Jewellery E-Commerce Server running on port ${port}`);
      console.log(`🌐 Visit: http://localhost:${port}`);
    }).on('error', (err) => {
      console.error(`❌ Server failed to start:`, err);
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

startServer().catch(console.error);