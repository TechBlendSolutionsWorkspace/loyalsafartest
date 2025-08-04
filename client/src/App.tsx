import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import CategoryPage from "@/pages/category";
import ProductVariantsPage from "@/pages/product-variants";
import CategorySubcategories from "@/pages/category-subcategories";
import SubcategoryProducts from "@/pages/subcategory-products";
import Products from "@/pages/products";
import Checkout from "@/pages/checkout";
import IBMPayment from "@/pages/ibm-payment";
import Reviews from "@/pages/reviews";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/category/:categorySlug/subcategories" component={CategorySubcategories} />
      <Route path="/category/:categorySlug/subcategory/:subcategoryId/products" component={SubcategoryProducts} />
      <Route path="/product/:productName" component={ProductVariantsPage} />
      <Route path="/products" component={Products} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/ibm-payment" component={IBMPayment} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="mts-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
