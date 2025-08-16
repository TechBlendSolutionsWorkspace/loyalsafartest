import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/error-boundary";
import App from "./App";
import "./index.css";

// Add error handling for the app initialization
console.log("🚀 Clean Starter App - Starting React App");

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  const root = createRoot(rootElement);
  
  root.render(
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster />
      </QueryClientProvider>
    </ErrorBoundary>
  );
  
  console.log("✅ React App initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize React App:", error);
  
  // Fallback: show basic error message
  document.body.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460); color: white; font-family: system-ui;">
      <div style="text-align: center; padding: 2rem; background: rgba(255,255,255,0.1); border-radius: 1rem; backdrop-filter: blur(10px);">
        <h1 style="margin-bottom: 1rem;">MTS Digital Services</h1>
        <p style="margin-bottom: 1rem;">Loading application...</p>
        <button onclick="window.location.reload()" style="background: #3b82f6; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.5rem; cursor: pointer;">
          Reload Page
        </button>
      </div>
    </div>
  `;
}
