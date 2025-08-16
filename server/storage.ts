// Clean storage interface for Indian restaurant
// Removed all complex database logic for now

console.log("🍛 Storage initialized for Indian Restaurant Website");

export const storage = {
  // Basic health check
  async healthCheck() {
    try {
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (error) {
      console.error('Storage health check failed:', error);
      return { status: 'unhealthy', error };
    }
  }
};