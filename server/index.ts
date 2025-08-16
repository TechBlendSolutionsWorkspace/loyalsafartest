import express from "express";
import path from "path";

const app = express();
const port = parseInt(process.env.PORT || "5000", 10);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("🍛 Starting Indian Restaurant Website Server");

// API health check
app.get("/api/health", (req, res) => {
  console.log("✅ Health check requested");
  res.json({ 
    status: "healthy", 
    message: "Indian Restaurant Website API is running",
    timestamp: new Date().toISOString()
  });
});

// Serve static files
app.use(express.static('client'));

// SPA fallback
app.get("*", (req, res) => {
  console.log(`📄 Serving page for: ${req.path}`);
  res.sendFile(path.join(process.cwd(), 'client', 'simple-index.html'));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Indian Restaurant Server running on port ${port}`);
  console.log(`🌐 Visit: http://localhost:${port}`);
});