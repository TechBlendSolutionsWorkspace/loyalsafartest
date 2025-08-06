import type { Express } from "express";
import { createServer, type Server } from "http";
import { DatabaseStorage } from "./database-storage";

const storage = new DatabaseStorage();
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
// Conditional auth import based on environment
import { setupAuth as replitSetupAuth, isAuthenticated as replitIsAuthenticated } from "./replitAuth";
import { setupSimpleAuth, isAuthenticated as simpleIsAuthenticated } from "./simpleAuth";
import { setupEmailAuth, isAuthenticated as emailIsAuthenticated } from "./email-auth";

// Choose auth system based on environment - prioritize email auth
const setupAuth = setupEmailAuth; // Using email auth as primary
const isAuthenticated = emailIsAuthenticated;
import jwt from "jsonwebtoken";
import { insertOrderSchema, insertReviewSchema, insertCategorySchema, insertProductSchema } from "@shared/schema";
import { imbPayment, type IMBPaymentRequest } from "./imb-payment";
import crypto from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);
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

  app.post("/api/admin/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      const updatedProduct = await storage.updateProduct(id, productData);
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProduct(id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
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

  app.post("/api/admin/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/admin/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const categoryData = req.body;
      const updatedCategory = await storage.updateCategory(id, categoryData);
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCategory(id);
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Orders (requires authentication)
  app.post("/api/orders", isAuthenticated, async (req, res) => {
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

  app.put("/api/admin/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedOrder = await storage.updateOrderStatus(id, status);
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Payment Routes
  app.post("/api/payments/create", async (req, res) => {
    try {
      const { productId, customerEmail, customerName } = req.body;
      
      // Get product details
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Generate unique order ID
      const orderId = `ORDER_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
      
      // Create payment request
      const paymentRequest: IMBPaymentRequest = {
        orderId,
        amount: product.price,
        productName: product.fullProductName,
        customerEmail,
        customerName,
        returnUrl: `${req.protocol}://${req.get('Host')}/payment/success`,
        callbackUrl: `${req.protocol}://${req.get('Host')}/api/payments/callback`,
      };

      // Create payment with IMB
      const paymentResponse = await imbPayment.createPayment(paymentRequest);
      
      if (paymentResponse.success) {
        // Create order in database
        const orderData = {
          orderId,
          productId: product.id,
          productName: product.fullProductName,
          price: product.price,
          paymentMethod: "IMB_Gateway",
          status: "pending",
          whatsappSent: false,
        };

        await storage.createOrder(orderData);

        res.json({
          success: true,
          paymentUrl: paymentResponse.paymentUrl,
          transactionId: paymentResponse.transactionId,
          orderId,
        });
      } else {
        res.status(400).json({
          success: false,
          message: paymentResponse.message,
          error: paymentResponse.error,
        });
      }
    } catch (error: any) {
      console.error("Payment creation error:", error);
      res.status(500).json({
        success: false,
        message: "Payment processing failed",
        error: error.message,
      });
    }
  });

  // Payment callback handler
  app.post("/api/payments/callback", async (req, res) => {
    try {
      const { signature, ...callbackData } = req.body;
      
      // Verify callback signature
      const isValidSignature = await imbPayment.verifyCallback(callbackData, signature);
      
      if (!isValidSignature) {
        return res.status(400).json({ message: "Invalid signature" });
      }

      const { order_id, status, transaction_id } = callbackData;

      // Update order status
      const orders = await storage.getOrders();
      const orderToUpdate = orders.find(o => o.orderId === order_id);
      
      if (orderToUpdate) {
        await storage.updateOrderStatus(orderToUpdate.id, status);
        
        // If payment is successful, trigger WhatsApp flow
        if (status === 'completed') {
          // Generate WhatsApp message
          const product = await storage.getProduct(orderToUpdate.productId);
          if (product) {
            const whatsappMessage = `🎉 *Order Confirmed!*%0A%0A📦 *Product*: ${product.fullProductName}%0A💰 *Price*: ₹${product.price}%0A🆔 *Order ID*: ${order_id}%0A⚡ *Activation*: ${product.activationTime}%0A🛡️ *Warranty*: ${product.warranty}%0A%0AThank you for your purchase! Your product will be activated soon.`;
            const whatsappUrl = `https://wa.me/918142528883?text=${whatsappMessage}`;
            
            // Mark WhatsApp as sent (in production, you might want to actually send it)
            // This is just marking it for tracking purposes
          }
        }
      }

      res.json({ message: "Callback processed successfully" });
    } catch (error: any) {
      console.error("Payment callback error:", error);
      res.status(500).json({ message: "Callback processing failed" });
    }
  });

  // Payment status check
  app.get("/api/payments/status/:transactionId", async (req, res) => {
    try {
      const { transactionId } = req.params;
      const status = await imbPayment.getPaymentStatus(transactionId);
      
      if (status) {
        res.json(status);
      } else {
        res.status(404).json({ message: "Transaction not found" });
      }
    } catch (error: any) {
      console.error("Payment status check error:", error);
      res.status(500).json({ message: "Status check failed" });
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

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Subcategory image upload endpoint
  app.post("/api/subcategories/upload-image", async (req, res) => {
    try {
      res.json({ message: "Image upload endpoint ready", success: true });
    } catch (error) {
      console.error("Error uploading subcategory image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // Object Storage Routes for File Upload
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ message: "Failed to get upload URL" });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Admin Dashboard API Routes
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const stats = await storage.getAdminStats(days);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/revenue-chart", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const data = await storage.getRevenueChartData(days);
      res.json(data);
    } catch (error) {
      console.error("Error fetching revenue chart:", error);
      res.status(500).json({ message: "Failed to fetch revenue data" });
    }
  });

  app.get("/api/admin/orders-chart", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const data = await storage.getOrdersChartData(days);
      res.json(data);
    } catch (error) {
      console.error("Error fetching orders chart:", error);
      res.status(500).json({ message: "Failed to fetch orders data" });
    }
  });

  app.get("/api/admin/products-chart", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const data = await storage.getProductsChartData(days);
      res.json(data);
    } catch (error) {
      console.error("Error fetching products chart:", error);
      res.status(500).json({ message: "Failed to fetch products data" });
    }
  });

  app.get("/api/admin/top-products", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const data = await storage.getTopProducts(days);
      res.json(data);
    } catch (error) {
      console.error("Error fetching top products:", error);
      res.status(500).json({ message: "Failed to fetch top products" });
    }
  });

  app.get("/api/admin/recent-orders", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const data = await storage.getRecentOrders(limit);
      res.json(data);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      res.status(500).json({ message: "Failed to fetch recent orders" });
    }
  });

  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const data = await storage.getAnalytics(days);
      res.json(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Admin CRUD endpoints
  app.get("/api/admin/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.put("/api/admin/orders/:id", async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  app.get("/api/admin/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching admin reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.put("/api/admin/reviews/:id", async (req, res) => {
    try {
      const { isPublished } = req.body;
      await storage.updateReviewStatus(req.params.id, isPublished);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating review status:", error);
      res.status(500).json({ message: "Failed to update review status" });
    }
  });

  app.post("/api/admin/products", async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  app.post("/api/admin/categories", async (req, res) => {
    try {
      const category = await storage.createCategory(req.body);
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/admin/categories/:id", async (req, res) => {
    try {
      const category = await storage.updateCategory(req.params.id, req.body);
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", async (req, res) => {
    try {
      await storage.deleteCategory(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Admin authentication endpoints
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // For demo purposes, create default admin if it doesn't exist
      if (username === "admin" && password === "admin123") {
        // In production, this should validate against database
        const token = jwt.sign(
          { username: "admin", role: "admin" },
          process.env.JWT_SECRET || "default-secret",
          { expiresIn: "24h" }
        );
        
        res.json({ 
          success: true, 
          token, 
          admin: { username: "admin", role: "admin" } 
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Object storage endpoints
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ message: "Failed to get upload URL" });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
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

  // Bulk upload products from CSV/Excel
  app.post("/api/admin/products/bulk-upload", async (req, res) => {
    try {
      const { products } = req.body;
      const createdProducts = [];
      
      for (const productData of products) {
        // Calculate discount if not provided
        const originalPrice = productData.originalPrice || Math.round(productData.price * 1.2);
        const discount = productData.discount || Math.round(((originalPrice - productData.price) / originalPrice) * 100);
        
        const product = {
          ...productData,
          originalPrice,
          discount,
          popular: productData.popular === 'true' || productData.popular === true,
          trending: productData.trending === 'true' || productData.trending === true,
          available: productData.available !== 'false' && productData.available !== false,
          isVariant: productData.isVariant === 'true' || productData.isVariant === true,
        };
        
        const created = await storage.createProduct(product);
        createdProducts.push(created);
      }
      
      res.json({ success: true, count: createdProducts.length, products: createdProducts });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete all products (admin only)
  app.delete("/api/admin/products/all", async (req, res) => {
    try {
      await storage.deleteAllProducts();
      res.json({ message: "All products deleted successfully" });
    } catch (error) {
      console.error("Error deleting all products:", error);
      res.status(500).json({ message: "Failed to delete all products" });
    }
  });

  // User Management Routes
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", async (req, res) => {
    try {
      const userData = req.body;
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put("/api/admin/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const user = await storage.updateUser(id, userData);
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteUser(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
