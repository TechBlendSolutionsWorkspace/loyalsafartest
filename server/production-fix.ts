import { DatabaseStorage } from "./database-storage";

// Production database seeding and verification
export async function ensureProductionData() {
  const storage = new DatabaseStorage();
  
  try {
    console.log("🔍 Checking production data...");
    
    const categories = await storage.getCategories();
    const products = await storage.getProducts();
    
    console.log(`📂 Categories found: ${categories.length}`);
    console.log(`📦 Products found: ${products.length}`);
    
    // If no data, something is wrong with storage
    if (categories.length === 0 || products.length === 0) {
      console.error("❌ Critical: No data found in production database!");
      console.log("🔧 This usually means:");
      console.log("   1. Database connection issue");
      console.log("   2. Wrong storage system being used");
      console.log("   3. Data migration needed");
      
      return false;
    }
    
    console.log("✅ Production data verified successfully");
    return true;
    
  } catch (error) {
    console.error("❌ Production data check failed:", error);
    return false;
  }
}

export function logProductionStatus() {
  console.log("🌍 PRODUCTION STATUS CHECK:");
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? 'configured' : 'MISSING'}`);
  console.log(`   REPLIT_DOMAINS: ${process.env.REPLIT_DOMAINS || 'not set'}`);
  console.log(`   SESSION_SECRET: ${process.env.SESSION_SECRET ? 'configured' : 'using default'}`);
}