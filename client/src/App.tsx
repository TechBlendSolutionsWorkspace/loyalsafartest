import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from './components/ui/toaster';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';

// Components
import { Header } from './components/layout/Header';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-white text-black">
        <Router>
          <Header />
          <main className="flex-1">
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/products" component={ProductsPage} />
              <Route>
                <div className="container mx-auto px-4 py-16 text-center">
                  <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                  <p className="text-gray-600">The page you're looking for doesn't exist.</p>
                </div>
              </Route>
            </Switch>
          </main>
        </Router>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;