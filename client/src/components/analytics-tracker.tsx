import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

let sessionId: string | null = null;

// Generate or get session ID
function getSessionId(): string {
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
  return sessionId;
}

// Track analytics event
export function trackEvent(event: string, data: any = {}) {
  try {
    apiRequest('POST', '/api/analytics/track', {
      event,
      data,
      sessionId: getSessionId(),
      userId: null, // Add user ID when auth is implemented
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

// Analytics tracker component
export default function AnalyticsTracker() {
  const [location] = useLocation();

  useEffect(() => {
    // Track page view
    trackEvent('page_view', {
      path: location,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });
  }, [location]);

  return null; // This component doesn't render anything
}

// Product view tracking
export function trackProductView(productId: string, productName: string) {
  trackEvent('product_view', {
    productId,
    productName,
    timestamp: new Date().toISOString(),
  });
}

// Purchase tracking
export function trackPurchase(orderId: string, productId: string, amount: number) {
  trackEvent('purchase', {
    orderId,
    productId,
    amount,
    timestamp: new Date().toISOString(),
  });
}

// Search tracking
export function trackSearch(query: string, results: number) {
  trackEvent('search', {
    query,
    results,
    timestamp: new Date().toISOString(),
  });
}