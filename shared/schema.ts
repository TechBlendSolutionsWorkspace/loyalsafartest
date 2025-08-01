import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  fullProductName: text("full_product_name").notNull(),
  subcategory: text("subcategory").notNull(),
  duration: text("duration").notNull(),
  description: text("description").notNull(),
  features: text("features").notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price").notNull(),
  discount: integer("discount").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  image: text("image").notNull(),
  activationTime: text("activation_time").notNull(),
  warranty: text("warranty").notNull(),
  notes: text("notes"),
  popular: boolean("popular").default(false),
  trending: boolean("trending").default(false),
  available: boolean("available").default(true),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon").notNull(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: text("order_id").notNull().unique(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  productName: text("product_name").notNull(),
  price: integer("price").notNull(),
  paymentMethod: text("payment_method").notNull(),
  status: text("status").default("pending").notNull(),
  whatsappSent: boolean("whatsapp_sent").default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
  rating: integer("rating").notNull(),
  review: text("review").notNull(),
  featured: boolean("featured").default(false),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  featured: boolean("featured").default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

// Reviews table for customer ratings and feedback
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
  customerName: varchar("customer_name").notNull(),
  customerEmail: varchar("customer_email"),
  rating: integer("rating").notNull(), // 1-5 stars
  title: varchar("title").notNull(),
  comment: text("comment").notNull(),
  isVerified: boolean("is_verified").default(false),
  isPublished: boolean("is_published").default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Review = typeof reviews.$inferSelect;

// Admin tables
export const admins = pgTable("admins", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"), // admin, super_admin
  permissions: text("permissions").array().default(sql`ARRAY[]::text[]`),
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminSessions = pgTable("admin_sessions", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: text("admin_id").references(() => admins.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  event: text("event").notNull(), // page_view, product_view, purchase, search
  data: jsonb("data").default(sql`'{}'::jsonb`),
  userId: text("user_id"),
  sessionId: text("session_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const adminLogs = pgTable("admin_logs", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: text("admin_id").references(() => admins.id),
  action: text("action").notNull(),
  target: text("target"), // product_id, user_id, etc.
  details: jsonb("details").default(sql`'{}'::jsonb`),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = typeof admins.$inferInsert;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;
export type AdminLog = typeof adminLogs.$inferSelect;
export type InsertAdminLog = typeof adminLogs.$inferInsert;
export type InsertReview = z.infer<typeof insertReviewSchema>;
