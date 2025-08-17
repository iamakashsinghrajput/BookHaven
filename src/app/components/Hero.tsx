const Hero = () => {

  return (
    <main className="relative bg-white pt-24 pb-24 overflow-hidden">
      {/* Background shape */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0">
        <div
          className="absolute w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600"
          style={{
            clipPath: 'polygon(20% 0, 40% 100%, 0, 80%)',
            transform: 'rotate(30deg) scale(1)',
            transformOrigin: 'bottom right',
          }}
        ></div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Heading */}
        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-extrabold text-black uppercase tracking-tighter leading-none font-rampart">
          Your Next
          <br />
          Chapter Awaits
        </h1>

        {/* Content Cards Grid (your existing code) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {/* Card 1 */}
          <div className="bg-brand-yellow p-6 shadow-lg md:mt-12 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <p className="text-sm font-semibold text-gray-700">Saturday, July 2nd 13h00</p>
            <h3 className="text-2xl font-bold text-black mt-2">Author Spotlight: Jane Doe</h3>
            <span className="inline-block bg-white/50 text-black text-xs font-semibold mt-4 px-3 py-1 rounded-full">
              Live Event
            </span>
          </div>

          {/* Card 2 */}
          <div
            className="relative h-96 bg-cover bg-center shadow-lg md:-mt-8 p-6 flex flex-col justify-end text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{ backgroundImage: "url('/book.png')" }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10">
              <p className="text-sm font-semibold text-white">Saturday, July 2nd 13h00</p>
              <h3 className="text-2xl font-bold text-white mt-2">Summer Reading Challenge</h3>
              <span className="inline-block bg-white/30 text-white text-xs font-semibold mt-4 px-3 py-1 rounded-full">
                Contest
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 md:mt-24">
            <h3 className="text-3xl font-bold text-black">Discover New Worlds</h3>
            <p className="text-black/90 mt-2">Explore our latest arrivals.</p>
          </div>

          {/* Card 4 */}
          <div
            className="relative h-80 bg-cover bg-center shadow-lg p-6 flex flex-col justify-end text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{ backgroundImage: "url('/library.png')" }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white">A Hub for Knowledge: How Libraries Empower Students</h3>
              <span className="inline-block bg-white/30 text-white text-xs font-semibold mt-4 px-3 py-1 rounded-full">
                In The Media
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;