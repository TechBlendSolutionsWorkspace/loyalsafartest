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

### Recent Changes (February 1, 2025)
- ✓ Implemented comprehensive customer review and rating system
- ✓ Added reviews database schema with star ratings, moderation, and verification
- ✓ Created interactive star rating component with hover effects
- ✓ Built review submission form with validation and moderation queue
- ✓ Developed dedicated reviews page with product filtering and statistics
- ✓ Integrated review stats into product cards showing average ratings
- ✓ Added reviews navigation link to header menu
- ✓ Enhanced system with proper API endpoints for review CRUD operations

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