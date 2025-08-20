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

// API health check
app.get("/api/health", (req, res) => {
  console.log("✅ Health check requested");
  res.json({ 
    status: "healthy", 
    message: "Luxury Jewellery E-Commerce API is running",
    timestamp: new Date().toISOString()
  });
});

// Setup Vite dev server for proper TypeScript/React compilation
if (process.env.NODE_ENV === "production") {
  serveStatic(app);
} else {
  await setupVite(app, server);
}

server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Luxury Jewellery E-Commerce Server running on port ${port}`);
  console.log(`🌐 Visit: http://localhost:${port}`);
});