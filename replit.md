# MTS Digital Services - Replit Configuration

## Overview

MTS Digital Services is a full-stack e-commerce platform for selling digital services and subscriptions (Netflix, Prime Video, AI tools, etc.) at affordable prices. The application uses a modern React frontend with a Node.js/Express backend, featuring a clean product catalog, checkout system, and customer management functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**
-
-
-
-
-
-
-
-
-
-
-    TanStack Query (React Query) for server state
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture  
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with JSON responses
- **Development**: TSX for TypeScript execution in development
- **Production**: ESBuild for optimized bundling

### Database & ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with migrations
- **Schema**: Centralized in `/shared/schema.ts` for type safety
- **Validation**: Zod schemas derived from Drizzle tables

## Key Components

### Data Models
- **Products**: Digital services with detailed specifications including duration, features, activation time, warranty, and pricing
- **Categories**: Four main service groupings (OTT Subscriptions, VPN Services, Cloud Storage, Streaming Services)
- **Orders**: Purchase records with payment method and WhatsApp integration
- **Testimonials**: Customer reviews and ratings
- **Reviews**: Comprehensive customer review system with star ratings, verification, and moderation
- **Blog Posts**: Content marketing articles

### Recent Changes (August 6, 2025)
- ✅ **PRODUCTION MODE DEPLOYMENT** - Successfully deployed theater hero website in production mode for custom domain access
- ✅ **API-BASED DATA ARCHITECTURE** - Replaced JSON imports with real-time API fetching using useEffect and fetch patterns
- ✅ **DATABASE VERIFICATION** - Confirmed PostgreSQL database structure with 133 products, 16 categories properly stored
- ✅ **THEATER HERO EXPERIENCE** - Full cinematic website with Winter Theatre Performance video, sparkle effects, and premium UI
- ✅ **ZERO DEPENDENCIES ON STATIC DATA** - All product and category data now fetched dynamically from /api/products and /api/categories

### Previous Changes (February 6, 2025)
- ✓ **EMAIL & OTP AUTHENTICATION SYSTEM** - Complete passwordless authentication replacing Replit Auth with secure email verification, 6-digit OTP codes, session management, and user profiles
- ✓ **PROFESSIONAL LOGIN MODAL** - Modern authentication interface with email-first approach, OTP verification, loading states, and comprehensive error handling
- ✓ **USER MENU COMPONENT** - Complete user dropdown with profile display, settings access, logout functionality, and responsive design
- ✓ **DEPLOYMENT HEALTH MONITORING** - Advanced deployment status dashboard with real-time API endpoint monitoring, database connection verification, and comprehensive troubleshooting tools
- ✓ **PRODUCTION-READY BUILD SYSTEM** - Optimized build configuration with environment-specific logging, health checks, and deployment verification endpoints

### Previous Changes (February 5, 2025)
- ✓ **COMPLETE IMB PAYMENT GATEWAY INTEGRATION** - Fully functional end-to-end payment processing with secure IMB API integration, real-time transaction handling, and database storage
- ✓ **PROFESSIONAL CHECKOUT FLOW** - Advanced checkout modal with customer information forms, payment validation, and secure payment processing with loading states
- ✓ **PAYMENT SUCCESS & ERROR HANDLING** - Comprehensive payment success page with order tracking, transaction details, and professional error handling for failed payments
- ✓ **WHATSAPP POST-PURCHASE INTEGRATION** - Automatic WhatsApp message generation with order details, product information, and customer support contact after successful payments
- ✓ **DATABASE-DRIVEN ARCHITECTURE** - Switched from memory storage to PostgreSQL database with proper CRUD operations, order management, and payment tracking
- ✓ **COMPREHENSIVE WELCOME SCREEN** - Professional animated welcome page with sliding hero sections, category previews, feature highlights, and smooth navigation transitions
- ✓ **FULLY INTEGRATED ADMIN DASHBOARD** - Business-ready admin panel with real-time product management, category overview, order tracking, and comprehensive statistics
- ✓ **OPTIMIZED PRODUCT STRUCTURE** - Restructured OTT products using platform names (Netflix, Amazon Prime, Disney+, Sony LIV, ZEE5) as subcategories for better navigation
- ✓ **COMPLETE DIGITAL CATALOG INTEGRATION** - Added 26+ products from Digital Products Catalog across ADULT, MARKETING, COURSES, and STREAMING SERVICES categories
- ✓ **SEAMLESS FRONTEND-BACKEND INTEGRATION** - Zero runtime errors with proper data flow, error handling, and smooth page transitions throughout the application

