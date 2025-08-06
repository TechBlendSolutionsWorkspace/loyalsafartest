#!/usr/bin/env python3
"""
Product Import Script for MTS Digital Services
Imports authentic product data from all catalog files into the database via API
"""

import pandas as pd
import requests
import json
import sys
from typing import Dict, List, Any

BASE_URL = "http://localhost:5000"

def import_ott_products():
    """Import OTT products from Excel catalog"""
    try:
        df = pd.read_excel('attached_assets/Complete_OTT_Product_Catalog (2)_1754431238883.xlsx')
        print(f"📺 Loading {len(df)} OTT products...")
        
        products = []
        for _, row in df.iterrows():
            # Extract product data with proper field mapping
            product_data = {
                "name": str(row.get('Platform', row.get('Name', 'Unknown'))),
                "fullProductName": f"{row.get('Platform', '')} - {row.get('Plan', '')}",
                "description": f"Premium {row.get('Platform', '')} streaming service with {row.get('Quality', 'HD')} quality",
                "price": int(float(str(row.get('Price', '0')).replace('INR ', '').replace(',', '').replace('₹', '').strip() or 0)),
                "originalPrice": int(float(str(row.get('Price', '0')).replace('INR ', '').replace(',', '').replace('₹', '').strip() or 0) * 1.5),
                "category": "ott",
                "subcategory": str(row.get('Platform', row.get('Service', 'General'))),
                "duration": str(row.get('Duration', row.get('Validity', '1 Month'))),
                "features": str(row.get('Features', 'HD Streaming, Multiple Devices')),
                "activationTime": str(row.get('Activation Time', 'Within 24 Hours')),
                "warranty": str(row.get('Warranty', '30 Days')),
                "popular": bool(row.get('Popular', False)),
                "trending": bool(row.get('Trending', False)),
                "available": True,
                "isVariant": False,
                "parentProductId": "",
                "parentProductName": None,
                "icon": "fas fa-play-circle",
                "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
                "notes": str(row.get('Notes', ''))
            }
            
            # Calculate discount percentage
            if product_data["originalPrice"] > 0 and product_data["price"] > 0:
                product_data["discount"] = round(((product_data["originalPrice"] - product_data["price"]) / product_data["originalPrice"]) * 100)
            else:
                product_data["discount"] = 0
            
            products.append(product_data)
        
        return products
    except Exception as e:
        print(f"❌ Error loading OTT products: {e}")
        return []

def import_vpn_products():
    """Import VPN products from CSV catalog"""
    try:
        df = pd.read_csv('attached_assets/VPN CATALOGUE_1753552796363.csv')
        print(f"🔒 Loading {len(df)} VPN products...")
        
        products = []
        for _, row in df.iterrows():
            product_data = {
                "name": str(row.get('Subcategory', row.get('Service', 'VPN Service'))),
                "fullProductName": str(row.get('Full Product Name', row.get('Product Name', ''))),
                "description": str(row.get('Description', 'Secure VPN service')),
                "price": int(float(row.get('Our Price', row.get('Price', 0)))),
                "originalPrice": int(float(row.get('Official Price', row.get('Original Price', 0)))),
                "category": "vpn",
                "subcategory": str(row.get('Provider', row.get('Brand', 'General'))),
                "duration": str(row.get('Duration', row.get('Validity', '1 Month'))),
                "features": str(row.get('Features', 'Secure Connection, No Logs')),
                "activationTime": str(row.get('Activation Time', 'Instant')),
                "warranty": str(row.get('Warranty', '30 Days')),
                "popular": bool(row.get('Popular', False)),
                "trending": bool(row.get('Trending', False)),
                "available": True,
                "isVariant": False,
                "parentProductId": "",
                "parentProductName": None,
                "icon": "fas fa-shield-alt",
                "image": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
                "notes": str(row.get('Notes', ''))
            }
            
            # Calculate discount
            if product_data["originalPrice"] > 0 and product_data["price"] > 0:
                product_data["discount"] = round(((product_data["originalPrice"] - product_data["price"]) / product_data["originalPrice"]) * 100)
            else:
                product_data["discount"] = 0
            
            products.append(product_data)
        
        return products
    except Exception as e:
        print(f"❌ Error loading VPN products: {e}")
        return []

