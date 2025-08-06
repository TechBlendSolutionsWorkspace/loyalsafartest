import { DatabaseStorage } from "./database-storage";

// Production deployment verification and data seeding
export class ProductionDeployment {
  private storage: DatabaseStorage;

  constructor() {
    this.storage = new DatabaseStorage();
  }

  async verifyDeployment(): Promise<boolean> {
    try {
      console.log("🔍 Production deployment verification starting...");
      
      // Check database connection
      const categories = await this.storage.getCategories();
      const products = await this.storage.getProducts();
      
      console.log(`✅ Database connected successfully`);
      console.log(`📂 Categories loaded: ${categories.length}`);
      console.log(`📦 Products loaded: ${products.length}`);
      
      // Ensure we have expected data
      if (categories.length >= 12 && products.length >= 100) {
        console.log("✅ Production deployment verified - all data present");
        return true;
      } else {
        console.error("❌ Production deployment failed - insufficient data");
        console.error(`Expected: >=12 categories, >=100 products`);
        console.error(`Found: ${categories.length} categories, ${products.length} products`);
        return false;
      }
      
    } catch (error) {
      console.error("❌ Production deployment verification failed:", error);
      return false;
    }
  }

  async seedIfNeeded(): Promise<void> {
    try {
      const categories = await this.storage.getCategories();
      const products = await this.storage.getProducts();
      
      if (categories.length === 0) {
        console.log("🌱 Seeding categories for production...");
        await this.seedCategories();
      }
      
      if (products.length === 0) {
        console.log("🌱 Seeding products for production...");
        await this.seedProducts();
      }
      
    } catch (error) {
      console.error("❌ Production seeding failed:", error);
    }
  }

  private async seedCategories(): Promise<void> {
    const categories = [
      { name: "OTT SUBSCRIPTIONS", slug: "ott-subscriptions", isSubcategory: false },
      { name: "VPN SERVICES", slug: "vpn-services", isSubcategory: false },
      { name: "CLOUD STORAGE", slug: "cloud-storage", isSubcategory: false },
      { name: "STREAMING SERVICES", slug: "streaming-services", isSubcategory: false },
      { name: "PROFESSIONAL & BUSINESS SOFTWARES", slug: "professional-business-softwares", isSubcategory: false },
      { name: "EDITING SOFTWARES", slug: "editing-softwares", isSubcategory: false },
      { name: "SOCIAL MEDIA GROWTH", slug: "social-media-growth", isSubcategory: false },
      { name: "AI TOOLS", slug: "ai-tools", isSubcategory: false },
      { name: "MARKETING TOOLS", slug: "marketing-tools", isSubcategory: false },
      { name: "DIGITAL BUNDLES", slug: "digital-bundles", isSubcategory: false },
      { name: "ENTERTAINMENT", slug: "entertainment", isSubcategory: false },
      { name: "PRODUCTIVITY", slug: "productivity", isSubcategory: false }
    ];

    for (const category of categories) {
      await this.storage.createCategory(category);
    }
    
    console.log(`✅ Seeded ${categories.length} categories`);
  }

  private async seedProducts(): Promise<void> {
    // Add key products for immediate deployment
    const products = [
      { name: "Netflix Premium", price: 199, categoryId: "ott-subscriptions", duration: "1 Month" },
      { name: "Amazon Prime Video", price: 149, categoryId: "ott-subscriptions", duration: "1 Month" },
      { name: "NordVPN", price: 299, categoryId: "vpn-services", duration: "1 Year" },
      { name: "Surfshark VPN", price: 199, categoryId: "vpn-services", duration: "1 Year" },
      { name: "Google Drive Storage", price: 99, categoryId: "cloud-storage", duration: "1 Month" }
    ];

    for (const product of products) {
      await this.storage.createProduct(product);
    }
    
    console.log(`✅ Seeded ${products.length} essential products`);
  }
}

export const productionDeployment = new ProductionDeployment();