import { type Product, type InsertProduct, type Category, type InsertCategory, type Order, type InsertOrder, type Testimonial, type InsertTestimonial, type BlogPost, type InsertBlogPost, type Review, type InsertReview, type User, type UpsertUser } from "@shared/schema";
import { nanoid } from "nanoid";

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

  // Users
  getAllUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, user: UpsertUser): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private categories: Category[] = [];
  private products: Product[] = [];
  private orders: Order[] = [];
  private testimonials: Testimonial[] = [];
  private blogPosts: BlogPost[] = [];
  private reviews: Review[] = [];
  private users: User[] = [];

  constructor() {
    this.seedData();
  }

  private async seedData() {
    // Seed categories
    this.categories = [
      { id: "ott", name: "OTT Subscriptions", slug: "ott", description: "Premium video streaming platforms", icon: "fas fa-play-circle" },
      { id: "vpn", name: "VPN Services", slug: "vpn", description: "Secure browsing solutions", icon: "fas fa-shield-alt" },
      { id: "cloud", name: "Cloud Storage", slug: "cloud", description: "Cloud storage solutions", icon: "fas fa-cloud" },
      { id: "streaming", name: "Streaming Services", slug: "streaming", description: "Music and audio streaming", icon: "fas fa-music" },
    ];

    // Seed authentic products from CSV catalogues
    this.products = [
      // OTT Platforms - Netflix
      {
        id: nanoid(),
        name: "Netflix Premium",
        fullProductName: "Netflix - 1 Month Premium",
        subcategory: "Netflix",
        duration: "1 Month",
        description: "Premium Netflix subscription with 4K Ultra HD streaming",
        features: "4K Ultra HD, Multiple Screens, Download Content, Ad-Free",
        price: 199,
        originalPrice: 649,
        discount: Math.round(((649 - 199) / 649) * 100),
        category: "ott",
        icon: "fas fa-play-circle",
        image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "30 Days",
        notes: "",
        popular: true,
        trending: false,
        available: true,
      },
      {
        id: nanoid(),
        name: "Netflix Premium",
        fullProductName: "Netflix - 3 Months Premium",
        subcategory: "Netflix",
        duration: "3 Months",
        description: "Extended Netflix Premium with unlimited streaming",
        features: "4K Ultra HD, 4 Screens, Download, No Ads",
        price: 499,
        originalPrice: 1947,
        discount: Math.round(((1947 - 499) / 1947) * 100),
        category: "ott",
        icon: "fas fa-play-circle",
        image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "90 Days",
        notes: "",
        popular: false,
        trending: true,
        available: true,
      },
      {
        id: nanoid(),
        name: "Netflix Premium",
        fullProductName: "Netflix - 6 Months Premium",
        subcategory: "Netflix",
        duration: "6 Months",
        description: "Long-term Netflix Premium subscription",
        features: "4K UHD, Multiple Devices, Family Sharing",
        price: 899,
        originalPrice: 3894,
        discount: Math.round(((3894 - 899) / 3894) * 100),
        category: "ott",
        icon: "fas fa-play-circle",
        image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "180 Days",
        notes: "",
        popular: false,
        trending: false,
        available: true,
      },
      
      // OTT Platforms - Amazon Prime Video
      {
        id: nanoid(),
        name: "Amazon Prime Video",
        fullProductName: "Prime Video - 1 Month",
        subcategory: "Prime Video",
        duration: "1 Month",
        description: "Amazon Prime Video with exclusive shows and movies",
        features: "HD Streaming, Prime Originals, Multi-Device Access",
        price: 129,
        originalPrice: 299,
        discount: Math.round(((299 - 129) / 299) * 100),
        category: "ott",
        icon: "fas fa-play-circle",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "30 Days",
        notes: "",
        popular: true,
        trending: false,
        available: true,
      },
      {
        id: nanoid(),
        name: "Amazon Prime Video",
        fullProductName: "Prime Video - 3 Months",
        subcategory: "Prime Video",
        duration: "3 Months",
        description: "Extended Prime Video access with latest content",
        features: "HD/FHD Streaming, Exclusive Content, Download",
        price: 299,
        originalPrice: 897,
        discount: Math.round(((897 - 299) / 897) * 100),
        category: "ott",
        icon: "fas fa-play-circle",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "90 Days",
        notes: "",
        popular: false,
        trending: false,
        available: true,
      },
      {
        id: nanoid(),
        name: "Amazon Prime Video",
        fullProductName: "Prime Video - 12 Months",
        subcategory: "Prime Video",
        duration: "12 Months",
        description: "Annual Prime Video subscription with full benefits",
        features: "Full HD, Prime Originals, Family Sharing, Offline",
        price: 999,
        originalPrice: 3588,
        discount: Math.round(((3588 - 999) / 3588) * 100),
        category: "ott",
        icon: "fas fa-play-circle",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "365 Days",
        notes: "",
        popular: true,
        trending: false,
        available: true,
      },

      // OTT Platforms - Disney+ Hotstar
      {
        id: nanoid(),
        name: "Disney+ Hotstar",
        fullProductName: "Disney+ Hotstar - 1 Month Premium",
        subcategory: "Disney+ Hotstar",
        duration: "1 Month",
        description: "Disney+ Hotstar Premium with sports and movies",
        features: "4K Content, Live Sports, Disney Originals, No Ads",
        price: 99,
        originalPrice: 299,
        discount: Math.round(((299 - 99) / 299) * 100),
        category: "ott",
        icon: "fas fa-play-circle",
        image: "https://images.unsplash.com/photo-1489599362967-97fb7d0b16b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "30 Days",
        notes: "",
        popular: false,
        trending: false,
        available: true,
      },
      {
        id: nanoid(),
        name: "Disney+ Hotstar",
        fullProductName: "Disney+ Hotstar - 6 Months Premium",
        subcategory: "Disney+ Hotstar",
        duration: "6 Months",
        description: "Long-term Disney+ Hotstar with complete access",
        features: "4K Streaming, IPL Live, Marvel & Disney Content",
        price: 399,
        originalPrice: 1794,
        discount: Math.round(((1794 - 399) / 1794) * 100),
        category: "ott",
        icon: "fas fa-play-circle",
        image: "https://images.unsplash.com/photo-1489599362967-97fb7d0b16b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "180 Days",
        notes: "",
        popular: true,
        trending: false,
        available: true,
      },
      {
        id: nanoid(),
        name: "Disney+ Hotstar",
        fullProductName: "Disney+ Hotstar - 12 Months Premium",
        subcategory: "Disney+ Hotstar",
        duration: "12 Months",
        description: "Annual Disney+ Hotstar Premium subscription",
        features: "4K Quality, All Sports, Complete Library, Multi-Device",
        price: 699,
        originalPrice: 3588,
        discount: Math.round(((3588 - 699) / 3588) * 100),
        category: "ott",
        icon: "fas fa-play-circle",
        image: "https://images.unsplash.com/photo-1489599362967-97fb7d0b16b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "365 Days",
        notes: "",
        popular: false,
        trending: true,
        available: true,
      },

      // OTT Platforms - Sony LIV
      {
        id: nanoid(),
        name: "Sony LIV Premium",
        fullProductName: "Sony LIV - 1 Month Premium",
        subcategory: "Sony LIV",
        duration: "1 Month",
        description: "Sony LIV Premium with live TV and originals",
        features: "HD Streaming, Live Sports, Sony Originals, Ad-Free",
        price: 79,
        originalPrice: 299,
        discount: Math.round(((299 - 79) / 299) * 100),
        category: "ott",
        icon: "fas fa-play-circle",
        image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "30 Days",
        notes: "",
        popular: false,
        trending: false,
        available: true,
      },
      {
        id: nanoid(),
        name: "Sony LIV Premium",
        fullProductName: "Sony LIV - 6 Months Premium",
        subcategory: "Sony LIV",
        duration: "6 Months",
        description: "Extended Sony LIV access with complete content",
        features: "Full HD, Live Cricket, WWE, Bollywood Movies",
        price: 399,
        originalPrice: 1794,
        discount: Math.round(((1794 - 399) / 1794) * 100),
        category: "ott",
        icon: "fas fa-play-circle",
        image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "180 Days",
        notes: "",
        popular: false,
        trending: false,
        available: true,
      },

      // OTT Platforms - ZEE5
      {
        id: nanoid(),
        name: "ZEE5 Premium",
        fullProductName: "ZEE5 - 1 Month Premium",
        subcategory: "ZEE5",
        duration: "1 Month",
        description: "ZEE5 Premium with regional content and originals",
        features: "HD Quality, Regional Content, ZEE5 Originals, Download",
        price: 69,
        originalPrice: 99,
        discount: Math.round(((99 - 69) / 99) * 100),
        category: "ott",
        icon: "fas fa-play-circle",
        image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "30 Days",
        notes: "",
        popular: false,
        trending: false,
        available: true,
      },
      {
        id: nanoid(),
        name: "ZEE5 Premium",
        fullProductName: "ZEE5 - 12 Months Premium",
        subcategory: "ZEE5",
        duration: "12 Months",
        description: "Annual ZEE5 Premium with complete access",
        features: "Full HD, All Languages, Premium Content, Ad-Free",
        price: 499,
        originalPrice: 1188,
        discount: Math.round(((1188 - 499) / 1188) * 100),
        category: "ott",
        icon: "fas fa-play-circle",
        image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "365 Days",
        notes: "",
        popular: false,
        trending: false,
        available: true,
      },

      // OTT Platforms - Voot Select
      {
        id: nanoid(),
        name: "Voot Select",
        fullProductName: "Voot Select - 1 Month Premium",
        subcategory: "Voot Select",
        duration: "1 Month",
        description: "Voot Select Premium with Bigg Boss and exclusive shows",
        features: "HD Streaming, Bigg Boss Live, Colors Content, Ad-Free",
        price: 89,
        originalPrice: 99,
        discount: Math.round(((99 - 89) / 99) * 100),
        category: "ott",
        icon: "fas fa-play-circle",
        image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "30 Days",
        notes: "",
        popular: false,
        trending: false,
        available: true,
      },

      // VPN Services - Surfshark
      {
        id: nanoid(),
        name: "Surfshark VPN",
        fullProductName: "Surfshark - 1 Month (1 Device)",
        subcategory: "Surfshark",
        duration: "1 Month",
        description: "Premium VPN service with military-grade encryption and unlimited bandwidth",
        features: "1 Device, High-Speed VPN Access, Kill Switch, No-logs Policy",
        price: 149,
        originalPrice: 429,
        discount: Math.round(((429 - 149) / 429) * 100),
        category: "vpn",
        icon: "fas fa-shield-alt",
        image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "30 Days",
        notes: "",
        popular: true,
        trending: false,
        available: true,
      },
      {
        id: nanoid(),
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
        id: nanoid(),
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
        id: nanoid(),
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
        id: nanoid(),
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
        id: nanoid(),
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
        id: nanoid(),
        name: "NordVPN",
        fullProductName: "NordVPN - 6 Months",
        subcategory: "NordVPN",
        duration: "6 Months",
        description: "High-speed access with stable VPN connection",
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
        id: nanoid(),
        name: "NordVPN",
        fullProductName: "NordVPN - 12 Months",
        subcategory: "NordVPN",
        duration: "12 Months",
        description: "All device support with long-term security",
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
      // Cloud Storage - Google Storage
      {
        id: nanoid(),
        name: "Google Storage",
        fullProductName: "Google Storage - 100GB (6 Months)",
        subcategory: "Google Storage",
        duration: "6 Months",
        description: "100GB cloud storage linked to Gmail",
        features: "100GB Cloud Storage, Linked to Gmail",
        price: 499,
        originalPrice: 780,
        discount: Math.round(((780 - 499) / 780) * 100),
        category: "cloud",
        icon: "fas fa-cloud",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "180 Days",
        notes: "",
        popular: true,
        trending: false,
        available: true,
      },
      {
        id: nanoid(),
        name: "Google Storage + Gemini Pro",
        fullProductName: "Google Storage - 500GB + Gemini Pro",
        subcategory: "Google Storage",
        duration: "12 Months",
        description: "500GB storage with AI-powered Gemini Pro access",
        features: "500GB Storage + Gemini Pro Access",
        price: 999,
        originalPrice: 1800,
        discount: Math.round(((1800 - 999) / 1800) * 100),
        category: "cloud",
        icon: "fas fa-cloud",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "365 Days",
        notes: "",
        popular: false,
        trending: true,
        available: true,
      },
      {
        id: nanoid(),
        name: "Google Storage + Gemini Pro",
        fullProductName: "Google Storage - 1TB + Gemini Pro",
        subcategory: "Google Storage",
        duration: "12 Months",
        description: "1TB cloud storage with Gemini Pro AI tool",
        features: "1TB Cloud + Gemini Pro AI Tool",
        price: 1299,
        originalPrice: 2200,
        discount: Math.round(((2200 - 1299) / 2200) * 100),
        category: "cloud",
        icon: "fas fa-cloud",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "365 Days",
        notes: "",
        popular: true,
        trending: false,
        available: true,
      },
      {
        id: nanoid(),
        name: "Google Gemini Pro Private",
        fullProductName: "Google Gemini Pro - 2TB Private",
        subcategory: "Google Storage",
        duration: "12 Months",
        description: "Private access with 2TB cloud and Gemini AI",
        features: "Private Access, 2TB Cloud + Gemini AI",
        price: 1499,
        originalPrice: 2999,
        discount: Math.round(((2999 - 1499) / 2999) * 100),
        category: "cloud",
        icon: "fas fa-cloud",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "365 Days",
        notes: "",
        popular: false,
        trending: true,
        available: true,
      },
      // Cloud Storage - TeraBox
      {
        id: nanoid(),
        name: "TeraBox",
        fullProductName: "TeraBox - 1TB (1 Month)",
        subcategory: "TeraBox",
        duration: "1 Month",
        description: "1TB secure cloud with fast upload/download",
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
        trending: false,
        available: true,
      },
      {
        id: nanoid(),
        name: "TeraBox",
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
        popular: true,
        trending: false,
        available: true,
      },
      {
        id: nanoid(),
        name: "TeraBox",
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
        id: nanoid(),
        name: "TeraBox",
        fullProductName: "TeraBox - 1TB (12 Months)",
        subcategory: "TeraBox",
        duration: "12 Months",
        description: "Private login with long-term cloud access",
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
      // Streaming Services - Spotify
      {
        id: nanoid(),
        name: "Spotify Premium",
        fullProductName: "Spotify - 1 Month",
        subcategory: "Spotify",
        duration: "1 Month",
        description: "Premium streaming with ad-free, high quality music",
        features: "Premium Streaming, Ad-Free, High Quality",
        price: 79,
        originalPrice: 129,
        discount: Math.round(((129 - 79) / 129) * 100),
        category: "streaming",
        icon: "fas fa-music",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "30 Days",
        notes: "",
        popular: true,
        trending: false,
        available: true,
      },
      {
        id: nanoid(),
        name: "Spotify Premium",
        fullProductName: "Spotify - 3 Months (New Mail Only)",
        subcategory: "Spotify",
        duration: "3 Months",
        description: "Premium quality for new email accounts only",
        features: "Only for New Mail, Premium Quality",
        price: 149,
        originalPrice: 389,
        discount: Math.round(((389 - 149) / 389) * 100),
        category: "streaming",
        icon: "fas fa-music",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "90 Days",
        notes: "New Email Required",
        popular: false,
        trending: false,
        available: true,
      },
      {
        id: nanoid(),
        name: "Spotify Premium",
        fullProductName: "Spotify - 6 Months",
        subcategory: "Spotify",
        duration: "6 Months",
        description: "Premium with all devices supported",
        features: "Premium, All Devices Supported",
        price: 399,
        originalPrice: 779,
        discount: Math.round(((779 - 399) / 779) * 100),
        category: "streaming",
        icon: "fas fa-music",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "180 Days",
        notes: "",
        popular: false,
        trending: true,
        available: true,
      },
      {
        id: nanoid(),
        name: "Spotify Premium",
        fullProductName: "Spotify - 12 Months",
        subcategory: "Spotify",
        duration: "12 Months",
        description: "1 year validity with premium quality",
        features: "1 Year Validity, Premium Quality",
        price: 679,
        originalPrice: 1550,
        discount: Math.round(((1550 - 679) / 1550) * 100),
        category: "streaming",
        icon: "fas fa-music",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "365 Days",
        notes: "",
        popular: true,
        trending: false,
        available: true,
      },
      // Streaming Services - Gaana Plus
      {
        id: nanoid(),
        name: "Gaana Plus",
        fullProductName: "Gaana Plus - 1 Year (Private)",
        subcategory: "Gaana Plus",
        duration: "12 Months",
        description: "Private account with ad-free music streaming",
        features: "Private Account, Ad-Free Music",
        price: 299,
        originalPrice: 499,
        discount: Math.round(((499 - 299) / 499) * 100),
        category: "streaming",
        icon: "fas fa-music",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "365 Days",
        notes: "",
        popular: false,
        trending: false,
        available: true,
      },
      // Streaming Services - Audible
      {
        id: nanoid(),
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
        icon: "fas fa-music",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "90 Days",
        notes: "",
        popular: false,
        trending: false,
        available: true,
      },
      // Streaming Services - YouTube Music
      {
        id: nanoid(),
        name: "YouTube Music",
        fullProductName: "YouTube Music - 1 Month",
        subcategory: "YouTube Music",
        duration: "1 Month",
        description: "Includes YouTube Premium with ad-free music",
        features: "Includes YT Premium, Ad-Free Music",
        price: 49,
        originalPrice: 129,
        discount: Math.round(((129 - 49) / 129) * 100),
        category: "streaming",
        icon: "fas fa-music",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "30 Days",
        notes: "",
        popular: true,
        trending: false,
        available: true,
      },
      {
        id: nanoid(),
        name: "YouTube Music",
        fullProductName: "YouTube Music - 6 Months",
        subcategory: "YouTube Music",
        duration: "6 Months",
        description: "Includes YouTube Premium on all devices",
        features: "Includes YT Premium, All Devices",
        price: 499,
        originalPrice: 774,
        discount: Math.round(((774 - 499) / 774) * 100),
        category: "streaming",
        icon: "fas fa-music",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "180 Days",
        notes: "",
        popular: false,
        trending: false,
        available: true,
      },
      {
        id: nanoid(),
        name: "YouTube Music",
        fullProductName: "YouTube Music - 12 Months",
        subcategory: "YouTube Music",
        duration: "12 Months",
        description: "Includes YouTube Premium with long validity",
        features: "Includes YT Premium, Long Validity",
        price: 899,
        originalPrice: 1548,
        discount: Math.round(((1548 - 899) / 1548) * 100),
        category: "streaming",
        icon: "fas fa-music",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "365 Days",
        notes: "",
        popular: false,
        trending: true,
        available: true,
      },
    ];

    // Seed testimonials
    this.testimonials = [
      { id: nanoid(), name: "Rajesh Kumar", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", rating: 5, review: "Amazing service! Got my Netflix subscription instantly.", featured: true },
      { id: nanoid(), name: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=150", rating: 5, review: "Best prices for premium digital services. Highly recommended!", featured: true },
      { id: nanoid(), name: "Amit Singh", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", rating: 4, review: "Quick delivery and excellent customer support.", featured: false },
    ];

    // Seed blog posts
    this.blogPosts = [
      { id: nanoid(), title: "Best VPN Services for 2024", slug: "best-vpn-services-2024", excerpt: "Compare top VPN services and find the perfect match for your needs.", content: "Full blog content here...", featured: true, publishedAt: new Date(), author: "Tech Team" },
      { id: nanoid(), title: "Cloud Storage Buying Guide", slug: "cloud-storage-guide", excerpt: "Everything you need to know about choosing cloud storage.", content: "Full blog content here...", featured: false, publishedAt: new Date(), author: "Storage Expert" },
    ];

    // Seed sample reviews
    this.reviews = [
      {
        id: nanoid(),
        productId: this.products[0].id,
        customerName: "Arjun Patel",
        customerEmail: "arjun@example.com",
        rating: 5,
        title: "Excellent VPN Service",
        comment: "Surfshark VPN works perfectly. Fast speeds and reliable connection. Great value for money!",
        isVerified: true,
        isPublished: true,
        createdAt: new Date(),
      },
      {
        id: nanoid(),
        productId: this.products[8].id,
        customerName: "Sneha Reddy",
        rating: 4,
        title: "Good cloud storage deal",
        comment: "Google Storage is reliable and affordable. Quick activation and works as expected.",
        isVerified: false,
        isPublished: true,
        createdAt: new Date(),
      },
      {
        id: nanoid(),
        productId: this.products[17].id,
        customerName: "Vikram Joshi",
        customerEmail: "vikram@example.com",
        rating: 5,
        title: "Perfect music streaming",
        comment: "Spotify Premium is amazing. Ad-free music and great quality. Highly recommend!",
        isVerified: true,
        isPublished: true,
        createdAt: new Date(),
      },
    ];
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.products.filter(p => p.category === category);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = { id: nanoid(), ...product };
    this.products.push(newProduct);
    return newProduct;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return this.categories;
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.find(c => c.id === id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = { id: nanoid(), ...category };
    this.categories.push(newCategory);
    return newCategory;
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return this.orders;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.find(o => o.id === id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder: Order = { id: nanoid(), ...order, createdAt: new Date() };
    this.orders.push(newOrder);
    return newOrder;
  }

  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return this.testimonials;
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return this.testimonials.filter(t => t.featured);
  }

  // Blog methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return this.blogPosts;
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return this.blogPosts.filter(b => b.featured);
  }

  // Review methods
  async getReviews(): Promise<Review[]> {
    return this.reviews;
  }

  async getReviewsByProduct(productId: string): Promise<Review[]> {
    return this.reviews.filter(r => r.productId === productId);
  }

  async getPublishedReviews(): Promise<Review[]> {
    return this.reviews.filter(r => r.isPublished);
  }

  async getPublishedReviewsByProduct(productId: string): Promise<Review[]> {
    return this.reviews.filter(r => r.productId === productId && r.isPublished);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const newReview: Review = { 
      id: nanoid(), 
      ...review, 
      createdAt: new Date(),
      isPublished: false // Start as unpublished for moderation
    };
    this.reviews.push(newReview);
    return newReview;
  }

  async updateReviewStatus(id: string, isPublished: boolean): Promise<void> {
    const review = this.reviews.find(r => r.id === id);
    if (review) {
      review.isPublished = isPublished;
    }
  }
}

// Admin and Analytics functionality
export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalReviews: number;
  averageRating: number;
  conversionRate: number;
  revenueGrowth: number;
  orderGrowth: number;
}

export interface ChartData {
  name: string;
  value: number;
  revenue?: number;
  orders?: number;
  users?: number;
  pageViews?: number;
}

// Enhanced storage with analytics
class MemStorageWithAnalytics extends MemStorage {
  private analytics: any[] = [];
  private adminLogs: any[] = [];

  // Analytics methods
  trackEvent(event: string, data: any = {}, userId?: string, sessionId?: string) {
    this.analytics.push({
      id: this.generateId(),
      event,
      data,
      userId,
      sessionId,
      ipAddress: '127.0.0.1',
      userAgent: 'Browser',
      createdAt: new Date(),
    });
  }

  getAnalytics(days: number = 30): any[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return this.analytics.filter(a => new Date(a.createdAt) >= cutoff);
  }

  // Admin dashboard stats
  getAdminStats(days: number = 30): AdminStats {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    const recentOrders = this.orders.filter(o => new Date(o.createdAt) >= cutoff);
    const totalRevenue = recentOrders.reduce((sum, order) => sum + order.amount, 0);
    const totalOrders = recentOrders.length;
    
    // Previous period for comparison
    const prevCutoff = new Date(cutoff);
    prevCutoff.setDate(prevCutoff.getDate() - days);
    const prevOrders = this.orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= prevCutoff && orderDate < cutoff;
    });
    const prevRevenue = prevOrders.reduce((sum, order) => sum + order.amount, 0);
    
    const reviews = this.reviews.filter(r => r.isVerified && !r.isHidden);
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    // Calculate conversion rate (orders / unique page views)
    const pageViews = this.getAnalytics(days).filter(a => a.event === 'page_view').length;
    const conversionRate = pageViews > 0 ? (totalOrders / pageViews) * 100 : 0;

    return {
      totalRevenue,
      totalOrders,
      totalProducts: this.products.length,
      totalReviews: reviews.length,
      averageRating,
      conversionRate,
      revenueGrowth: prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0,
      orderGrowth: prevOrders.length > 0 ? ((totalOrders - prevOrders.length) / prevOrders.length) * 100 : 0,
    };
  }

  getRevenueChartData(days: number = 30): ChartData[] {
    const data: { [key: string]: number } = {};
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    this.orders
      .filter(o => new Date(o.createdAt) >= cutoff)
      .forEach(order => {
        const date = new Date(order.createdAt).toLocaleDateString();
        data[date] = (data[date] || 0) + order.amount;
      });

    return Object.entries(data).map(([name, revenue]) => ({ name, revenue }));
  }

  getOrdersChartData(days: number = 30): ChartData[] {
    const data: { [key: string]: number } = {};
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    this.orders
      .filter(o => new Date(o.createdAt) >= cutoff)
      .forEach(order => {
        const date = new Date(order.createdAt).toLocaleDateString();
        data[date] = (data[date] || 0) + 1;
      });

    return Object.entries(data).map(([name, orders]) => ({ name, orders }));
  }

  getProductsChartData(days: number = 30): ChartData[] {
    const categoryData: { [key: string]: number } = {};
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    this.orders
      .filter(o => new Date(o.createdAt) >= cutoff)
      .forEach(order => {
        const product = this.products.find(p => p.id === order.productId);
        if (product) {
          const category = this.categories.find(c => c.id === product.category);
          const categoryName = category?.name || 'Other';
          categoryData[categoryName] = (categoryData[categoryName] || 0) + order.amount;
        }
      });

    return Object.entries(categoryData).map(([name, value]) => ({ name, value }));
  }

  getTopProducts(days: number = 30): any[] {
    const productData: { [key: string]: { revenue: number; orders: number; name: string } } = {};
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    this.orders
      .filter(o => new Date(o.createdAt) >= cutoff)
      .forEach(order => {
        const product = this.products.find(p => p.id === order.productId);
        if (product) {
          if (!productData[product.id]) {
            productData[product.id] = { revenue: 0, orders: 0, name: product.name };
          }
          productData[product.id].revenue += order.amount;
          productData[product.id].orders += 1;
        }
      });

    return Object.values(productData)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }

  getRecentOrders(limit: number = 20): any[] {
    return this.orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
      .map(order => {
        const product = this.products.find(p => p.id === order.productId);
        return {
          ...order,
          product: product?.name || 'Unknown Product',
        };
      });
  }

  logAdminAction(adminId: string, action: string, target?: string, details: any = {}) {
    this.adminLogs.push({
      id: this.generateId(),
      adminId,
      action,
      target,
      details,
      ipAddress: '127.0.0.1',
      createdAt: new Date(),
    });
  }

  // User Management Methods
  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      id: nanoid(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async updateUser(id: string, userData: UpsertUser): Promise<User> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date(),
    };
    
    return this.users[userIndex];
  }

  async deleteUser(id: string): Promise<void> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    this.users.splice(userIndex, 1);
  }

  async deleteAllProducts(): Promise<void> {
    this.products = [];
  }
}

export const storage = new MemStorageWithAnalytics();