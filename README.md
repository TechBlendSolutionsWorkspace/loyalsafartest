# Loyal Safar - Production-Ready Laravel Backend

## 🚀 Overview

**Loyal Safar** is a comprehensive, production-ready Laravel backend for a taxi booking platform implementing dynamic area-wise commission slabs, transparent wallet management, ride tracking & sharing with OTP verification, and complete REST APIs for deployment on Render.com.

## ✨ Key Features

### 🎯 Core Business Logic
- **Dynamic Commission System**: Area-based commission slabs with percentage/fixed rates for different fare ranges
- **Transparent Wallet Management**: Driver wallets with instant UPI payouts and transaction history
- **OTP-Verified Ride Tracking**: Secure ride sharing with shareable links activated only after OTP verification
- **Driver-Protective Coupon System**: Drivers receive full original fare while company wallet absorbs discount costs
- **Real-Time Location Updates**: Live tracking with ETA and location sharing for emergency contacts

### 🛡️ Security & Compliance
- JWT authentication for secure API access
- OTP verification for ride initiation
- Encrypted tracking tokens with expiration
- Role-based access control (admin, driver, passenger)
- Input validation and SQL injection protection

### 🌍 Production-Ready Deployment
- **Render.com Integration**: Complete deployment configuration with PostgreSQL
- **Environment Management**: Secure environment variable handling
- **Database Migrations**: Automated schema management with seeders
- **Performance Optimized**: Caching, indexing, and query optimization

## 🏗️ System Architecture

### Database Schema (8 Core Tables)
1. **Areas**: Kolkata/Howrah specific area management
2. **Commission Slabs**: Dynamic fare-based commission structures
3. **Rides**: Core ride booking and commission tracking
4. **Ride Sessions**: OTP-verified tracking sessions with expiration
5. **Ride Shares**: Emergency contact sharing with access logs
6. **Driver Wallets**: Transparent earnings and payout management
7. **Coupon Redemptions**: Driver-protective discount tracking
8. **Company Wallets**: Platform revenue and commission management

### Commission Model Logic
```
Low Fare (₹0-₹100):    Fixed ₹10 commission
Medium Fare (₹101-₹500): 8% commission
High Fare (₹501-₹1000):  12% commission
Premium Fare (₹1001+):   15% commission
Default Fallback:        10% commission
```

## 🚀 Quick Start Guide

### Prerequisites
- PHP 8.1+
- Composer
- PostgreSQL (production) / SQLite (development)

### Installation

1. **Clone & Setup**
```bash
git clone <repository-url>
cd loyal-safar-backend
composer install
cp .env.example .env
php artisan key:generate
```

2. **Database Setup**
```bash
php artisan migrate
php artisan db:seed
```

3. **Start Development Server**
```bash
php artisan serve --host=0.0.0.0 --port=5000
```

### Production Deployment on Render.com

1. **Connect Repository** to Render.com
2. **Auto-deploy** using included `render.yaml` configuration
3. **Environment Variables** are automatically configured
4. **Database migrations** run automatically on deployment

## 📚 Complete API Documentation

### Base URL: `https://your-app.onrender.com/api`

### Authentication
All authenticated endpoints require:
```
Authorization: Bearer {jwt_token}
```

---

## 🚗 Ride Management APIs

### Create New Ride
```http
POST /api/rides
Content-Type: application/json

{
  "passenger_id": 1,
  "driver_id": 2,
  "area_id": 1,
  "pickup_location": "Salt Lake City",
  "drop_location": "Park Street",
  "fare_amount": 150.00,
  "coupon_code": "WELCOME50"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ride created successfully",
  "data": {
    "id": 1,
    "fare_amount": 150.00,
    "coupon_discount": 75.00,
    "final_amount": 75.00,
    "commission_amount": 12.00,
    "driver_earning": 138.00,
    "otp": "1234",
    "commission_details": {
      "slab": "Medium Fare Range",
      "rate": "8%",
      "calculation": "8% of ₹150 = ₹12"
    }
  }
}
```

### Verify OTP & Start Ride
```http
POST /api/rides/{id}/verify-otp
Content-Type: application/json

{
  "otp": "1234"
}
```

### Complete Ride
```http
POST /api/rides/{id}/complete
Content-Type: application/json

{
  "final_fare": 165.00,
  "payment_method": "cash"
}
```

### Calculate Commission Preview
```http
POST /api/rides/calculate-commission
Content-Type: application/json

{
  "area_id": 1,
  "fare_amount": 250.00,
  "coupon_code": "SAVE25"
}
```

---

## 📍 Ride Tracking & Sharing APIs

### Start Tracking (After OTP Verification)
```http
POST /api/tracking/rides/{rideId}/start
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tracking_token": "abc123xyz",
    "tracking_url": "https://your-app.com/track/abc123xyz",
    "expires_at": "2025-08-22T13:36:00Z"
  }
}
```

### Share Ride with Emergency Contacts
```http
POST /api/tracking/rides/{rideId}/share
Content-Type: application/json

{
  "contact_info": "+91-9876543210",
  "share_method": "whatsapp"
}
```

### Update Driver Location
```http
POST /api/tracking/sessions/{token}/location
Content-Type: application/json

{
  "latitude": 22.5726,
  "longitude": 88.3639,
  "eta": "15 minutes"
}
```

### Get Tracking Status (Public - No Auth Required)
```http
GET /api/track/{token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ride_id": 1,
    "status": "in_progress",
    "driver_name": "Rajesh Kumar",
    "vehicle_info": "Sedan - WB 12 AB 1234",
    "current_location": {
      "latitude": 22.5726,
      "longitude": 88.3639
    },
    "eta": "10 minutes",
    "pickup_location": "Salt Lake City",
    "drop_location": "Park Street"
  }
}
```

