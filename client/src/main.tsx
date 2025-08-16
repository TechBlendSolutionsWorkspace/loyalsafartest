import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("🍛 Indian Restaurant Website - Starting React App");

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  const root = createRoot(rootElement);
  root.render(<App />);
  
  console.log("✅ React App initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize React App:", error);
  
  document.body.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #fed7aa, #fecaca); color: #7c2d12; font-family: system-ui;">
      <div style="text-align: center; padding: 2rem; background: white; border-radius: 1rem;">
        <h1 style="margin-bottom: 1rem;">Restaurant Website</h1>
        <p>Failed to load. Please refresh.</p>
      </div>
    </div>
  `;
}