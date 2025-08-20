import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { eq, and, desc, like, ilike, or, sql } from 'drizzle-orm';
import { db } from './db';
import { 
  users, products, categories, cart, wishlist, orders, orderItems, reviews, addresses,
  insertUserSchema, insertProductSchema, insertCategorySchema, insertCartSchema,
  insertWishlistSchema, insertOrderSchema, insertOrderItemSchema, insertReviewSchema,
  insertAddressSchema, loginSchema, registerSchema,
  type User, type Product, type Category
} from '../shared/schema';
import { IStorage } from './storage';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

// Middleware for authentication
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);
    if (user.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user[0];
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Middleware for admin only
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// AUTH ROUTES
router.post('/auth/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const newUser = await db.insert(users).values({
      ...data,
      password: hashedPassword
    }).returning();

    // Generate JWT
    const token = jwt.sign({ userId: newUser[0].id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        firstName: newUser[0].firstName,
        lastName: newUser[0].lastName,
        role: newUser[0].role
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    
    // Find user
    const user = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    if (user.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(data.password, user[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user[0].id));

    // Generate JWT
    const token = jwt.sign({ userId: user[0].id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: {
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        role: user[0].role
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/auth/me', authenticateToken, async (req: any, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role
    }
  });
});

// CATEGORIES ROUTES
router.get('/categories', async (req, res) => {
  try {
    const allCategories = await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(categories.sortOrder, categories.name);
    res.json(allCategories);
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/categories', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    const data = insertCategorySchema.parse(req.body);
    const newCategory = await db.insert(categories).values(data).returning();
    res.json(newCategory[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Category creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PRODUCTS ROUTES
router.get('/products', async (req, res) => {
  try {
    const { 
      category, 
      material, 
      minPrice, 
      maxPrice, 
      search, 
      featured, 
      limit = '20', 
      offset = '0' 
    } = req.query;

    let query = db.select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      material: products.material,
      karat: products.karat,
      weight: products.weight,
      dimensions: products.dimensions,
      images: products.images,
      tags: products.tags,
      stock: products.stock,
      isFeatured: products.isFeatured,
      isCustomizable: products.isCustomizable,
      categoryId: products.categoryId,
      categoryName: categories.name,
      createdAt: products.createdAt
    }).from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.isActive, true));

    // Apply filters
    const conditions = [eq(products.isActive, true)];

    if (category) {
      conditions.push(eq(categories.slug, category as string));
    }

    if (material) {
      conditions.push(eq(products.material, material as string));
    }

    if (minPrice) {
      conditions.push(sql`${products.price} >= ${minPrice}`);
    }

    if (maxPrice) {
      conditions.push(sql`${products.price} <= ${maxPrice}`);
    }

    if (search) {
      conditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`),
          ilike(products.tags, `%${search}%`)
        )!
      );
    }

    if (featured === 'true') {
      conditions.push(eq(products.isFeatured, true));
    }

    const allProducts = await query
      .where(and(...conditions))
      .orderBy(desc(products.isFeatured), products.sortOrder, products.createdAt)
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json(allProducts);
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/products/:slug', async (req, res) => {
  try {
    const product = await db.select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      material: products.material,
      karat: products.karat,
      weight: products.weight,
      dimensions: products.dimensions,
      images: products.images,
      tags: products.tags,
      specifications: products.specifications,
      stock: products.stock,
      isFeatured: products.isFeatured,
      isCustomizable: products.isCustomizable,
      categoryId: products.categoryId,
      categoryName: categories.name,
      createdAt: products.createdAt
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.slug, req.params.slug), eq(products.isActive, true)))
    .limit(1);

    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get reviews for this product
    const productReviews = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      content: reviews.content,
      images: reviews.images,
      isVerified: reviews.isVerified,
      createdAt: reviews.createdAt,
      userName: sql`${users.firstName} || ' ' || ${users.lastName}`.as('userName')
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(and(eq(reviews.productId, product[0].id), eq(reviews.isApproved, true)))
    .orderBy(desc(reviews.createdAt));

    res.json({
      ...product[0],
      reviews: productReviews
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/products', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    const data = insertProductSchema.parse(req.body);
    const newProduct = await db.insert(products).values(data).returning();
    res.json(newProduct[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Product creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CART ROUTES
router.get('/cart', authenticateToken, async (req: any, res) => {
  try {
    const cartItems = await db.select({
      id: cart.id,
      quantity: cart.quantity,
      customizations: cart.customizations,
      productId: products.id,
      productName: products.name,
      productSlug: products.slug,
      productPrice: products.price,
      productImages: products.images,
      productStock: products.stock,
      createdAt: cart.createdAt
    })
    .from(cart)
    .leftJoin(products, eq(cart.productId, products.id))
    .where(eq(cart.userId, req.user.id))
    .orderBy(desc(cart.createdAt));

    res.json(cartItems);
  } catch (error) {
    console.error('Cart fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/cart', authenticateToken, async (req: any, res) => {
  try {
    const data = insertCartSchema.parse({ ...req.body, userId: req.user.id });
    
    // Check if item already exists in cart
    const existingItem = await db.select().from(cart)
      .where(and(eq(cart.userId, req.user.id), eq(cart.productId, data.productId)))
      .limit(1);

    if (existingItem.length > 0) {
      // Update quantity
      const updatedItem = await db.update(cart)
        .set({ quantity: existingItem[0].quantity + data.quantity })
        .where(eq(cart.id, existingItem[0].id))
        .returning();
      return res.json(updatedItem[0]);
    }

    const newCartItem = await db.insert(cart).values(data).returning();
    res.json(newCartItem[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Cart add error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/cart/:id', authenticateToken, async (req: any, res) => {
  try {
    const { quantity } = req.body;
    
    const updatedItem = await db.update(cart)
      .set({ quantity })
      .where(and(eq(cart.id, req.params.id), eq(cart.userId, req.user.id)))
      .returning();

    if (updatedItem.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json(updatedItem[0]);
  } catch (error) {
    console.error('Cart update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/cart/:id', authenticateToken, async (req: any, res) => {
  try {
    const deletedItem = await db.delete(cart)
      .where(and(eq(cart.id, req.params.id), eq(cart.userId, req.user.id)))
      .returning();

    if (deletedItem.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Cart delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// WISHLIST ROUTES
router.get('/wishlist', authenticateToken, async (req: any, res) => {
  try {
    const wishlistItems = await db.select({
      id: wishlist.id,
      productId: products.id,
      productName: products.name,
      productSlug: products.slug,
      productPrice: products.price,
      productImages: products.images,
      createdAt: wishlist.createdAt
    })
    .from(wishlist)
    .leftJoin(products, eq(wishlist.productId, products.id))
    .where(eq(wishlist.userId, req.user.id))
    .orderBy(desc(wishlist.createdAt));

    res.json(wishlistItems);
  } catch (error) {
    console.error('Wishlist fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/wishlist', authenticateToken, async (req: any, res) => {
  try {
    const data = insertWishlistSchema.parse({ ...req.body, userId: req.user.id });
    
    // Check if item already exists
    const existingItem = await db.select().from(wishlist)
      .where(and(eq(wishlist.userId, req.user.id), eq(wishlist.productId, data.productId)))
      .limit(1);

    if (existingItem.length > 0) {
      return res.status(400).json({ error: 'Item already in wishlist' });
    }

    const newWishlistItem = await db.insert(wishlist).values(data).returning();
    res.json(newWishlistItem[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Wishlist add error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/wishlist/:productId', authenticateToken, async (req: any, res) => {
  try {
    const deletedItem = await db.delete(wishlist)
      .where(and(eq(wishlist.productId, req.params.productId), eq(wishlist.userId, req.user.id)))
      .returning();

    if (deletedItem.length === 0) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Wishlist delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ORDERS ROUTES
router.get('/orders', authenticateToken, async (req: any, res) => {
  try {
    const userOrders = await db.select().from(orders)
      .where(eq(orders.userId, req.user.id))
      .orderBy(desc(orders.createdAt));

    res.json(userOrders);
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/orders/:id', authenticateToken, async (req: any, res) => {
  try {
    const order = await db.select().from(orders)
      .where(and(eq(orders.id, req.params.id), eq(orders.userId, req.user.id)))
      .limit(1);

    if (order.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get order items
    const items = await db.select().from(orderItems)
      .where(eq(orderItems.orderId, order[0].id));

    res.json({
      ...order[0],
      items
    });
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ADMIN ROUTES
router.get('/admin/orders', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    const allOrders = await db.select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      email: orders.email,
      total: orders.total,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      createdAt: orders.createdAt,
      userName: sql`${users.firstName} || ' ' || ${users.lastName}`.as('userName')
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

    res.json(allOrders);
  } catch (error) {
    console.error('Admin orders fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;