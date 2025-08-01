import { type Product, type InsertProduct, type Category, type InsertCategory, type Order, type InsertOrder, type Testimonial, type InsertTestimonial, type BlogPost, type InsertBlogPost, type Review, type InsertReview, products, categories, orders, testimonials, blogPosts, reviews } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  getFeaturedTestimonials(): Promise<Testimonial[]>;
  
  // Blog Posts
  getBlogPosts(): Promise<BlogPost[]>;
  getFeaturedBlogPosts(): Promise<BlogPost[]>;
  
  // Reviews
  getReviews(): Promise<Review[]>;
  getReviewsByProduct(productId: string): Promise<Review[]>;
  getPublishedReviews(): Promise<Review[]>;
  getPublishedReviewsByProduct(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReviewStatus(id: string, isPublished: boolean): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.seedData();
  }

  private async seedData() {
    try {
      // Check if data already exists
      const existingCategories = await db.select().from(categories).limit(1);
      if (existingCategories.length > 0) {
        return; // Data already seeded
      }

      // Seed categories
      const categoryData: InsertCategory[] = [
        { name: "OTT Subscriptions", slug: "ott", description: "Premium streaming platforms", icon: "fas fa-play-circle" },
        { name: "VPN Services", slug: "vpn", description: "Secure browsing solutions", icon: "fas fa-shield-alt" },
        { name: "Cloud Storage", slug: "cloud", description: "Cloud storage solutions", icon: "fas fa-cloud" },
        { name: "Streaming Services", slug: "streaming", description: "Music and audio streaming", icon: "fas fa-music" },
      ];

      await db.insert(categories).values(categoryData);

      // Seed products from authentic CSV data
      const productData: InsertProduct[] = [
        // VPN Services - Surfshark
        {
          name: "Surfshark VPN",
          fullProductName: "Surfshark - 1 Month (1 Device)",
          subcategory: "Surfshark",
          duration: "1 Month",
          description: "High-speed VPN with secure browsing",
          features: "1 Device, High-Speed VPN Access",
          price: 149,
          originalPrice: 429,
          discount: Math.round(((429 - 149) / 429) * 100),
          category: "vpn",
          icon: "fas fa-shield-alt",
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "30 Days",
          notes: "",
          popular: true,
          trending: false,
          available: true,
        },
        {
          name: "Surfshark VPN",
          fullProductName: "Surfshark - 3 Months",
          subcategory: "Surfshark",
          duration: "3 Months",
          description: "Multi-device VPN access with fast speeds",
          features: "Multi-device Access, Fast & Secure",
          price: 399,
          originalPrice: 999,
          discount: Math.round(((999 - 399) / 999) * 100),
          category: "vpn",
          icon: "fas fa-shield-alt",
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "90 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        {
          name: "Surfshark VPN",
          fullProductName: "Surfshark - 6 Months",
          subcategory: "Surfshark",
          duration: "6 Months",
          description: "Unlimited bandwidth with global server access",
          features: "Unlimited Bandwidth, Global Servers",
          price: 599,
          originalPrice: 1799,
          discount: Math.round(((1799 - 599) / 1799) * 100),
          category: "vpn",
          icon: "fas fa-shield-alt",
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "180 Days",
          notes: "",
          popular: false,
          trending: true,
          available: true,
        },
        {
          name: "Surfshark VPN",
          fullProductName: "Surfshark - 12 Months",
          subcategory: "Surfshark",
          duration: "12 Months",
          description: "Annual VPN subscription with secure browsing",
          features: "12M Access, Secure Browsing",
          price: 899,
          originalPrice: 3599,
          discount: Math.round(((3599 - 899) / 3599) * 100),
          category: "vpn",
          icon: "fas fa-shield-alt",
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "365 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        // VPN Services - NordVPN
        {
          name: "NordVPN",
          fullProductName: "NordVPN - 1 Month (1 Device)",
          subcategory: "NordVPN",
          duration: "1 Month",
          description: "Premium VPN with AES-256 encryption",
          features: "1 Device, AES-256 Encryption",
          price: 169,
          originalPrice: 529,
          discount: Math.round(((529 - 169) / 529) * 100),
          category: "vpn",
          icon: "fas fa-shield-alt",
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "30 Days",
          notes: "",
          popular: true,
          trending: false,
          available: true,
        },
        {
          name: "NordVPN",
          fullProductName: "NordVPN - 3 Months",
          subcategory: "NordVPN",
          duration: "3 Months",
          description: "Global servers with no-logs policy",
          features: "Global Servers, No Logs",
          price: 399,
          originalPrice: 999,
          discount: Math.round(((999 - 399) / 999) * 100),
          category: "vpn",
          icon: "fas fa-shield-alt",
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "90 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        {
          name: "NordVPN",
          fullProductName: "NordVPN - 6 Months",
          subcategory: "NordVPN",
          duration: "6 Months",
          description: "High-speed VPN access with stable connection",
          features: "High-Speed Access, Stable VPN",
          price: 599,
          originalPrice: 1799,
          discount: Math.round(((1799 - 599) / 1799) * 100),
          category: "vpn",
          icon: "fas fa-shield-alt",
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "180 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        {
          name: "NordVPN",
          fullProductName: "NordVPN - 12 Months",
          subcategory: "NordVPN",
          duration: "12 Months",
          description: "All-device support with long-term security",
          features: "All Device Support, Long Term Security",
          price: 999,
          originalPrice: 3999,
          discount: Math.round(((3999 - 999) / 3999) * 100),
          category: "vpn",
          icon: "fas fa-shield-alt",
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "365 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        
        // Streaming Services - Spotify
        {
          name: "Spotify Premium",
          fullProductName: "Spotify - 1 Month",
          subcategory: "Spotify",
          duration: "1 Month",
          description: "Premium music streaming with ad-free experience",
          features: "Premium Streaming, Ad-Free, High Quality",
          price: 79,
          originalPrice: 129,
          discount: Math.round(((129 - 79) / 129) * 100),
          category: "streaming",
          icon: "fab fa-spotify",
          image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "30 Days",
          notes: "",
          popular: true,
          trending: false,
          available: true,
        },
        {
          name: "Spotify Premium",
          fullProductName: "Spotify - 3 Months (New Mail Only)",
          subcategory: "Spotify",
          duration: "3 Months",
          description: "Premium music streaming for new accounts only",
          features: "Only for New Mail, Premium Quality",
          price: 149,
          originalPrice: 389,
          discount: Math.round(((389 - 149) / 389) * 100),
          category: "streaming",
          icon: "fab fa-spotify",
          image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "90 Days",
          notes: "New Email Required",
          popular: false,
          trending: true,
          available: true,
        },
        {
          name: "Spotify Premium",
          fullProductName: "Spotify - 6 Months",
          subcategory: "Spotify",
          duration: "6 Months",
          description: "Premium Spotify with all devices supported",
          features: "Premium, All Devices Supported",
          price: 399,
          originalPrice: 779,
          discount: Math.round(((779 - 399) / 779) * 100),
          category: "streaming",
          icon: "fab fa-spotify",
          image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "180 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        {
          name: "Spotify Premium",
          fullProductName: "Spotify - 12 Months",
          subcategory: "Spotify",
          duration: "12 Months",
          description: "1-year Spotify Premium subscription",
          features: "1 Year Validity, Premium Quality",
          price: 679,
          originalPrice: 1550,
          discount: Math.round(((1550 - 679) / 1550) * 100),
          category: "streaming",
          icon: "fab fa-spotify",
          image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "365 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        
        // Streaming Services - Others
        {
          name: "Gaana Plus",
          fullProductName: "Gaana Plus - 1 Year (Private)",
          subcategory: "Gaana Plus",
          duration: "12 Months",
          description: "Private Gaana Plus account with ad-free music",
          features: "Private Account, Ad-Free Music",
          price: 299,
          originalPrice: 499,
          discount: Math.round(((499 - 299) / 499) * 100),
          category: "streaming",
          icon: "fas fa-music",
          image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "365 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        {
          name: "Audible",
          fullProductName: "Audible - 3 Months Membership",
          subcategory: "Audible",
          duration: "3 Months",
          description: "Audiobook streaming with unlimited listening",
          features: "Audiobook Streaming, Unlimited Listening",
          price: 99,
          originalPrice: 299,
          discount: Math.round(((299 - 99) / 299) * 100),
          category: "streaming",
          icon: "fas fa-headphones",
          image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "90 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        
        // Streaming Services - YouTube Music
        {
          name: "YouTube Music Premium",
          fullProductName: "YouTube Music - 1 Month",
          subcategory: "YouTube Music",
          duration: "1 Month",
          description: "Ad-free music streaming with YouTube Premium included",
          features: "Includes YT Premium, Ad-Free Music",
          price: 49,
          originalPrice: 129,
          discount: Math.round(((129 - 49) / 129) * 100),
          category: "streaming",
          icon: "fab fa-youtube",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "30 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        {
          name: "YouTube Music Premium",
          fullProductName: "YouTube Music - 6 Months",
          subcategory: "YouTube Music",
          duration: "6 Months",
          description: "YouTube Premium with music on all devices",
          features: "Includes YT Premium, All Devices",
          price: 499,
          originalPrice: 774,
          discount: Math.round(((774 - 499) / 774) * 100),
          category: "streaming",
          icon: "fab fa-youtube",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "180 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        {
          name: "YouTube Music Premium",
          fullProductName: "YouTube Music - 12 Months",
          subcategory: "YouTube Music",
          duration: "12 Months",
          description: "Annual YouTube Premium with long validity",
          features: "Includes YT Premium, Long Validity",
          price: 899,
          originalPrice: 1548,
          discount: Math.round(((1548 - 899) / 1548) * 100),
          category: "streaming",
          icon: "fab fa-youtube",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "365 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        
        // Cloud Storage - Google Storage
        {
          name: "Google Cloud Storage",
          fullProductName: "Google Storage - 100GB (6 Months)",
          subcategory: "Google Storage",
          duration: "6 Months",
          description: "100GB secure cloud storage linked to Gmail",
          features: "100GB Cloud Storage, Linked to Gmail",
          price: 499,
          originalPrice: 780,
          discount: Math.round(((780 - 499) / 780) * 100),
          category: "cloud",
          icon: "fab fa-google-drive",
          image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "180 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        {
          name: "Google Cloud Storage",
          fullProductName: "Google Storage - 500GB + Gemini Pro",
          subcategory: "Google Storage",
          duration: "12 Months",
          description: "500GB storage with Gemini Pro AI access",
          features: "500GB Storage + Gemini Pro Access",
          price: 999,
          originalPrice: 1800,
          discount: Math.round(((1800 - 999) / 1800) * 100),
          category: "cloud",
          icon: "fab fa-google-drive",
          image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "365 Days",
          notes: "",
          popular: true,
          trending: false,
          available: true,
        },
        {
          name: "Google Cloud Storage",
          fullProductName: "Google Storage - 1TB + Gemini Pro",
          subcategory: "Google Storage",
          duration: "12 Months",
          description: "1TB cloud storage with Gemini Pro AI tool",
          features: "1TB Cloud + Gemini Pro AI Tool",
          price: 1299,
          originalPrice: 2200,
          discount: Math.round(((2200 - 1299) / 2200) * 100),
          category: "cloud",
          icon: "fab fa-google-drive",
          image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "365 Days",
          notes: "",
          popular: false,
          trending: true,
          available: true,
        },
        {
          name: "Google Gemini Pro",
          fullProductName: "Google Gemini Pro - 2TB Private",
          subcategory: "Google Storage",
          duration: "12 Months",
          description: "Private access with 2TB cloud and Gemini AI",
          features: "Private Access, 2TB Cloud + Gemini AI",
          price: 1499,
          originalPrice: 2999,
          discount: Math.round(((2999 - 1499) / 2999) * 100),
          category: "cloud",
          icon: "fab fa-google-drive",
          image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "365 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        
        // Cloud Storage - TeraBox
        {
          name: "TeraBox Cloud",
          fullProductName: "TeraBox - 1TB (1 Month)",
          subcategory: "TeraBox",
          duration: "1 Month",
          description: "1TB secure cloud storage with fast speeds",
          features: "1TB Secure Cloud, Fast Upload/Download",
          price: 49,
          originalPrice: 149,
          discount: Math.round(((149 - 49) / 149) * 100),
          category: "cloud",
          icon: "fas fa-cloud",
          image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "30 Days",
          notes: "",
          popular: false,
          trending: true,
          available: true,
        },
        {
          name: "TeraBox Cloud",
          fullProductName: "TeraBox - 1TB (3 Months)",
          subcategory: "TeraBox",
          duration: "3 Months",
          description: "1TB storage with premium speed",
          features: "1TB Storage, Premium Speed",
          price: 119,
          originalPrice: 399,
          discount: Math.round(((399 - 119) / 399) * 100),
          category: "cloud",
          icon: "fas fa-cloud",
          image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "90 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        {
          name: "TeraBox Cloud",
          fullProductName: "TeraBox - 1TB (6 Months)",
          subcategory: "TeraBox",
          duration: "6 Months",
          description: "Fast storage access with 1TB limit",
          features: "Fast Storage Access, 1TB Limit",
          price: 199,
          originalPrice: 699,
          discount: Math.round(((699 - 199) / 699) * 100),
          category: "cloud",
          icon: "fas fa-cloud",
          image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "180 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        {
          name: "TeraBox Cloud",
          fullProductName: "TeraBox - 1TB (12 Months)",
          subcategory: "TeraBox",
          duration: "12 Months",
          description: "Private login with long-term cloud storage",
          features: "Private Login, Long-Term Cloud",
          price: 349,
          originalPrice: 1399,
          discount: Math.round(((1399 - 349) / 1399) * 100),
          category: "cloud",
          icon: "fas fa-cloud",
          image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "365 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        
        // OTT Subscriptions - Netflix
        {
          name: "Netflix Premium",
          fullProductName: "Netflix - 1 Month Screen Sharing",
          subcategory: "Netflix",
          duration: "1 Month",
          description: "Premium Netflix subscription with 4K streaming",
          features: "4K Ultra HD, 4 Screens, Screen Sharing",
          price: 99,
          originalPrice: 649,
          discount: Math.round(((649 - 99) / 649) * 100),
          category: "ott",
          icon: "fas fa-play-circle",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "30 Days",
          notes: "",
          popular: true,
          trending: false,
          available: true,
        },
        {
          name: "Netflix Premium",
          fullProductName: "Netflix - 3 Months Premium",
          subcategory: "Netflix",
          duration: "3 Months",
          description: "3-month Netflix Premium with Ultra HD",
          features: "Ultra HD, Multiple Devices, Premium Quality",
          price: 299,
          originalPrice: 1947,
          discount: Math.round(((1947 - 299) / 1947) * 100),
          category: "ott",
          icon: "fas fa-play-circle",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "90 Days",
          notes: "",
          popular: false,
          trending: true,
          available: true,
        },
        
        // OTT Subscriptions - Disney+ Hotstar
        {
          name: "Disney+ Hotstar",
          fullProductName: "Disney+ Hotstar VIP - 1 Year",
          subcategory: "Disney+ Hotstar",
          duration: "12 Months",
          description: "Complete entertainment with sports and movies",
          features: "Live Sports, Movies, TV Shows, VIP Content",
          price: 399,
          originalPrice: 899,
          discount: Math.round(((899 - 399) / 899) * 100),
          category: "ott",
          icon: "fas fa-play-circle",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "365 Days",
          notes: "",
          popular: false,
          trending: true,
          available: true,
        },
        {
          name: "Disney+ Hotstar",
          fullProductName: "Disney+ Hotstar Super - 1 Year",
          subcategory: "Disney+ Hotstar",
          duration: "12 Months",
          description: "Premium Disney+ with all content access",
          features: "4K Content, All Devices, Premium Originals",
          price: 899,
          originalPrice: 1499,
          discount: Math.round(((1499 - 899) / 1499) * 100),
          category: "ott",
          icon: "fas fa-play-circle",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "365 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        
        // OTT Subscriptions - Amazon Prime Video
        {
          name: "Amazon Prime Video",
          fullProductName: "Amazon Prime Video - 3 Months",
          subcategory: "Amazon Prime",
          duration: "3 Months",
          description: "Prime Video with exclusive content and movies",
          features: "HD Streaming, Prime Originals, Movie Library",
          price: 199,
          originalPrice: 459,
          discount: Math.round(((459 - 199) / 459) * 100),
          category: "ott",
          icon: "fab fa-amazon",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "90 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        {
          name: "Amazon Prime Video",
          fullProductName: "Amazon Prime Video - 1 Year",
          subcategory: "Amazon Prime",
          duration: "12 Months",
          description: "Annual Prime Video subscription with full benefits",
          features: "Full Prime Benefits, HD Streaming, Fast Delivery",
          price: 599,
          originalPrice: 1499,
          discount: Math.round(((1499 - 599) / 1499) * 100),
          category: "ott",
          icon: "fab fa-amazon",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "365 Days",
          notes: "",
          popular: true,
          trending: false,
          available: true,
        },
        
        // OTT Subscriptions - SonyLIV
        {
          name: "SonyLIV Premium",
          fullProductName: "SonyLIV Premium - 1 Year",
          subcategory: "SonyLIV",
          duration: "12 Months",
          description: "Premium SonyLIV with sports and movies",
          features: "Live Sports, Movies, TV Shows, Ad-Free",
          price: 299,
          originalPrice: 999,
          discount: Math.round(((999 - 299) / 999) * 100),
          category: "ott",
          icon: "fas fa-play-circle",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "365 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        
        // OTT Subscriptions - Zee5
        {
          name: "Zee5 Premium",
          fullProductName: "Zee5 Premium - 1 Year",
          subcategory: "Zee5",
          duration: "12 Months",
          description: "Zee5 Premium with regional content and movies",
          features: "Regional Content, Movies, TV Shows, Ad-Free",
          price: 199,
          originalPrice: 999,
          discount: Math.round(((999 - 199) / 999) * 100),
          category: "ott",
          icon: "fas fa-play-circle",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "365 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
        
        // OTT Subscriptions - Alt Balaji
        {
          name: "Alt Balaji",
          fullProductName: "Alt Balaji - 1 Year Premium",
          subcategory: "Alt Balaji",
          duration: "12 Months",
          description: "Alt Balaji Premium with exclusive web series",
          features: "Exclusive Web Series, HD Quality, Multiple Devices",
          price: 149,
          originalPrice: 300,
          discount: Math.round(((300 - 149) / 300) * 100),
          category: "ott",
          icon: "fas fa-play-circle",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "365 Days",
          notes: "",
          popular: false,
          trending: false,
          available: true,
        },
      ];

      await db.insert(products).values(productData);

      // Seed testimonials
      const testimonialData: InsertTestimonial[] = [
        {
          name: "Rahul Sharma",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
          rating: 5,
          review: "Got Netflix Premium for just ₹99! Works perfectly, instant delivery. Highly recommended service.",
          featured: true,
        },
        {
          name: "Priya Patel",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b48d7e73?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
          rating: 5,
          review: "Amazing prices for ChatGPT Plus! Saved hundreds of rupees. Customer support is excellent.",
          featured: true,
        },
        {
          name: "Arjun Singh",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
          rating: 5,
          review: "Been using their services for 6 months. All accounts work perfectly. Very reliable!",
          featured: true,
        },
      ];

      await db.insert(testimonials).values(testimonialData);

      // Seed blog posts
      const blogPostData: InsertBlogPost[] = [
        {
          title: "Top 10 AI Tools Every Creator Needs in 2024",
          slug: "top-ai-tools-creators-2024",
          excerpt: "Discover the most powerful AI tools that can revolutionize your creative workflow and boost productivity.",
          content: "Full blog post content here...",
          image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          category: "AI TOOLS",
          featured: true,
        },
        {
          title: "How to Use Shared OTT Subscriptions Safely",
          slug: "shared-ott-subscriptions-safely",
          excerpt: "Learn the best practices for using shared streaming accounts while maintaining security and compliance.",
          content: "Full blog post content here...",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          category: "STREAMING",
          featured: true,
        },
        {
          title: "Cloud Storage Solutions: Which One is Right for You?",
          slug: "cloud-storage-solutions-guide",
          excerpt: "Compare different cloud storage options and find the perfect solution for your personal or business needs.",
          content: "Full blog post content here...",
          image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          category: "PRODUCTIVITY",
          featured: true,
        },
      ];

      await db.insert(blogPosts).values(blogPostData);
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  }

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

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.featured, true));
  }

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
      .where(and(eq(reviews.productId, productId), eq(reviews.isPublished, true)));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(insertReview)
      .returning();
    return review;
  }

  async updateReviewStatus(id: string, isPublished: boolean): Promise<void> {
    await db.update(reviews)
      .set({ isPublished, updatedAt: new Date().toISOString() })
      .where(eq(reviews.id, id));
  }
}

export const storage = new DatabaseStorage();