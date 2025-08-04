#!/usr/bin/env python3
import json
import requests
import time

# Read the OTT catalog data
with open('ott_catalog.json', 'r') as f:
    platform_products = json.load(f)

API_BASE = "http://localhost:5000/api"

def create_subcategory(platform_name, parent_category_id):
    """Create a subcategory for a platform under the OTT category"""
    subcategory_data = {
        "name": platform_name,
        "slug": platform_name.lower().replace(" ", "-"),
        "description": f"{platform_name} subscription plans",
        "icon": "fas fa-layer-group",
        "isSubcategory": True,
        "parentCategoryId": parent_category_id
    }
    
    response = requests.post(f"{API_BASE}/admin/categories", json=subcategory_data)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error creating subcategory {platform_name}: {response.text}")
        return None

def create_product(product_data, category_slug):
    """Create a product from the catalog data"""
    # Extract price number from "INR XXX" format
    price_str = str(product_data.get('Price', 'INR 0'))
    price = int(''.join(filter(str.isdigit, price_str))) if price_str else 0
    
    # Calculate original price (20% higher for discount display)
    original_price = int(price * 1.2)
    discount = int(((original_price - price) / original_price) * 100)
    
    # Build features list
    features = []
    if product_data.get('Devices'):
        features.append(f"Devices: {product_data['Devices']}")
    if product_data.get('Quality'):
        features.append(f"Quality: {product_data['Quality']}")
    if product_data.get('Type'):
        features.append(f"Type: {product_data['Type']}")
    if product_data.get('Login Method'):
        features.append(f"Login: {product_data['Login Method']}")
    if product_data.get('Privacy'):
        features.append(f"Privacy: {product_data['Privacy']}")
    if product_data.get('Ad-Free'):
        features.append(f"Ad-Free: {product_data['Ad-Free']}")
    
    product = {
        "name": f"{product_data['Platform']} {product_data['Plan']}",
        "fullProductName": f"{product_data['Platform']} {product_data['Plan']} - {product_data['Duration']}",
        "subcategory": product_data['Platform'],
        "duration": product_data.get('Duration', '1 Month'),
        "description": f"{product_data['Platform']} {product_data['Plan']} subscription for {product_data.get('Duration', '1 Month')}",
        "features": " • ".join(features),
        "price": price,
        "originalPrice": original_price,
        "discount": discount,
        "category": category_slug,
        "icon": "fas fa-play-circle",
        "image": f"https://via.placeholder.com/300x200/667eea/ffffff?text={product_data['Platform'].replace(' ', '+')}",
        "activationTime": "Instant",
        "warranty": product_data.get('Support', 'WhatsApp Support'),
        "notes": product_data.get('Notes', ''),
        "popular": False,
        "trending": False,
        "available": True,
        "isVariant": False,
        "parentProductId": None,
        "parentProductName": None
    }
    
    response = requests.post(f"{API_BASE}/admin/products", json=product)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error creating product {product['name']}: {response.text}")
        return None

def main():
    # First, get the OTT category ID
    categories_response = requests.get(f"{API_BASE}/categories")
    if categories_response.status_code != 200:
        print("Error fetching categories")
        return
    
    categories = categories_response.json()
    ott_category = None
    for cat in categories:
        if cat['slug'] == 'ott-subscriptions' or 'ott' in cat['slug'].lower():
            ott_category = cat
            break
    
    if not ott_category:
        print("OTT category not found. Creating it...")
        ott_data = {
            "name": "OTT Subscriptions",
            "slug": "ott-subscriptions",
            "description": "Streaming platform subscriptions",
            "icon": "fas fa-tv",
            "isSubcategory": False,
            "parentCategoryId": None
        }
        response = requests.post(f"{API_BASE}/admin/categories", json=ott_data)
        if response.status_code == 200:
            ott_category = response.json()
        else:
            print(f"Error creating OTT category: {response.text}")
            return
    
    print(f"Using OTT category: {ott_category['name']} (ID: {ott_category['id']})")
    
    # Create subcategories for each platform and add products
    for platform_name, products in platform_products.items():
        print(f"\nProcessing platform: {platform_name}")
        
        # Create subcategory
        subcategory = create_subcategory(platform_name, ott_category['id'])
        if not subcategory:
            continue
        
        print(f"Created subcategory: {subcategory['name']} (ID: {subcategory['id']})")
        
        # Create products for this platform
        for i, product_data in enumerate(products):
            print(f"Creating product {i+1}/{len(products)}: {product_data['Plan']}")
            product = create_product(product_data, subcategory['slug'])
            if product:
                print(f"✓ Created: {product['name']}")
            time.sleep(0.1)  # Small delay to avoid overwhelming the server
    
    print("\n✅ OTT catalog import completed!")

if __name__ == "__main__":
    main()