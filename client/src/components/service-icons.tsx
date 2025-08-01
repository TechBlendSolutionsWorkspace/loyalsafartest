// Authentic Service Icons for MTS Digital Services
// These are custom SVG icons representing actual brand logos

export const ServiceIcons = {
  // Spotify Icon
  Spotify: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  ),

  // YouTube Icon
  YouTube: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),

  // YouTube Music Icon
  YouTubeMusic: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor">
      <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-11.748c-2.556 0-4.644 2.088-4.644 4.644S9.444 16.644 12 16.644s4.644-2.088 4.644-4.644S14.556 7.356 12 7.356zm-1.728 7.2V9.444L14.4 12l-4.128 2.556z"/>
    </svg>
  ),

  // Amazon Prime Video Icon
  PrimeVideo: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor">
      <path d="M5.25 4.5c-.66 0-1.2.54-1.2 1.2v12.6c0 .66.54 1.2 1.2 1.2h13.5c.66 0 1.2-.54 1.2-1.2V5.7c0-.66-.54-1.2-1.2-1.2H5.25zM12 8.1l3.15 1.95v3.9L12 15.9l-3.15-1.95v-3.9L12 8.1zm0 1.5l-1.65 1.05v1.95L12 13.65l1.65-1.05v-1.95L12 9.6z"/>
    </svg>
  ),

  // ZEE5 Icon
  ZEE5: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor">
      <path d="M2 2v20h20V2H2zm18 18H4V4h16v16zM6 6v2h8l-8 8v2h10v-2H8l8-8V6H6z"/>
    </svg>
  ),

  // Sony Icon
  Sony: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor">
      <path d="M8.54 10.23h6.92c.41 0 .74.33.74.74v1.49c0 .41-.33.74-.74.74H8.54c-.41 0-.74-.33-.74-.74v-1.49c0-.41.33-.74.74-.74zM2 8.46v7.08h20V8.46H2zm18.26 5.34H3.74V10.2h16.52v3.6z"/>
    </svg>
  ),

  // Gagana Plus (Generic Streaming Icon)
  GaganaPlus: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
    </svg>
  )
};

// Usage helper function
export const getServiceIcon = (serviceName: string) => {
  const name = serviceName.toLowerCase().replace(/\s+/g, '');
  
  if (name.includes('spotify')) return ServiceIcons.Spotify;
  if (name.includes('youtube') && name.includes('music')) return ServiceIcons.YouTubeMusic;
  if (name.includes('youtube')) return ServiceIcons.YouTube;
  if (name.includes('prime') || name.includes('amazon')) return ServiceIcons.PrimeVideo;
  if (name.includes('zee5') || name.includes('zee')) return ServiceIcons.ZEE5;
  if (name.includes('sony')) return ServiceIcons.Sony;
  if (name.includes('gagana')) return ServiceIcons.GaganaPlus;
  
  // Default fallback
  return () => <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">🎵</div>;
};