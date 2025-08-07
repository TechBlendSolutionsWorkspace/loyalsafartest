#!/usr/bin/env tsx

import { db } from "../server/db.js";
import { categories, products, testimonials, blogPosts, orders, reviews } from "../shared/schema.js";
import { nanoid } from "nanoid";

// Comprehensive migration script for MTS Digital Services
export async function comprehensiveMigration() {
  console.log("🚀 MTS Digital Services - Comprehensive Database Migration");
  console.log("=" * 70);

  try {
    // Step 1: Create categories with proper hierarchy
    console.log("📂 Creating category structure...");
    
    const categoryData = [
      {
        id: "cat-ott",
        name: "OTT Subscriptions",
        slug: "ott",
        description: "Premium streaming service subscriptions at affordable prices",
        icon: "fas fa-tv",
        image: "/api/placeholder/400/300",
        sortOrder: 1
      },
      {
        id: "cat-vpn", 
        name: "VPN Services",
        slug: "vpn",
        description: "Secure and fast VPN services for privacy protection",
        icon: "fas fa-shield-alt",
        image: "/api/placeholder/400/300",
        sortOrder: 2
      },
      {
        id: "cat-cloud",
        name: "Cloud Storage", 
        slug: "cloud-storage",
        description: "Reliable cloud storage solutions for your data",
        icon: "fas fa-cloud",
        image: "/api/placeholder/400/300",
        sortOrder: 3
      },
      {
        id: "cat-streaming",
        name: "Streaming Services",
        slug: "streaming",
        description: "Music and entertainment streaming platforms",
        icon: "fas fa-music",
        image: "/api/placeholder/400/300", 
        sortOrder: 4
      },
      {
        id: "cat-editing",
        name: "Editing Software",
        slug: "editing-software",
        description: "Professional video and photo editing tools",
        icon: "fas fa-cut",
        image: "/api/placeholder/400/300",
        sortOrder: 5
      },
      {
        id: "cat-professional",
        name: "Professional Software",
        slug: "professional-software", 
        description: "Business and productivity software solutions",
        icon: "fas fa-briefcase",
        image: "/api/placeholder/400/300",
        sortOrder: 6
      },
      {
        id: "cat-social",
        name: "Social Media Growth",
        slug: "social-media-growth",
        description: "Tools to boost your social media presence", 
        icon: "fas fa-share-alt",
        image: "/api/placeholder/400/300",
        sortOrder: 7
      },
      {
        id: "cat-digital",
        name: "Digital Products",
        slug: "digital-products",
        description: "Digital resources and templates",
        icon: "fas fa-download",
        image: "/api/placeholder/400/300",
        sortOrder: 8
      },
      {
        id: "cat-ai",
        name: "AI Tools",
        slug: "ai-tools", 
        description: "Artificial intelligence and automation tools",
        icon: "fas fa-robot",
        image: "/api/placeholder/400/300",
        sortOrder: 9
      },
      {
        id: "cat-productivity",
        name: "Productivity Tools",
        slug: "productivity-tools",
        description: "Enhance your workflow and productivity",
        icon: "fas fa-tasks",
        image: "/api/placeholder/400/300",
        sortOrder: 10
      }
    ];

    // Insert categories
    for (const category of categoryData) {
      await db.insert(categories).values(category).onConflictDoNothing();
      console.log(`✅ Created category: ${category.name}`);
    }

    // Step 2: Create sample products for each category
    console.log("\n📦 Creating sample products...");
    
    const sampleProducts = [
      // OTT Products
      {
        name: "Netflix Premium 4K",
        slug: "netflix-premium-4k",
        description: "Premium Netflix subscription with 4K Ultra HD streaming",
        price: "299.00",
        originalPrice: "649.00",
        discount: 54,
        categoryId: "cat-ott",
        subcategory: "Netflix",
        duration: "30 days",
        features: ["4K Ultra HD", "HDR Content", "Multiple Screens", "Download Content"],
        popular: true,
        trending: true
      },
      {
        name: "Amazon Prime Video",
        slug: "amazon-prime-video",
        description: "Access to thousands of movies and TV shows",
        price: "199.00", 
        originalPrice: "329.00",
        discount: 40,
        categoryId: "cat-ott",
        subcategory: "Amazon Prime",
        duration: "30 days",
        features: ["HD Streaming", "Prime Content", "Multiple Devices", "Offline Downloads"],
        popular: true
      },
      {
        name: "Disney+ Hotstar VIP",
        slug: "disney-hotstar-vip",
        description: "Premium Disney+ Hotstar with live sports and shows",
        price: "249.00",
        originalPrice: "399.00", 
        discount: 38,
        categoryId: "cat-ott",
        subcategory: "Disney+ Hotstar",
        duration: "30 days",
        features: ["Live Sports", "Disney Content", "Marvel Shows", "Star Wars"],
        trending: true
      },
      // VPN Products
      {
        name: "ExpressVPN Premium",
        slug: "expressvpn-premium",
        description: "High-speed VPN with global servers",
        price: "399.00",
        originalPrice: "899.00",
        discount: 56,
        categoryId: "cat-vpn", 
        duration: "30 days",
        features: ["Ultra-fast Servers", "256-bit Encryption", "No Logs Policy", "24/7 Support"],
        popular: true
      },
      {
        name: "NordVPN Premium", 
        slug: "nordvpn-premium",
        description: "Secure VPN with advanced privacy features",
        price: "349.00",
        originalPrice: "799.00",
        discount: 56,
        categoryId: "cat-vpn",
        duration: "30 days", 
        features: ["Double VPN", "CyberSec Protection", "Kill Switch", "P2P Support"]
      },
      // Cloud Storage Products
      {
        name: "Google Drive 2TB",
        slug: "google-drive-2tb",
        description: "2TB Google Drive storage with Gmail integration",
        price: "299.00",
        originalPrice: "650.00",
        discount: 54,
        categoryId: "cat-cloud",
        duration: "30 days",
        features: ["2TB Storage", "Gmail Integration", "Google Photos", "Collaborative Tools"],
        popular: true
      }
    ];

    for (const product of sampleProducts) {
      await db.insert(products).values({
        ...product,
        id: nanoid(),
        features: JSON.stringify(product.features),
        activationTime: "Instant",
        warranty: "30 days replacement",
        icon: "fas fa-box",
        image: "/api/placeholder/400/300",
        available: true
      }).onConflictDoNothing();
      console.log(`✅ Created product: ${product.name}`);
    }

    // Step 3: Create testimonials
    console.log("\n💬 Creating testimonials...");
    
    const testimonialData = [
      {
        name: "Rahul Sharma",
        location: "Mumbai, India",
        rating: 5,
        comment: "Excellent service! Got my Netflix subscription instantly at an amazing price. Highly recommended!",
        avatar: "/api/placeholder/150/150",
        sortOrder: 1
      },
      {
        name: "Priya Patel", 
        location: "Delhi, India",
        rating: 5,
        comment: "Fast delivery and great customer support. The VPN service is working perfectly.",
        avatar: "/api/placeholder/150/150",
        sortOrder: 2
      },
      {
        name: "Arjun Singh",
        location: "Bangalore, India", 
        rating: 5,
        comment: "Best prices in the market! I've been using their services for months now.",
        avatar: "/api/placeholder/150/150",
        sortOrder: 3
      }
    ];

    for (const testimonial of testimonialData) {
      await db.insert(testimonials).values(testimonial).onConflictDoNothing();
      console.log(`✅ Created testimonial: ${testimonial.name}`);
    }

    // Step 4: Create blog posts
    console.log("\n📝 Creating blog posts...");
    
    const blogData = [
      {
        title: "Top 10 Streaming Services in India 2025",
        slug: "top-streaming-services-india-2025",
        excerpt: "Discover the best streaming platforms offering premium content at affordable prices",
        content: "Content about streaming services...",
        featuredImage: "/api/placeholder/800/600",
        categoryId: "cat-ott",
        tags: JSON.stringify(["streaming", "entertainment", "india"]),
        readingTime: 5
      },
      {
        title: "Why You Need a VPN in 2025",
        slug: "why-need-vpn-2025", 
        excerpt: "Learn about online privacy and security benefits of using a VPN service",
        content: "Content about VPN benefits...",
        featuredImage: "/api/placeholder/800/600",
        categoryId: "cat-vpn",
        tags: JSON.stringify(["vpn", "privacy", "security"]),
        readingTime: 7
      }
    ];

    for (const post of blogData) {
      await db.insert(blogPosts).values(post).onConflictDoNothing();
      console.log(`✅ Created blog post: ${post.title}`);
    }

    console.log("\n" + "=" * 70);
    console.log("✅ Comprehensive migration completed successfully!");
    console.log("🎯 Database is now ready for production use");

  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  comprehensiveMigration()
    .then(() => {
      console.log("🎉 Migration completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Migration failed:", error);
      process.exit(1);
    });
}