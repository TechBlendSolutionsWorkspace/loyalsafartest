import { randomBytes } from 'crypto';
import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// In-memory OTP storage (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; email: string; expiresAt: number; attempts: number }>();

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Email simulation (replace with actual email service like SendGrid, AWS SES, etc.)
async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  // Simulate email sending
  console.log(`📧 OTP Email sent to ${email}: ${otp}`);
  // In production, integrate with email service:
  // await emailService.send({
  //   to: email,
  //   subject: 'Your MTS Digital Services Login Code',
  //   html: `Your verification code is: <strong>${otp}</strong>`
  // });
  return true;
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

export async function setupEmailAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Request OTP endpoint
  app.post('/api/auth/request-otp', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, message: 'Valid email required' });
      }

      // Generate OTP
      const otp = generateOTP();
      const expiresAt = Date.now() + (5 * 60 * 1000); // 5 minutes
      
      // Store OTP
      otpStore.set(email, { otp, email, expiresAt, attempts: 0 });
      
      // Send OTP email
      const emailSent = await sendOTPEmail(email, otp);
      
      if (!emailSent) {
        return res.status(500).json({ success: false, message: 'Failed to send OTP' });
      }
      
      res.json({ success: true, message: 'OTP sent to your email' });
    } catch (error) {
      console.error('Request OTP error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

  // Verify OTP and login endpoint
  app.post('/api/auth/verify-otp', async (req, res) => {
    try {
      const { email, otp } = req.body;
      
      if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP required' });
      }

      const storedOTP = otpStore.get(email);
      
      if (!storedOTP) {
        return res.status(400).json({ success: false, message: 'OTP not found or expired' });
      }

      // Check expiration
      if (Date.now() > storedOTP.expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({ success: false, message: 'OTP expired' });
      }

      // Check attempts
      if (storedOTP.attempts >= 3) {
        otpStore.delete(email);
        return res.status(400).json({ success: false, message: 'Too many failed attempts' });
      }

      // Verify OTP
      if (storedOTP.otp !== otp) {
        storedOTP.attempts += 1;
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
      }

      // OTP verified, clean up
      otpStore.delete(email);

      // Get or create user
      let user = await storage.getUserByEmail(email);
      if (!user) {
        user = await storage.createUser({
          id: randomBytes(16).toString('hex'),
          email: email,
          firstName: null,
          lastName: null,
          profileImageUrl: null,
        });
      }

      // Create session
      (req.session as any).user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      };

      res.json({ success: true, message: 'Login successful', user });
    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

  // Logout endpoint
  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Logout failed' });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true, message: 'Logged out successfully' });
    });
  });

  // Get current user endpoint
  app.get('/api/auth/user', async (req, res) => {
    try {
      const sessionUser = (req.session as any)?.user;
      
      if (!sessionUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Get fresh user data
      const user = await storage.getUser(sessionUser.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const sessionUser = (req.session as any)?.user;
  
  if (!sessionUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify user still exists
  const user = await storage.getUser(sessionUser.id);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  // Attach user to request
  (req as any).user = user;
  next();
};