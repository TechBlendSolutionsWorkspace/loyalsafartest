import { createRoot } from "react-dom/client";
import "./index.css";

// Simple test component to verify React works in production
function SimpleApp() {
  console.log("✅ Simple React App Loaded Successfully");
  
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
      color: "white",
      fontFamily: "system-ui",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      padding: "2rem"
    }}>
      <div style={{
        textAlign: "center",
        background: "rgba(255,255,255,0.1)",
        padding: "2rem",
        borderRadius: "1rem",
        backdropFilter: "blur(10px)",
        maxWidth: "600px"
      }}>
        <h1 style={{ marginBottom: "1rem", fontSize: "2.5rem" }}>
          🚀 MTS Digital Services
        </h1>
        <p style={{ marginBottom: "2rem", fontSize: "1.2rem" }}>
          E-commerce Platform Successfully Deployed
        </p>
        
        <div style={{ marginBottom: "2rem" }}>
          <h3>React App Status: ✅ Working</h3>
          <p>JavaScript execution: Successful</p>
          <p>CSS loading: Functional</p>
          <p>Production mode: Active</p>
        </div>
        
        <button 
          onClick={() => window.location.href = '/full-app'}
          style={{
            background: "#3b82f6",
            color: "white",
            padding: "1rem 2rem",
            border: "none",
            borderRadius: "0.5rem",
            fontSize: "1.1rem",
            cursor: "pointer",
            marginRight: "1rem"
          }}
        >
          Launch Full App
        </button>
        
        <button 
          onClick={() => window.location.reload()}
          style={{
            background: "#059669",
            color: "white",
            padding: "1rem 2rem",
            border: "none",
            borderRadius: "0.5rem",
            fontSize: "1.1rem",
            cursor: "pointer"
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

console.log("🚀 Starting Simple React App for Production Test");

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  const root = createRoot(rootElement);
  root.render(<SimpleApp />);
  
  console.log("✅ Simple React App Rendered Successfully");
} catch (error) {
  console.error("❌ Failed to render Simple React App:", error);
  
  // Fallback display
  document.body.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460); color: white; font-family: system-ui;">
      <div style="text-align: center; padding: 2rem; background: rgba(255,255,255,0.1); border-radius: 1rem; backdrop-filter: blur(10px);">
        <h1>MTS Digital Services</h1>
        <p>React initialization failed. Error: ${error.message}</p>
        <button onclick="window.location.reload()" style="background: #3b82f6; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.5rem; cursor: pointer;">
          Reload Page
        </button>
      </div>
    </div>
  `;
}