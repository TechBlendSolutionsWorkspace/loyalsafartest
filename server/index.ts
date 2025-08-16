import express from "express";
import path from "path";

const app = express();
const port = parseInt(process.env.PORT || "5000", 10);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("🍽️ Starting Golden Spoons 3D Restaurant Server");

// API health check
app.get("/api/health", (req, res) => {
  console.log("✅ Health check requested");
  res.json({ 
    status: "healthy", 
    message: "Golden Spoons 3D Restaurant API is running",
    timestamp: new Date().toISOString()
  });
});

// Serve static files
app.use(express.static('client'));

// SPA fallback
app.get("*", (req, res) => {
  console.log(`📄 Serving page for: ${req.path}`);
  res.sendFile(path.join(process.cwd(), 'client', 'index.html'));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Golden Spoons 3D Server running on port ${port}`);
  console.log(`🌐 Visit: http://localhost:${port}`);
});