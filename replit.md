# RideBook - Professional Ride Booking Platform

## Overview

RideBook is a comprehensive ride-booking driver application built with Laravel/PHP, featuring role-based authentication for drivers, passengers, and administrators. The platform provides real-time ride matching, GPS tracking, earnings management, and secure payment processing. Built using Laravel framework with Bootstrap 4.4.1, jQuery 3.4.1, and modern web technologies for a responsive, mobile-first experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Bootstrap 4.4.1 Framework**: Responsive design using Bootstrap grid system and components
- **jQuery 3.4.1 Integration**: Enhanced interactivity with jQuery for AJAX requests and DOM manipulation
- **Modern UI Libraries**: Swiper for carousels, FancyBox for modals, Highlight.js for code highlighting
- **Real-time Updates**: Live ride tracking, status updates, and location tracking functionality

### Backend Architecture
- **Laravel Framework**: MVC architecture with Eloquent ORM for database operations
- **Role-Based Authentication**: Multi-role system supporting drivers, passengers, and administrators
- **Ride Management System**: Complete workflow from booking to completion with status tracking
- **Payment Processing**: Secure payment handling with multiple payment method support

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