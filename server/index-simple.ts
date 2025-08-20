import express from "express";
import cors from "cors";

const app = express();
const port = 5002;

console.log("💎 Starting Simple Test Server");

// Middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
  res.json({ 
    message: "LuxeJewels Test Server Running",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  console.log("✅ Health check requested");
  res.json({ 
    status: "healthy", 
    message: "Simple test server working",
    timestamp: new Date().toISOString()
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Simple test server running on port ${port}`);
  console.log(`🌐 Visit: http://localhost:${port}`);
}).on('error', (err) => {
  console.error(`❌ Server failed to start:`, err);
});