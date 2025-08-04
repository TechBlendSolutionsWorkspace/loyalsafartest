import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products: any = pgTable("products", {
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
  isVariant: boolean("is_variant").default(false),
  parentProductId: varchar("parent_product_id").references(() => products.id),
  parentProductName: text("parent_product_name"),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon").notNull(),
  bannerImage: text("banner_image"), // Category banner image URL (16:9 ratio - 1200x675px recommended)
  bannerTitle: text("banner_title"), // Custom banner title
  bannerSubtitle: text("banner_subtitle"), // Custom banner subtitle
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

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  customerName: text("customer_name").notNull(),
  title: text("title").notNull(),
  comment: text("comment").notNull(),
  rating: integer("rating").notNull(),
  isVerified: boolean("is_verified").default(false),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"),
  permissions: jsonb("permissions"),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export types
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;

// Validation schemas
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true });
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true });