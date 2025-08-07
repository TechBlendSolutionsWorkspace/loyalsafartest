#!/usr/bin/env tsx

import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

async function resetDatabase() {
  console.log("🔄 Resetting database...");
  
  try {
    // Drop all tables if they exist (in correct order due to foreign keys)
    await db.execute(sql`DROP TABLE IF EXISTS blog_posts CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS testimonials CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS reviews CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS orders CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS products CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS categories CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS sessions CASCADE`);
    
    // Drop indexes
    await db.execute(sql`DROP INDEX IF EXISTS IDX_session_expire`);
    await db.execute(sql`DROP INDEX IF EXISTS categories_slug_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS categories_parent_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS categories_active_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS products_slug_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS products_category_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS products_popular_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS products_trending_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS products_available_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS orders_customer_email_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS orders_product_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS orders_status_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS orders_created_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS reviews_product_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS reviews_rating_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS reviews_approved_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS testimonials_active_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS testimonials_rating_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS blog_posts_slug_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS blog_posts_published_idx`);
    await db.execute(sql`DROP INDEX IF EXISTS blog_posts_category_idx`);
    
    console.log("✅ Database reset completed");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  resetDatabase()
    .then(() => {
      console.log("🎯 Database reset complete");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Reset failed:", error);
      process.exit(1);
    });
}

export { resetDatabase };