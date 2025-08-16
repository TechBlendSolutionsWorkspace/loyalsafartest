import express from "express";
import path from "path";

const app = express();
const port = 5000;

console.log("🍛 Starting Simple Indian Restaurant Website Server");

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'client')));

// API health check
app.get("/api/health", (req, res) => {
  console.log("Health check requested");
  res.json({ 
    status: "healthy", 
    message: "Indian Restaurant Website API is running",
    timestamp: new Date().toISOString()
  });
});

// Serve the HTML file
app.get("*", (req, res) => {
  console.log(`Request for: ${req.path}`);
  res.sendFile(path.join(process.cwd(), 'client', 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Indian Restaurant Server running on port ${port}`);
  console.log(`🌐 Visit: http://localhost:${port}`);
});