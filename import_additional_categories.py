#!/usr/bin/env python3
"""
Additional Category Import Script
Imports products from PDF catalogs and creates additional categories
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def create_additional_categories():
    """Create additional categories from PDF catalogs"""
    
    additional_categories = [
        {
            "id": "editing-software",
            "name": "Editing Software",
            "slug": "editing-software", 
            "description": "Professional video and photo editing software",
            "icon": "fas fa-edit",
            "bannerImage": None,
            "bannerTitle": None,
            "bannerSubtitle": None,
            "parentCategoryId": None,
            "isSubcategory": False
        },
        {
            "id": "professional-software",
            "name": "Professional Software",
            "slug": "professional-software",
            "description": "Business and professional software packages", 
            "icon": "fas fa-briefcase",
            "bannerImage": None,
            "bannerTitle": None,
            "bannerSubtitle": None,
            "parentCategoryId": None,
            "isSubcategory": False
        },
        {
            "id": "social-media-growth",
            "name": "Social Media Growth",
            "slug": "social-media-growth",
            "description": "Social media marketing and growth tools",
            "icon": "fas fa-chart-line", 
            "bannerImage": None,
            "bannerTitle": None,
            "bannerSubtitle": None,
            "parentCategoryId": None,
            "isSubcategory": False
        },
        {
            "id": "digital-products",
            "name": "Digital Products",
            "slug": "digital-products",
            "description": "Digital courses, templates, and resources",
            "icon": "fas fa-download",
            "bannerImage": None,
            "bannerTitle": None, 
            "bannerSubtitle": None,
            "parentCategoryId": None,
            "isSubcategory": False
        },
        {
            "id": "ai-tools",
            "name": "AI Tools",
            "slug": "ai-tools",
            "description": "Artificial intelligence and automation tools",
            "icon": "fas fa-robot",
            "bannerImage": None,
            "bannerTitle": None,
            "bannerSubtitle": None, 
            "parentCategoryId": None,
            "isSubcategory": False
        },
        {
            "id": "productivity",
            "name": "Productivity Tools", 
            "slug": "productivity",
            "description": "Productivity and workflow optimization tools",
            "icon": "fas fa-tasks",
            "bannerImage": None,
            "bannerTitle": None,
            "bannerSubtitle": None,
            "parentCategoryId": None, 
            "isSubcategory": False
        },
        {
            "id": "marketing-tools",
            "name": "Marketing Tools",
            "slug": "marketing-tools", 
            "description": "Digital marketing and advertising tools",
            "icon": "fas fa-bullhorn",
            "bannerImage": None,
            "bannerTitle": None,
            "bannerSubtitle": None,
            "parentCategoryId": None,
            "isSubcategory": False
        },
        {
            "id": "design-tools",
            "name": "Design Tools",
            "slug": "design-tools",
            "description": "Graphic design and creative software",
            "icon": "fas fa-palette", 
            "bannerImage": None,
            "bannerTitle": None,
            "bannerSubtitle": None,
            "parentCategoryId": None,
            "isSubcategory": False
        }
    ]
    
    print(f"🏗️ Creating {len(additional_categories)} additional categories...")
    
    success_count = 0
    for category in additional_categories:
        try:
            response = requests.post(f"{BASE_URL}/api/admin/categories", json=category, timeout=10)
            if response.status_code in [200, 201]:
                success_count += 1
                print(f"✅ Created category: {category['name']}")
            else:
                print(f"❌ Failed to create category {category['name']}: {response.status_code}")
        except Exception as e:
            print(f"❌ Error creating category {category['name']}: {e}")
    
    print(f"📊 Categories created: {success_count}/{len(additional_categories)}")
    return success_count

def import_editing_software_products():
    """Import editing software products based on PDF catalog"""
    products = [
        {
            "name": "Adobe Creative Suite",
            "fullProductName": "Adobe Creative Suite - Complete Package",
            "description": "Complete Adobe Creative Suite with Photoshop, Premiere Pro, After Effects",
            "price": 299,
            "originalPrice": 599,
            "discount": 50,
            "category": "editing-software",
            "subcategory": "Adobe",
            "duration": "1 Year",
            "features": "All Apps, Cloud Storage, Premium Support",
            "activationTime": "Within 24 Hours",
            "warranty": "1 Year",
            "popular": True,
            "trending": True,
            "available": True,
            "isVariant": False,
            "parentProductId": "",
            "parentProductName": None,
            "icon": "fas fa-edit",
            "image": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
            "notes": "Professional editing suite"
        },
        {
            "name": "Final Cut Pro",
            "fullProductName": "Final Cut Pro - Professional Video Editing",
            "description": "Professional video editing software for Mac",
            "price": 199,
            "originalPrice": 299,
            "discount": 33,
            "category": "editing-software", 
            "subcategory": "Apple",
            "duration": "Lifetime",
            "features": "4K Support, Advanced Color Grading, Motion Graphics",
            "activationTime": "Instant",
            "warranty": "30 Days",
            "popular": True,
            "trending": False,
            "available": True,
            "isVariant": False,
            "parentProductId": "",
            "parentProductName": None,
            "icon": "fas fa-video",
            "image": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
            "notes": "Mac exclusive"
        }
    ]
    return products

def import_social_media_products():
    """Import social media growth products"""
    products = [
        {
            "name": "Instagram Growth Tool",
            "fullProductName": "Instagram Growth & Analytics Tool - Premium",
            "description": "Advanced Instagram growth and analytics platform",
            "price": 49,
            "originalPrice": 99,
            "discount": 51,
            "category": "social-media-growth",
            "subcategory": "Instagram",
            "duration": "1 Month",
            "features": "Auto Engagement, Analytics, Hashtag Research",
            "activationTime": "Instant",
            "warranty": "30 Days",
            "popular": True,
            "trending": True,
            "available": True,
            "isVariant": False,
            "parentProductId": "",
            "parentProductName": None,
            "icon": "fab fa-instagram",
            "image": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
            "notes": "Boost your Instagram presence"
        },
        {
            "name": "TikTok Growth Suite",
            "fullProductName": "TikTok Growth & Engagement Suite",
            "description": "Complete TikTok growth and content optimization tools",
            "price": 39,
            "originalPrice": 79,
            "discount": 51,
            "category": "social-media-growth",
            "subcategory": "TikTok",
            "duration": "1 Month",
            "features": "Viral Content Ideas, Trend Analysis, Auto Posting",
            "activationTime": "Within 1 Hour",
            "warranty": "30 Days",
            "popular": True,
            "trending": True,
            "available": True,
            "isVariant": False,
            "parentProductId": "",
            "parentProductName": None,
            "icon": "fab fa-tiktok",
            "image": "https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
            "notes": "Go viral on TikTok"
        }
    ]
    return products

def import_professional_software_products():
    """Import professional software products"""
    products = [
        {
            "name": "Microsoft Office 365",
            "fullProductName": "Microsoft Office 365 - Business Premium",
            "description": "Complete Microsoft Office suite with cloud services",
            "price": 149,
            "originalPrice": 299,
            "discount": 50,
            "category": "professional-software",
            "subcategory": "Microsoft",
            "duration": "1 Year",
            "features": "Word, Excel, PowerPoint, Teams, OneDrive",
            "activationTime": "Instant",
            "warranty": "1 Year",
            "popular": True,
            "trending": False,
            "available": True,
            "isVariant": False,
            "parentProductId": "",
            "parentProductName": None,
            "icon": "fab fa-microsoft",
            "image": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
            "notes": "Essential business software"
        },
        {
            "name": "AutoCAD",
            "fullProductName": "AutoCAD - Professional Design Software",
            "description": "Professional 2D and 3D CAD design software",
            "price": 399,
            "originalPrice": 799,
            "discount": 50,
            "category": "professional-software",
            "subcategory": "Autodesk",
            "duration": "1 Year",
            "features": "2D/3D Design, Collaboration Tools, Mobile App",
            "activationTime": "Within 24 Hours",
            "warranty": "1 Year",
            "popular": True,
            "trending": False,
            "available": True,
            "isVariant": False,
            "parentProductId": "",
            "parentProductName": None,
            "icon": "fas fa-drafting-compass",
            "image": "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
            "notes": "Industry standard CAD"
        }
    ]
    return products

def import_ai_tools_products():
    """Import AI tools and automation products"""
    products = [
        {
            "name": "ChatGPT Plus",
            "fullProductName": "ChatGPT Plus - Premium AI Assistant",
            "description": "Advanced AI assistant with GPT-4 access and priority",
            "price": 20,
            "originalPrice": 20,
            "discount": 0,
            "category": "ai-tools",
            "subcategory": "OpenAI",
            "duration": "1 Month",
            "features": "GPT-4 Access, Priority Queue, Faster Response",
            "activationTime": "Instant",
            "warranty": "30 Days",
            "popular": True,
            "trending": True,
            "available": True,
            "isVariant": False,
            "parentProductId": "",
            "parentProductName": None,
            "icon": "fas fa-robot",
            "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
            "notes": "Most advanced AI assistant"
        },
        {
            "name": "Midjourney",
            "fullProductName": "Midjourney - AI Art Generation",
            "description": "Professional AI image generation and art creation tool",
            "price": 30,
            "originalPrice": 30,
            "discount": 0,
            "category": "ai-tools",
            "subcategory": "Midjourney",
            "duration": "1 Month",
            "features": "High-Res Images, Commercial Use, Fast Generation",
            "activationTime": "Within 1 Hour",
            "warranty": "30 Days",
            "popular": True,
            "trending": True,
            "available": True,
            "isVariant": False,
            "parentProductId": "",
            "parentProductName": None,
            "icon": "fas fa-palette",
            "image": "https://images.unsplash.com/photo-1686191128521-da4e74c8e74a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
            "notes": "Create stunning AI art"
        }
    ]
    return products

def bulk_import_products(products, category_name):
    """Import products for a specific category"""
    print(f"🔄 Importing {len(products)} {category_name} products...")
    
    success_count = 0
    for product in products:
        try:
            response = requests.post(f"{BASE_URL}/api/admin/products", json=product, timeout=10)
            if response.status_code in [200, 201]:
                success_count += 1
                print(f"✅ Imported: {product['name']}")
            else:
                print(f"❌ Failed to import {product['name']}: {response.status_code}")
        except Exception as e:
            print(f"❌ Error importing {product['name']}: {e}")
    
    print(f"📊 {category_name} Import: {success_count}/{len(products)} successful")
    return success_count

def main():
    """Main import function for additional categories and products"""
    print("🚀 Additional Categories & Products Import Starting...")
    print("=" * 60)
    
    # Create additional categories
    categories_created = create_additional_categories()
    print(f"✅ Created {categories_created} additional categories")
    print("=" * 60)
    
    # Import products for each new category
    total_imported = 0
    
    # Editing Software
    editing_products = import_editing_software_products()
    total_imported += bulk_import_products(editing_products, "Editing Software")
    
    # Social Media Growth
    social_products = import_social_media_products()
    total_imported += bulk_import_products(social_products, "Social Media Growth")
    
    # Professional Software
    professional_products = import_professional_software_products()
    total_imported += bulk_import_products(professional_products, "Professional Software")
    
    # AI Tools
    ai_products = import_ai_tools_products()
    total_imported += bulk_import_products(ai_products, "AI Tools")
    
    print("=" * 60)
    print(f"✅ Additional import completed: {total_imported} products imported")
    print("🎯 Your MTS Digital Services now has comprehensive product catalog!")

if __name__ == "__main__":
    main()