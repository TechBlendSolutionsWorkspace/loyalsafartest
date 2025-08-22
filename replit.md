# Loyal Safar - Professional Taxi Booking MVP Prototype

## Overview

**Loyal Safar** is a comprehensive MVP prototype for a taxi booking application built with Laravel/PHP/MySQL/Bootstrap 5, featuring advanced commission management, driver wallets with instant UPI payouts, ride sharing, coupon systems, panic button, and eco-friendly blue/green theme specifically targeting Kolkata/Howrah areas. The platform provides intelligent commission slabs, real-time earnings management, and sustainable transportation solutions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Bootstrap 5.3.0 Framework**: Modern responsive design with updated components and utilities
- **Advanced UI Components**: Swiper.js carousels for ride options, Chart.js for earnings visualization
- **Eco-Friendly Design**: Blue/green color scheme with modern gradients and eco-themed elements
- **Mobile-First Approach**: Optimized for mobile devices with touch-friendly interfaces

### Backend Architecture
- **Laravel Framework**: MVC architecture with comprehensive database schema (8 new tables)
- **Commission Management**: Intelligent slab system with percentage/fixed rates for different fare ranges
- **Wallet System**: Driver wallets with instant UPI payouts and transaction history
- **Area-Based Pricing**: Kolkata/Howrah specific areas with customized fare structures

### Data Storage Solutions
- **Product Catalog Structure**: 
  - Products with hierarchical categories (Main Category → Subcategory)
  - Variation attributes (Duration, Price, Features, Activation Time, Warranty)
  - Inventory tracking and availability status
- **Order Management Schema**:
  - Order records with product variations and customer information
  - Payment status tracking for manual verification workflow
- **Category Management**: Two-tier categorization system for organized product browsing

### Authentication and Authorization
- **User Session Management**: Basic user authentication for order tracking and history
- **Admin Access Control**: Administrative interface for product management and order processing
- **Guest Checkout Support**: Streamlined purchasing without mandatory account creation

## External Dependencies

### Communication Integration
- **WhatsApp Business API**: Automated order confirmation and customer support integration with pre-filled message templates including order details and unique identifiers

### Payment Processing
- **Manual Payment Verification**: Support for UPI, Paytm, and Google Pay with manual confirmation workflow
- **Payment Gateway Integration**: Infrastructure ready for automated payment processing (Razorpay/Stripe compatibility)

### Data Import Services
- **File Processing Engine**: Support for Excel (.xlsx) and CSV file formats for bulk product catalog imports
- **Data Mapping System**: Automated field mapping from external catalogs to internal product schema

### Third-Party Services
- **Analytics Integration**: User behavior tracking and conversion monitoring capabilities
- **Email Services**: Order confirmation and customer communication infrastructure
- **CDN Support**: Image and asset delivery optimization for product catalogs

### Development and Security
- **Code Quality Tools**: Semgrep integration for security scanning and code quality enforcement
- **Security Compliance**: Input validation, CSRF protection, and secure parameter handling for sensitive data