### Previous Changes (February 2, 2025)
- ✓ **CRITICAL FIX: Product Management System** - Completely rebuilt admin dashboard with proper state management, no auto-refresh conflicts
- ✓ **User Management & Rights System** - Added comprehensive user management with role-based permissions (Admin, Moderator, User)
- ✓ **Optimized Form Controls** - Fixed all form inputs to use controlled components with proper onChange handlers
- ✓ **Manual Refresh System** - Implemented manual-only data refresh to prevent form conflicts and unwanted updates
- ✓ **Business-Ready Admin Dashboard** - Production-optimized admin interface with full CRUD operations working perfectly
- ✓ **Granular User Permissions** - Added specific permission controls for products, users, orders, and reviews management
- ✓ **Enhanced Security Model** - Implemented proper user roles with admin access controls and permission enforcement
- ✓ **Professional User Interface** - Modern, responsive admin dashboard with comprehensive business management tools
- ✓ **Fixed Product Editing** - Product forms now properly save, edit, and update without conflicts or errors
- ✓ **Real-time Business Operations** - All admin functions work seamlessly for business management and operations

### Previous Changes (February 1, 2025)
- ✓ **WordPress-Style Navigation Restructure** - Removed all products from home page, keeping only popular/trending items and categories
- ✓ **Separate Category Pages** - Created individual category pages (/category/ott, /category/vpn, etc.) showing unique products without variants
- ✓ **Product Variant Pages** - Built dedicated variant pages (/product/netflix, /product/surfshark) with comprehensive plan comparisons
- ✓ **Advanced Admin Dashboard** - Implemented comprehensive admin panel with analytics, order management, and business insights accessible via /admin
- ✓ **Full Responsive Design** - Made entire platform fully responsive for mobile, tablet, and desktop users including admin dashboard
- ✓ **Authentic Service Icons** - Added original brand icons for Spotify, YouTube, YouTube Music, Amazon Prime Video, ZEE5, Sony, and Gagana Plus
- ✓ **Professional Business Metrics** - Key performance indicators including conversion rates, average ratings, and growth statistics
- ✓ **Enhanced Navigation** - Added admin access link in header for business management dashboard with responsive design
- ✓ **WordPress-Style Product Organization** - Only main products show in categories, variants accessible via individual product pages
- ✓ **Mobile-First Design** - Optimized user experience across all device sizes with responsive grids, typography, and navigation
- ✓ **User Authentication System** - Integrated Replit Auth for secure user login/logout with profile management
- ✓ **Object Storage Integration** - File upload functionality with drag-and-drop interface for product images
- ✓ **Clean Admin Interface** - Removed redundant icon input fields while preserving image upload capabilities

### Previous Changes (January 26, 2025)
- ✓ Imported authentic product data from CSV catalogs
- ✓ Updated product schema to include duration, features, activation time, warranty, and notes
- ✓ Enhanced product cards with detailed service information
- ✓ Integrated Font Awesome icons for better visual presentation
- ✓ Updated WhatsApp integration to use full product names
- ✓ Focused on four main categories: OTT, VPN, Cloud Storage, and Streaming Services

### Core Features
- **Product Catalog**: Filterable grid with category-based navigation
- **Checkout System**: Modal-based purchase flow with payment method selection
- **Review System**: Comprehensive customer feedback with 5-star ratings, moderation, and verification badges
- **WhatsApp Integration**: Automated customer communication post-purchase
- **Responsive Design**: Mobile-first approach with dark/light theme support
- **SEO Optimized**: Meta tags and structured content

### UI Components
- **Design System**: Consistent theming with CSS custom properties
- **Component Library**: Reusable components in `/client/src/components/ui/`
- **Layout Components**: Header, Footer, Hero sections
- **Interactive Elements**: Modals, toasts, carousels, accordions

## Data Flow

1. **Product Display**: Frontend fetches products/categories from `/api/products` and `/api/categories`
2. **Order Creation**: User selects product → checkout modal → payment method selection → order submission to `/api/orders`
3. **WhatsApp Redirect**: After successful order, user redirected to WhatsApp with pre-filled message
4. **Content Loading**: Blog posts and testimonials loaded via dedicated API endpoints
5. **State Management**: TanStack Query handles caching, background updates, and optimistic updates

## External Dependencies

### UI & Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Consistent icon library
- **Class Variance Authority**: Type-safe component variants

### Data & API
- **TanStack Query**: Server state management
- **React Hook Form**: Form handling with validation
- **Date-fns**: Date manipulation utilities

### Development Tools
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Fast JavaScript bundling
- **PostCSS**: CSS processing with Autoprefixer

## Deployment Strategy

### Development
- **Hot Reload**: Vite dev server with HMR
- **API Proxy**: Express serves both API and static files
- **Database**: Environment-based connection via `DATABASE_URL`

### Production Build
1. Frontend: Vite builds optimized React app to `/dist/public`
2. Backend: ESBuild bundles Express server to `/dist/index.js`
3. Assets: Static files served from built directory
4. Database: Drizzle migrations run via `npm run db:push`

### Environment Setup
- **Node.js**: ES modules with TypeScript compilation
- **Database**: PostgreSQL connection string required
- **Static Assets**: Served from `/dist/public` in production
- **API Routes**: All backend routes prefixed with `/api`

The application follows a monorepo structure with shared TypeScript definitions, enabling type safety across the full stack while maintaining clear separation between frontend and backend concerns.