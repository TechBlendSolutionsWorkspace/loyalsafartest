import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("💎 Luxury Jewellery E-Commerce - Starting React App");

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  const root = createRoot(rootElement);
  root.render(<App />);
  
  console.log("✅ LuxeJewels App initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize LuxeJewels App:", error);
  
  document.body.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #ffd700, #ffed4e); color: #000; font-family: system-ui;">
      <div style="text-align: center; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
        <h1 style="margin-bottom: 1rem; color: #ffd700;">LuxeJewels</h1>
        <p>Failed to load. Please refresh.</p>
      </div>
    </div>
  `;
}