---

## 💰 Driver Wallet APIs

### Get Driver Wallet Summary
```http
GET /api/wallets/driver/{driverId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "driver": {
      "id": 2,
      "name": "Rajesh Kumar",
      "email": "rajesh.driver@loyalsafar.com"
    },
    "wallet": {
      "balance": 1250.00,
      "total_earnings": 5000.00,
      "total_withdrawals": 3750.00,
      "rides_completed": 42,
      "average_commission": 95.50
    }
  }
}
```

### Get Transaction History
```http
GET /api/wallets/driver/{driverId}/transactions?type=credit&from_date=2025-08-01&per_page=20
```

### Request Payout
```http
POST /api/wallets/driver/{driverId}/payout
Content-Type: application/json

{
  "amount": 1000.00,
  "payment_method": "upi",
  "payment_details": {
    "upi_id": "rajesh@paytm",
    "account_name": "Rajesh Kumar"
  }
}
```

---

## 🗺️ Area & Commission Management APIs

### Get All Areas
```http
GET /api/areas?city=Kolkata&active=true
```

### Get Commission Slabs for Area
```http
GET /api/areas/{areaId}/commission-slabs
```

**Response:**
```json
{
  "success": true,
  "data": {
    "area": {
      "id": 1,
      "name": "Salt Lake City",
      "city": "Kolkata",
      "state": "West Bengal"
    },
    "commission_slabs": [
      {
        "id": 1,
        "min_fare": 0,
        "max_fare": 100,
        "commission_type": "fixed",
        "commission_value": 10.00
      },
      {
        "id": 2,
        "min_fare": 101,
        "max_fare": 500,
        "commission_type": "percentage",
        "commission_value": 8.00
      }
    ]
  }
}
```

### Create New Commission Slab
```http
POST /api/commission-slabs
Content-Type: application/json

{
  "area_id": 1,
  "min_fare": 2000,
  "max_fare": 5000,
  "commission_type": "percentage",
  "commission_value": 18.00,
  "active": true
}
```

### Validate Fare Range
```http
POST /api/commission-slabs/validate-range
Content-Type: application/json

{
  "area_id": 1,
  "min_fare": 1500,
  "max_fare": 2500
}
```

---

## 📊 Admin Dashboard APIs

### Platform Statistics
```http
GET /api/admin/dashboard/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_rides": 1250,
    "completed_rides": 1180,
    "total_revenue": 125000.00,
    "total_commission": 12500.00,
    "active_drivers": 45,
    "avg_ride_value": 185.50,
    "today_stats": {
      "rides": 25,
      "revenue": 4500.00,
      "commission": 450.00
    }
  }
}
```

### Company Wallet Summary
```http
GET /api/admin/dashboard/wallet-summary
```

### Commission Report
```http
GET /api/rides/commission-report?from_date=2025-08-01&to_date=2025-08-22
```

---

## 🎫 Sample Data

### Test Users
- **Admin**: admin@loyalsafar.com / admin123
- **Driver**: rajesh.driver@loyalsafar.com / password123
- **Passenger**: priya@example.com / password123

### Sample Coupons
- **WELCOME50**: 50% off (max ₹100) on orders above ₹150
- **SAVE25**: Flat ₹25 off on orders above ₹100
- **LOYALTY20**: 20% off (max ₹80) on orders above ₹200

### Pre-configured Areas
- Salt Lake City, Park Street, Esplanade (Kolkata)
- Howrah Station, Liluah, Shibpur (Howrah)
- Ballygunge, Gariahat (Kolkata)

## 🔧 Environment Variables

### Required Production Variables
```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:generated-key

DB_CONNECTION=pgsql
DB_HOST=database-host
DB_PORT=5432
DB_DATABASE=database-name
DB_USERNAME=database-user
DB_PASSWORD=database-password

JWT_SECRET=your-jwt-secret
```

## 📈 Performance Features

- **Database Indexing**: Optimized queries for ride lookups and commission calculations
- **Caching Strategy**: Redis-ready configuration for session and route caching
- **Query Optimization**: Eager loading for related models and pagination
- **Background Jobs**: Queue-ready for payout processing and notifications

## 🛠️ Development Commands

```bash
# Database
php artisan migrate:fresh --seed    # Fresh database with sample data
php artisan migrate:status          # Check migration status

# Caching (Production)
php artisan config:cache            # Cache configuration
php artisan route:cache             # Cache routes
php artisan view:cache               # Cache views

# Development
php artisan serve --host=0.0.0.0 --port=5000
php artisan queue:work               # Process background jobs
```

## 📝 API Response Format

All API responses follow this consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": { /* validation errors if applicable */ }
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Admin, driver, passenger role separation
- **Input Validation**: Comprehensive request validation
- **OTP Security**: 6-digit OTP for ride verification
- **Tracking Token Encryption**: Secure, expiring tracking tokens
- **SQL Injection Protection**: Eloquent ORM with parameter binding

## 📞 Support & Contact

For backend API support and development questions:
- **Technical Documentation**: Comprehensive API documentation included
- **Sample Requests**: Postman collection available
- **Error Handling**: Detailed error codes and messages
- **Development Guide**: Complete setup and deployment instructions

---

## 🚀 Ready for Production

This Laravel backend is fully production-ready with:
- ✅ Complete REST API implementation
- ✅ Dynamic commission system with area-based slabs
- ✅ Secure ride tracking and sharing
- ✅ Transparent driver wallet management
- ✅ Coupon system with driver protection
- ✅ Render.com deployment configuration
- ✅ Comprehensive API documentation
- ✅ Sample data and test users
- ✅ Security best practices implemented

Deploy to Render.com and start accepting ride bookings immediately!