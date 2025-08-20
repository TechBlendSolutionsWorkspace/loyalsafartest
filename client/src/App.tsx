import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router, Route, Switch } from 'wouter';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

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
      <ThemeProvider defaultTheme="light" storageKey="jewellery-theme">
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Router>
                <Header />
                <main className="flex-1">
                  <Switch>
                    <Route path="/" component={HomePage} />
                    <Route path="/products" component={ProductsPage} />
                    <Route path="/product/:slug" component={ProductDetailPage} />
                    <Route path="/cart" component={CartPage} />
                    <Route path="/wishlist" component={WishlistPage} />
                    <Route path="/checkout" component={CheckoutPage} />
                    <Route path="/profile" component={ProfilePage} />
                    <Route path="/admin" component={AdminPage} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/register" component={RegisterPage} />
                    <Route>
                      <div className="container mx-auto px-4 py-16 text-center">
                        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                        <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
                      </div>
                    </Route>
                  </Switch>
                </main>
                <Footer />
              </Router>
            </div>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;