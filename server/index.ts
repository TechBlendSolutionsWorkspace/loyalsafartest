import express from "express";
import { createServer } from "http";
import path from "path";
import cors from "cors";
import apiRoutes from "./routes";
import { setupVite, serveStatic } from "./vite";

const app = express();
const port = parseInt(process.env.PORT || "5000", 10);
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
    
    try {
      if (require('fs').existsSync(distPath)) {
        console.log("📦 Serving from dist/public");
        app.use(express.static(distPath));
      } else {
        console.log("📁 Serving from client directory");
        app.use(express.static(clientPath));
      }
    } catch (err) {
      console.log("📁 Fallback to client directory");
      app.use(express.static(clientPath));
    }
    
    // SPA fallback - serve index.html for all non-API routes
    app.get('*', (req, res) => {
      if (!req.originalUrl.startsWith('/api')) {
        try {
          const indexPath = require('fs').existsSync(distPath) 
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