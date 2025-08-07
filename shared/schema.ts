import { sql } from 'drizzle-orm';
import {
  boolean,
  decimal,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for authentication)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for authentication)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // user, admin, moderator
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Categories table with proper hierarchy support
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }).default("fas fa-layer-group"),
  image: text("image"),
  isSubcategory: boolean("is_subcategory").default(false),
  parentCategoryId: varchar("parent_category_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  bannerImage: text("banner_image"),
  bannerTitle: varchar("banner_title"),
  bannerSubtitle: text("banner_subtitle"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("categories_slug_idx").on(table.slug),
  index("categories_parent_idx").on(table.parentCategoryId),
  index("categories_active_idx").on(table.isActive),
]);

// Products table with comprehensive product information
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  fullProductName: varchar("full_product_name", { length: 500 }),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description").notNull(),
  shortDescription: varchar("short_description", { length: 500 }),
  features: jsonb("features").default(sql`'[]'::jsonb`),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  discount: integer("discount").default(0),
  categoryId: varchar("category_id").notNull(),
  subcategory: varchar("subcategory"),
  duration: varchar("duration").default("30 days"),
  activationTime: varchar("activation_time").default("Instant"),
  warranty: varchar("warranty").default("30 days replacement"),
  notes: text("notes"),
  icon: varchar("icon", { length: 100 }).default("fas fa-box"),
  image: text("image"),
  images: jsonb("images").default(sql`'[]'::jsonb`),
  popular: boolean("popular").default(false),
  trending: boolean("trending").default(false),
  featured: boolean("featured").default(false),
  available: boolean("available").default(true),
  isVariant: boolean("is_variant").default(false),
  parentProductId: varchar("parent_product_id"),
  parentProductName: varchar("parent_product_name"),
  stockQuantity: integer("stock_quantity").default(-1), // -1 means unlimited
  downloadable: boolean("downloadable").default(true),
  virtual: boolean("virtual").default(true),
  sortOrder: integer("sort_order").default(0),
  metaTitle: varchar("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("products_slug_idx").on(table.slug),
  index("products_category_idx").on(table.categoryId),
  index("products_popular_idx").on(table.popular),
  index("products_trending_idx").on(table.trending),
  index("products_available_idx").on(table.available),
  unique("products_slug_unique").on(table.slug),
]);

// Orders table for purchase tracking
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  productId: varchar("product_id").notNull(),
  productName: varchar("product_name", { length: 500 }).notNull(),
  productPrice: decimal("product_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").default(1),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"),
  orderStatus: varchar("order_status", { length: 50 }).default("pending"),
  transactionId: varchar("transaction_id"),
  notes: text("notes"),
  deliveryDetails: jsonb("delivery_details"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("orders_customer_email_idx").on(table.customerEmail),
  index("orders_product_idx").on(table.productId),
  index("orders_status_idx").on(table.orderStatus),
  index("orders_created_idx").on(table.createdAt),
]);

// Reviews table for customer feedback
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }),
  rating: integer("rating").notNull(), // 1-5 stars
  title: varchar("title", { length: 255 }),
  comment: text("comment").notNull(),
  isVerified: boolean("is_verified").default(false),
  isApproved: boolean("is_approved").default(true),
  helpfulCount: integer("helpful_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("reviews_product_idx").on(table.productId),
  index("reviews_rating_idx").on(table.rating),
  index("reviews_approved_idx").on(table.isApproved),
]);

// Testimonials table for social proof
export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  avatar: text("avatar"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("testimonials_active_idx").on(table.isActive),
  index("testimonials_rating_idx").on(table.rating),
]);

// Blog posts table for content marketing
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  author: varchar("author", { length: 255 }).default("MTS Digital Services"),
  categoryId: varchar("category_id"),
  tags: jsonb("tags").default(sql`'[]'::jsonb`),
  isPublished: boolean("is_published").default(true),
  publishedAt: timestamp("published_at").defaultNow(),
  metaTitle: varchar("meta_title"),
  metaDescription: text("meta_description"),
  readingTime: integer("reading_time"), // in minutes
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("blog_posts_slug_idx").on(table.slug),
  index("blog_posts_published_idx").on(table.isPublished),
  index("blog_posts_category_idx").on(table.categoryId),
]);

// Define relationships
export const categoriesRelations = relations(categories, ({ many, one }) => ({
  products: many(products),
  subcategories: many(categories, { relationName: "CategoryHierarchy" }),
  parentCategory: one(categories, {
    fields: [categories.parentCategoryId],
    references: [categories.id],
    relationName: "CategoryHierarchy",
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orders: many(orders),
  reviews: many(reviews),
  variants: many(products, { relationName: "ProductVariants" }),
  parentProduct: one(products, {
    fields: [products.parentProductId],
    references: [products.id],
    relationName: "ProductVariants",
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  category: one(categories, {
    fields: [blogPosts.categoryId],
    references: [categories.id],
  }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// Zod schemas for validation
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Additional validation schemas
export type InsertCategoryType = z.infer<typeof insertCategorySchema>;
export type InsertProductType = z.infer<typeof insertProductSchema>;
export type InsertOrderType = z.infer<typeof insertOrderSchema>;
export type InsertReviewType = z.infer<typeof insertReviewSchema>;
export type InsertTestimonialType = z.infer<typeof insertTestimonialSchema>;
export type InsertBlogPostType = z.infer<typeof insertBlogPostSchema>;