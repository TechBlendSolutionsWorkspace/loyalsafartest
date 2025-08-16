import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  console.log("🍛 Setting up routes for Indian Restaurant Website");
  
  // Basic health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      message: "Indian Restaurant Website API is running",
      timestamp: new Date().toISOString()
    });
  });

  // Create HTTP server
  const server = createServer(app);
  return server;
}