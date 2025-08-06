import { DatabaseStorage } from "./database-storage";

const storage = new DatabaseStorage();

export async function performDeploymentHealthCheck() {
  console.log("🔍 Starting deployment health check...");
  
  try {
    // Check database connection
    const categories = await storage.getCategories();
    const products = await storage.getProducts();
    
    console.log(`✅ Database Status: Connected`);
    console.log(`📂 Categories: ${categories.length} found`);
    console.log(`📦 Products: ${products.length} found`);
    
    // Log first 3 categories for verification
    console.log(`📋 Sample Categories:`);
    categories.slice(0, 3).forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} (${cat.slug})`);
    });
    
    // Check for main categories
    const mainCategories = categories.filter(c => !c.isSubcategory);
    const subCategories = categories.filter(c => c.isSubcategory);
    
    console.log(`🔢 Main Categories: ${mainCategories.length}`);
    console.log(`🔢 Sub Categories: ${subCategories.length}`);
    
    // Environment check
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Database URL: ${process.env.DATABASE_URL ? 'Configured' : 'Missing'}`);
    console.log(`🔐 Session Secret: ${process.env.SESSION_SECRET ? 'Configured' : 'Using default'}`);
    
    return {
      status: 'healthy',
      categoriesCount: categories.length,
      productsCount: products.length,
      environment: process.env.NODE_ENV || 'development'
    };
  } catch (error) {
    console.error("❌ Health check failed:", error);
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}

// API endpoint for health check
export function setupHealthCheck(app: any) {
  app.get('/api/health', async (req: any, res: any) => {
    const healthStatus = await performDeploymentHealthCheck();
    res.json(healthStatus);
  });
}