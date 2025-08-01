import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertReviewSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/categories/:category/products", async (req, res) => {
    try {
      const products = await storage.getProductsByCategory(req.params.category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getFeaturedTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Blog Posts
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getFeaturedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Reviews
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getPublishedReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get("/api/products/:productId/reviews", async (req, res) => {
    try {
      const reviews = await storage.getPublishedReviewsByProduct(req.params.productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data" });
    }
  });

  // Admin Dashboard API Routes
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const stats = (storage as any).getAdminStats(days);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/revenue-chart", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const data = (storage as any).getRevenueChartData(days);
      res.json(data);
    } catch (error) {
      console.error("Error fetching revenue chart:", error);
      res.status(500).json({ message: "Failed to fetch revenue data" });
    }
  });

  app.get("/api/admin/orders-chart", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const data = (storage as any).getOrdersChartData(days);
      res.json(data);
    } catch (error) {
      console.error("Error fetching orders chart:", error);
      res.status(500).json({ message: "Failed to fetch orders data" });
    }
  });

  app.get("/api/admin/products-chart", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const data = (storage as any).getProductsChartData(days);
      res.json(data);
    } catch (error) {
      console.error("Error fetching products chart:", error);
      res.status(500).json({ message: "Failed to fetch products data" });
    }
  });

  app.get("/api/admin/top-products", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const data = (storage as any).getTopProducts(days);
      res.json(data);
    } catch (error) {
      console.error("Error fetching top products:", error);
      res.status(500).json({ message: "Failed to fetch top products" });
    }
  });

  app.get("/api/admin/recent-orders", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const data = (storage as any).getRecentOrders(limit);
      res.json(data);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      res.status(500).json({ message: "Failed to fetch recent orders" });
    }
  });

  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const data = (storage as any).getAnalytics(days);
      res.json(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Analytics tracking endpoint
  app.post("/api/analytics/track", async (req, res) => {
    try {
      const { event, data, userId, sessionId } = req.body;
      (storage as any).trackEvent(event, data, userId, sessionId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking analytics:", error);
      res.status(500).json({ message: "Failed to track event" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
