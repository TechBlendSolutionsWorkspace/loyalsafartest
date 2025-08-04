import { db } from "./db";
import { products, categories, testimonials, blogPosts } from "@shared/schema";

async function seedDatabase() {
  console.log("Seeding database with initial data...");

  try {
    // Clear existing data (optional - remove in production)
    await db.delete(products);
    await db.delete(categories);
    await db.delete(testimonials);
    await db.delete(blogPosts);

    // Seed Categories
    const categoryData = [
      {
        name: "OTT Subscriptions",
        slug: "ott",
        description: "Premium streaming services at affordable prices",
        icon: "fas fa-tv",
        bannerImage: "/api/placeholder/1200/675",
        bannerTitle: "Premium OTT Subscriptions",
        bannerSubtitle: "Stream unlimited content with top platforms"
      },
      {
        name: "VPN Services",
        slug: "vpn",
        description: "Secure and fast VPN solutions for privacy protection",
        icon: "fas fa-shield-alt",
        bannerImage: "/api/placeholder/1200/675",
        bannerTitle: "Premium VPN Services",
        bannerSubtitle: "Secure browsing with global server access"
      },
      {
        name: "Cloud Storage",
        slug: "cloud",
        description: "Reliable cloud storage solutions for your data",
        icon: "fas fa-cloud",
        bannerImage: "/api/placeholder/1200/675",
        bannerTitle: "Cloud Storage Solutions",
        bannerSubtitle: "Secure and scalable storage for all your needs"
      },
      {
        name: "Streaming Services",
        slug: "streaming",
        description: "Music and entertainment streaming platforms",
        icon: "fas fa-music",
        bannerImage: "/api/placeholder/1200/675",
        bannerTitle: "Streaming Services",
        bannerSubtitle: "Unlimited music and entertainment streaming"
      }
    ];

    await db.insert(categories).values(categoryData);

    // Seed Products
    const productData = [
      // Netflix Products
      {
        name: "Netflix",
        fullProductName: "Netflix Premium - 1 Month",
        subcategory: "Netflix",
        duration: "1 Month",
        description: "Stream unlimited movies and TV shows in 4K quality",
        features: "4K Ultra HD, 4 Screens, Download Available",
        price: 199,
        originalPrice: 649,
        discount: 70,
        category: "OTT Subscriptions",
        icon: "fab fa-netflix",
        image: "/api/placeholder/400/300",
        activationTime: "Instant",
        warranty: "1 Month Replacement",
        notes: "Worldwide Account",
        popular: true,
        trending: true,
        available: true,
        isVariant: false,
        parentProductId: null,
        parentProductName: null
      },
      {
        name: "Netflix",
        fullProductName: "Netflix Premium - 3 Months",
        subcategory: "Netflix",
        duration: "3 Months",
        description: "Stream unlimited movies and TV shows in 4K quality",
        features: "4K Ultra HD, 4 Screens, Download Available",
        price: 499,
        originalPrice: 1947,
        discount: 74,
        category: "OTT Subscriptions",
        icon: "fab fa-netflix",
        image: "/api/placeholder/400/300",
        activationTime: "Instant",
        warranty: "3 Months Replacement",
        notes: "Worldwide Account",
        popular: false,
        trending: false,
        available: true,
        isVariant: true,
        parentProductId: null,
        parentProductName: "Netflix"
      },
      // Prime Video
      {
        name: "Prime Video",
        fullProductName: "Amazon Prime Video - 1 Month",
        subcategory: "Prime Video",
        duration: "1 Month",
        description: "Watch Amazon Original series and movies",
        features: "HD Streaming, Multiple Devices, Original Content",
        price: 149,
        originalPrice: 299,
        discount: 50,
        category: "OTT Subscriptions",
        icon: "fab fa-amazon",
        image: "/api/placeholder/400/300",
        activationTime: "Instant",
        warranty: "1 Month Replacement",
        notes: "India Region",
        popular: true,
        trending: false,
        available: true,
        isVariant: false,
        parentProductId: null,
        parentProductName: null
      },
      // VPN Services
      {
        name: "NordVPN",
        fullProductName: "NordVPN Premium - 1 Month",
        subcategory: "NordVPN",
        duration: "1 Month",
        description: "Secure VPN with global server network",
        features: "5500+ Servers, No Logs, 6 Devices",
        price: 299,
        originalPrice: 599,
        discount: 50,
        category: "VPN Services",
        icon: "fas fa-shield-alt",
        image: "/api/placeholder/400/300",
        activationTime: "Instant",
        warranty: "1 Month Replacement",
        notes: "Global Access",
        popular: true,
        trending: true,
        available: true,
        isVariant: false,
        parentProductId: null,
        parentProductName: null
      }
    ];

    await db.insert(products).values(productData);

    // Seed Testimonials
    const testimonialData = [
      {
        name: "Rahul Kumar",
        avatar: "/api/placeholder/64/64",
        rating: 5,
        review: "Amazing service! Got my Netflix subscription instantly and it's working perfectly.",
        featured: true
      },
      {
        name: "Priya Singh",
        avatar: "/api/placeholder/64/64",
        rating: 5,
        review: "Great prices and quick delivery. Highly recommended for digital services.",
        featured: true
      },
      {
        name: "Amit Sharma",
        avatar: "/api/placeholder/64/64",
        rating: 4,
        review: "Good service overall. The VPN works well and customer support is helpful.",
        featured: false
      }
    ];

    await db.insert(testimonials).values(testimonialData);

    // Seed Blog Posts
    const blogData = [
      {
        title: "How to Choose the Right Streaming Service",
        slug: "choose-right-streaming-service",
        excerpt: "Compare different OTT platforms and find the best one for your needs",
        content: "With so many streaming services available, choosing the right one can be overwhelming...",
        image: "/api/placeholder/600/400",
        category: "Technology",
        featured: true
      },
      {
        title: "Benefits of Using a VPN for Online Privacy",
        slug: "vpn-online-privacy-benefits",
        excerpt: "Learn how VPNs protect your data and enhance your online security",
        content: "In today's digital age, online privacy has become more important than ever...",
        image: "/api/placeholder/600/400",
        category: "Security",
        featured: true
      }
    ];

    await db.insert(blogPosts).values(blogData);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };