export default function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating Tech Icons */}
      <div className="floating-element absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
        <i className="fas fa-play text-blue-400 text-xl"></i>
      </div>
      
      <div className="floating-element absolute top-40 right-20 w-12 h-12 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
        <i className="fas fa-shield-alt text-green-400 text-lg"></i>
      </div>
      
      <div className="floating-element absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
        <i className="fas fa-cloud text-pink-400 text-2xl"></i>
      </div>
      
      <div className="floating-element absolute bottom-20 right-10 w-14 h-14 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
        <i className="fas fa-music text-orange-400 text-lg"></i>
      </div>
      
      {/* Floating Orbs */}
      <div className="floating-element absolute top-1/3 left-1/4 w-8 h-8 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full animate-glow"></div>
      <div className="floating-element absolute bottom-1/3 right-1/4 w-6 h-6 bg-gradient-to-r from-green-400/30 to-teal-400/30 rounded-full animate-glow" style={{ animationDelay: '1s' }}></div>
      <div className="floating-element absolute top-1/2 right-1/3 w-10 h-10 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full animate-glow" style={{ animationDelay: '2s' }}></div>
    </div>
  );
}