import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Hero from "@/components/hero";
import ProductGrid from "@/components/product-grid";
import Testimonials from "@/components/testimonials";
import FAQ from "@/components/faq";
import About from "@/components/about";
import Blog from "@/components/blog";
import Footer from "@/components/footer";
import { AdminLogin } from "@/components/admin-login";
import { Product, Category } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleAdminLoginSuccess = () => {
    setLocation("/admin");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ProductGrid 
        products={products} 
        categories={categories}
        isLoading={productsLoading || categoriesLoading}
      />
      <Testimonials />
      <FAQ />
      <About />
      <Blog />
      <Footer />
      
      {/* WhatsApp Float Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a 
          href="https://wa.me/917496067495" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors animate-bounce-soft"
        >
          <i className="fab fa-whatsapp text-2xl"></i>
        </a>
      </div>

      {/* Admin Login Component */}
      <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
    </div>
  );
}
