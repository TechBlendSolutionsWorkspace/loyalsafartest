import express from "express";
import path from "path";
import cors from "cors";
import apiRoutes from "./routes";

const app = express();
const port = parseInt(process.env.PORT || "5000", 10);

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

// Serve static files
app.use(express.static('client'));

// SPA fallback - serve React app for all non-API routes
app.get("*", (req, res) => {
  console.log(`📄 Serving page for: ${req.path}`);
  res.sendFile(path.join(process.cwd(), 'client', 'index.html'));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Luxury Jewellery E-Commerce Server running on port ${port}`);
  console.log(`🌐 Visit: http://localhost:${port}`);
});