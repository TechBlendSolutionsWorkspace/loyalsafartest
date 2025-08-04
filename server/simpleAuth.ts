import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";

// Simple session-based auth for external deployments
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // Only use database session storage if DATABASE_URL is available
  if (process.env.DATABASE_URL) {
    const pgStore = connectPg(session);
    const sessionStore = new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: false,
      ttl: sessionTtl,
      tableName: "sessions",
    });
    
    return session({
      secret: process.env.SESSION_SECRET || 'fallback-session-secret-for-external-deployment',
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
  
  // Fallback to memory session for simple deployments
  return session({
    secret: process.env.SESSION_SECRET || 'fallback-session-secret-for-external-deployment',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

export async function setupSimpleAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  
  // Simple auth routes for external deployments
  app.get("/api/login", (req, res) => {
    res.status(200).json({ message: "Please use admin login: username 'admin', password 'admin123'" });
  });

  app.get("/api/callback", (req, res) => {
    res.redirect("/");
  });

  app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
}

// Simple auth check for external deployments
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // For external deployments, just return unauthorized
  // The frontend will handle the admin auth separately
  return res.status(401).json({ message: "Authentication not available on this deployment" });
};