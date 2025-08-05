import { 
  products, categories, orders, testimonials, blogPosts, reviews, users,
  type Product, type InsertProduct, 
  type Category, type InsertCategory,
  type Order, type InsertOrder,
  type Testimonial, type InsertTestimonial,
  type BlogPost, type InsertBlogPost,
  type Review, type InsertReview,
  type User, type UpsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Product methods
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProduct(id: string, product: InsertProduct): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    
    if (!updatedProduct) {
      throw new Error('Product not found');
    }
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async deleteAllProducts(): Promise<void> {
    await db.delete(products);
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateCategory(id: string, category: InsertCategory): Promise<Category> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    
    if (!updatedCategory) {
      throw new Error('Category not found');
    }
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values(order)
      .returning();
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    
    if (!updatedOrder) {
      throw new Error('Order not found');
    }
    return updatedOrder;
  }

  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.featured, true));
  }

  // Blog methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(eq(blogPosts.featured, true));
  }

  // Review methods
  async getReviews(): Promise<Review[]> {
    return await db.select().from(reviews);
  }

  async getReviewsByProduct(productId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.productId, productId));
  }

  async getPublishedReviews(): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.isPublished, true));
  }

  async getPublishedReviewsByProduct(productId: string): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(eq(reviews.productId, productId))
      .where(eq(reviews.isPublished, true));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return newReview;
  }

  async updateReviewStatus(id: string, isPublished: boolean): Promise<void> {
    await db
      .update(reviews)
      .set({ isPublished })
      .where(eq(reviews.id, id));
  }

  // User methods
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        },
      })
      .returning();
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateUser(id: string, userData: UpsertUser): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(users.id, id))
      .returning();
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Admin analytics methods
  async getAdminStats(days: number = 30): Promise<any> {
    const orders = await db.select().from(orders);
    const products = await db.select().from(products);
    const users = await db.select().from(users);
    
    return {
      totalRevenue: orders.reduce((sum, order) => sum + order.price, 0),
      totalOrders: orders.length,
      totalProducts: products.length,
      totalUsers: users.length,
      conversionRate: 2.5, // Mock value
      averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.price, 0) / orders.length : 0,
    };
  }

  async getRevenueChartData(days: number = 30): Promise<any[]> {
    // Mock chart data - in production, this would query date-based revenue
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 10000),
    }));
  }

  async getOrdersChartData(days: number = 30): Promise<any[]> {
    // Mock chart data - in production, this would query date-based orders
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      orders: Math.floor(Math.random() * 50),
    }));
  }

  async getProductsChartData(days: number = 30): Promise<any[]> {
    // Mock chart data - in production, this would query product performance
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      products: Math.floor(Math.random() * 20),
    }));
  }

  async getTopProducts(days: number = 30): Promise<any[]> {
    const products = await db.select().from(products);
    return products.slice(0, 5).map(product => ({
      name: product.name,
      sales: Math.floor(Math.random() * 100),
      revenue: product.price * Math.floor(Math.random() * 10),
    }));
  }

  async getRecentOrders(limit: number = 20): Promise<any[]> {
    const recentOrders = await db.select().from(orders);
    return recentOrders.slice(0, limit);
  }

  async getAnalytics(days: number = 30): Promise<any> {
    return {
      visitors: Math.floor(Math.random() * 10000),
      pageViews: Math.floor(Math.random() * 50000),
      bounceRate: 35.2,
      sessionDuration: 245,
    };
  }
}