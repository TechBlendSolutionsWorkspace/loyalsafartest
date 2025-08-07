import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";

// Import video assets
import theatreVideoPath from "@assets/Winter Theatre Performance Video Intro in Red Animated Style_1754152024546.mp4";

interface VideoHeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  videoUrl?: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  features: string[];
}

const heroSlides: VideoHeroSlide[] = [
  {
    id: "netflix-india",
    title: "Premium Netflix Experience",
    subtitle: "India's Favorite Entertainment",
    description: "Stream Sacred Games, Delhi Crime, and thousands of international titles with 4K Ultra HD quality. Get your Netflix Premium subscription at unbeatable prices.",
    backgroundImage: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    videoUrl: theatreVideoPath,
    ctaText: "Get Netflix Now",
    ctaLink: "/category/ott",
    badge: "69% OFF",
    features: ["4K Ultra HD", "Multiple Screens", "Download Content", "Ad-Free"]
  },
  {
    id: "hotstar-sports",
    title: "JioHotstar + Live Sports",
    subtitle: "Home of Cricket",
    description: "Watch IPL, FIFA World Cup, Olympics and your favorite Disney+ content. India's largest OTT platform with 50 crore active users.",
    backgroundImage: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    ctaText: "Watch Live Sports",
    ctaLink: "/category/ott",
    badge: "MOST POPULAR",
    features: ["Live IPL", "Disney+ Content", "12 Languages", "HD Sports"]
  },
  {
    id: "prime-video",
    title: "Amazon Prime Video",
    subtitle: "Prime Benefits",
    description: "Enjoy The Family Man, Mirzapur, and exclusive Amazon Originals. Plus get Amazon shopping benefits with your Prime membership.",
    backgroundImage: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    ctaText: "Start Prime",
    ctaLink: "/category/ott",
    features: ["Amazon Originals", "Shopping Benefits", "Live Cricket", "Mobile Plan"]
  },
  {
    id: "digital-bundle",
    title: "Complete Digital Suite",
    subtitle: "Everything in One Place",
    description: "Get Netflix, Prime Video, JioHotstar, Spotify Premium, NordVPN and more - all at prices that make digital entertainment affordable for every Indian family.",
    backgroundImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    ctaText: "Explore All Services",
    ctaLink: "/",
    badge: "BEST VALUE",
    features: ["15+ OTT Platforms", "VPN Security", "Cloud Storage", "Music Streaming"]
  }
];

export default function VideoHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const currentHero = heroSlides[currentSlide];

  // Auto-slide functionality
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 6000); // Change slide every 6 seconds
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  // Video controls and loading
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleCanPlay = () => setIsVideoLoaded(true);
      const handleError = () => setIsVideoLoaded(false);
      
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      
      video.muted = isMuted;
      if (isPlaying && isVideoLoaded) {
        video.play().catch(() => {
          // Auto-play failed, which is expected in many browsers
        });
      } else {
        video.pause();
      }
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [isPlaying, isMuted, currentSlide, isVideoLoaded]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-red-950 via-black to-purple-950 theater-container">
      {/* Theater Curtains & Frame */}
      <div className="absolute inset-0 z-20 pointer-events-none theater-frame">
        <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-red-900 via-red-800 to-transparent opacity-90 theater-curtain-left" />
        <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-red-900 via-red-800 to-transparent opacity-90 theater-curtain-right" />
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-red-900 to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black via-red-950 to-transparent opacity-95" />
      </div>

      {/* Premium Theater Screen */}
      <div className="absolute inset-0 w-full h-full theater-screen-container" style={{ padding: '20px' }}>
        {currentHero.videoUrl && isVideoLoaded ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover theater-screen rounded-lg shadow-2xl"
            loop
            muted={isMuted}
            playsInline
            autoPlay
            style={{ 
              filter: 'brightness(0.9) contrast(1.15) saturate(1.1)',
              border: '3px solid rgba(255, 215, 0, 0.3)',
              boxShadow: '0 0 50px rgba(255, 215, 0, 0.2), inset 0 0 20px rgba(0, 0, 0, 0.3)'
            }}
            onCanPlay={() => setIsVideoLoaded(true)}
            onError={() => setIsVideoLoaded(false)}
          >
            <source src={currentHero.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat theater-screen rounded-lg shadow-2xl"
            style={{ 
              backgroundImage: `url(${currentHero.backgroundImage})`,
              filter: 'brightness(0.8) contrast(1.1)',
              border: '3px solid rgba(255, 215, 0, 0.3)',
              boxShadow: '0 0 50px rgba(255, 215, 0, 0.2), inset 0 0 20px rgba(0, 0, 0, 0.3)'
            }}
          />
        )}
      </div>

      {/* Sparkle & Light Effects */}
      <div className="absolute inset-0 z-15 pointer-events-none theater-effects">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-pulse theater-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              boxShadow: '0 0 6px rgba(255, 255, 0, 0.6)'
            }}
          />
        ))}
      </div>
        
      {/* Premium Theater Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-transparent to-black/70 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-red-950/10 to-transparent z-10" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-amber-900/5 to-black/30 z-10" />

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Badge */}
            {currentHero.badge && (
              <Badge 
                variant="destructive" 
                className="mb-4 text-sm font-bold px-3 py-1 bg-red-600 text-white animate-pulse"
              >
                {currentHero.badge}
              </Badge>
            )}

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
              {currentHero.title}
            </h1>

            {/* Subtitle */}
            <h2 className="text-xl md:text-2xl text-gray-200 mb-6 font-light">
              {currentHero.subtitle}
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              {currentHero.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-3 mb-8">
              {currentHero.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm border border-white/20"
                >
                  ✨ {feature}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="theater-cta-button text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl transition-all duration-300"
                onClick={() => window.location.href = currentHero.ctaLink}
              >
                <Play className="mr-2 h-5 w-5" />
                {currentHero.ctaText}
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border hover:text-accent-foreground h-11 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm bg-[#135e14e6]"
                onClick={() => window.location.href = "https://wa.me/917496067495"}
              >
                Contact on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md px-6 py-3 rounded-full">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={prevSlide}
            className="text-white hover:bg-white/20 p-2 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Slide Indicators */}
          <div className="flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-red-600 scale-125"
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={nextSlide}
            className="text-white hover:bg-white/20 p-2 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Video Controls */}
      {currentHero.videoUrl && (
        <div className="absolute top-8 right-8 z-20 flex gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white hover:bg-white/20 p-2 rounded-full backdrop-blur-sm"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="text-white hover:bg-white/20 p-2 rounded-full backdrop-blur-sm"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>
      )}

      {/* Cinematic Curtain Effect */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black to-transparent z-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent z-30 pointer-events-none" />
    </section>
  );
}

// Fix missing Pause import
const Pause = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
  </svg>
);