def import_cloud_products():
    """Import Cloud Storage products from CSV catalog"""
    try:
        df = pd.read_csv('attached_assets/CLOUD CATALOGUE _1753552796363.csv')
        print(f"☁️ Loading {len(df)} Cloud Storage products...")
        
        products = []
        for _, row in df.iterrows():
            product_data = {
                "name": str(row.get('Subcategory', row.get('Service', 'Cloud Storage'))),
                "fullProductName": str(row.get('Full Product Name', row.get('Product Name', ''))),
                "description": str(row.get('Description', 'Cloud storage service')),
                "price": int(float(row.get('Our Price', row.get('Price', 0)))),
                "originalPrice": int(float(row.get('Official Price', row.get('Original Price', 0)))),
                "category": "cloud",
                "subcategory": str(row.get('Provider', row.get('Brand', 'General'))),
                "duration": str(row.get('Duration', row.get('Validity', '1 Month'))),
                "features": str(row.get('Features', 'Secure Storage, Sync')),
                "activationTime": str(row.get('Activation Time', 'Within 24 Hours')),
                "warranty": str(row.get('Warranty', '30 Days')),
                "popular": bool(row.get('Popular', False)),
                "trending": bool(row.get('Trending', False)),
                "available": True,
                "isVariant": False,
                "parentProductId": "",
                "parentProductName": None,
                "icon": "fas fa-cloud",
                "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
                "notes": str(row.get('Notes', ''))
            }
            
            # Calculate discount
            if product_data["originalPrice"] > 0 and product_data["price"] > 0:
                product_data["discount"] = round(((product_data["originalPrice"] - product_data["price"]) / product_data["originalPrice"]) * 100)
            else:
                product_data["discount"] = 0
            
            products.append(product_data)
        
        return products
    except Exception as e:
        print(f"❌ Error loading Cloud products: {e}")
        return []

def import_streaming_products():
    """Import Streaming products from CSV catalog"""
    try:
        df = pd.read_csv('attached_assets/STREAMING CATALOGUE _1753552796363.csv')
        print(f"🎵 Loading {len(df)} Streaming products...")
        
        products = []
        for _, row in df.iterrows():
            product_data = {
                "name": str(row.get('Subcategory', row.get('Service', 'Streaming Service'))),
                "fullProductName": str(row.get('Full Product Name', row.get('Product Name', ''))),
                "description": str(row.get('Description', 'Music streaming service')),
                "price": int(float(row.get('Our Price', row.get('Price', 0)))),
                "originalPrice": int(float(row.get('Official Price', row.get('Original Price', 0)))),
                "category": "streaming",
                "subcategory": str(row.get('Provider', row.get('Brand', 'General'))),
                "duration": str(row.get('Duration', row.get('Validity', '1 Month'))),
                "features": str(row.get('Features', 'High Quality Audio, Offline')),
                "activationTime": str(row.get('Activation Time', 'Instant')),
                "warranty": str(row.get('Warranty', '30 Days')),
                "popular": bool(row.get('Popular', False)),
                "trending": bool(row.get('Trending', False)),
                "available": True,
                "isVariant": False,
                "parentProductId": "",
                "parentProductName": None,
                "icon": "fas fa-music",
                "image": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
                "notes": str(row.get('Notes', ''))
            }
            
            # Calculate discount
            if product_data["originalPrice"] > 0 and product_data["price"] > 0:
                product_data["discount"] = round(((product_data["originalPrice"] - product_data["price"]) / product_data["originalPrice"]) * 100)
            else:
                product_data["discount"] = 0
            
            products.append(product_data)
        
        return products
    except Exception as e:
        print(f"❌ Error loading Streaming products: {e}")
        return []

def bulk_import_products(products: List[Dict[str, Any]]):
    """Import products via API in batches"""
    print(f"🔄 Importing {len(products)} products to database...")
    
    success_count = 0
    error_count = 0
    
    for i, product in enumerate(products):
        try:
            response = requests.post(f"{BASE_URL}/api/admin/products", json=product, timeout=10)
            if response.status_code in [200, 201]:
                success_count += 1
                if (i + 1) % 10 == 0:
                    print(f"✅ Imported {i + 1}/{len(products)} products...")
            else:
                error_count += 1
                print(f"❌ Failed to import product {product['name']}: {response.status_code}")
        except Exception as e:
            error_count += 1
            print(f"❌ Error importing {product['name']}: {e}")
    
    print(f"📊 Import Summary: {success_count} successful, {error_count} failed")
    return success_count, error_count

def main():
    """Main import function"""
    print("🚀 MTS Digital Services - Product Import Starting...")
    print("=" * 60)
    
    # Import all product categories
    all_products = []
    
    # Import OTT products
    ott_products = import_ott_products()
    all_products.extend(ott_products)
    
    # Import VPN products  
    vpn_products = import_vpn_products()
    all_products.extend(vpn_products)
    
    # Import Cloud products
    cloud_products = import_cloud_products()
    all_products.extend(cloud_products)
    
    # Import Streaming products
    streaming_products = import_streaming_products()
    all_products.extend(streaming_products)
    
    print("=" * 60)
    print(f"📦 Total products loaded: {len(all_products)}")
    print(f"📺 OTT: {len(ott_products)}")
    print(f"🔒 VPN: {len(vpn_products)}")
    print(f"☁️ Cloud: {len(cloud_products)}")
    print(f"🎵 Streaming: {len(streaming_products)}")
    print("=" * 60)
    
    if all_products:
        success, errors = bulk_import_products(all_products)
        print(f"✅ Import completed: {success} products imported successfully")
        if errors > 0:
            print(f"⚠️ {errors} products failed to import")
    else:
        print("❌ No products found to import")

if __name__ == "__main__":
    main()