import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/home";

function App() {
  console.log("🍛 Indian Restaurant Website - Starting React App");
  console.log("✅ React App initialized successfully");
  
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
}

export default App;
