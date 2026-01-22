export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Grid overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-miami-dark/50 to-miami-night pointer-events-none" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
        {/* Logo 10x - Giant Center */}
        <div className="relative mb-12 animate-float">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-purple blur-3xl opacity-30 animate-pulse" />
          <svg
            className="relative w-64 h-64 md:w-96 md:h-96 lg:w-[32rem] lg:h-[32rem]"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            {/* 10x Logo - Modern geometric design */}
            <g className="animate-glow">
              {/* "10" */}
              <text
                x="30"
                y="120"
                fontSize="100"
                fontWeight="900"
                fill="url(#gradient1)"
                fontFamily="SF Pro Display, system-ui">
                10
              </text>
              {/* "X" */}
              <text
                x="145"
                y="120"
                fontSize="100"
                fontWeight="900"
                fill="url(#gradient2)"
                fontFamily="SF Pro Display, system-ui">
                x
              </text>
            </g>

            {/* Gradients */}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF10F0" />
                <stop offset="100%" stopColor="#00F0FF" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="100%" stopColor="#FFF000" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Hero Copy - Agulla & Baccetti style */}
        <div className="text-center space-y-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-purple">
              Freejack
            </span>
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-light tracking-wide">
            The web is yours now.
          </p>

          <div className="pt-8">
            <p className="text-sm md:text-base text-gray-400 font-mono uppercase tracking-widest">AI Web Agent</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col sm:flex-row gap-4">
          <a
            href="#"
            className="group relative px-8 py-4 bg-gradient-to-r from-neon-pink to-neon-cyan rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105">
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          <a
            href="#"
            className="px-8 py-4 glass-morphism neon-border rounded-full font-bold text-lg hover:bg-white/10 transition-all">
            Learn More
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-neon-cyan/50 rounded-full flex justify-center p-2">
            <div className="w-1 h-2 bg-neon-cyan rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Section - Minimal */}
      <section className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Think', desc: 'Plans your workflow' },
              { title: 'Navigate', desc: 'Executes with precision' },
              { title: 'Deliver', desc: 'Gets it done' },
            ].map((feature, i) => (
              <div key={i} className="glass-morphism p-8 rounded-2xl hover:scale-105 transition-transform">
                <h3 className="text-2xl font-bold mb-4 text-glow text-neon-cyan">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="relative py-16 text-center text-gray-500 text-sm font-mono">
        <p>Built for the future. Available now.</p>
        <p className="mt-2">© 2026 Freejack</p>
      </footer>
    </main>
  );
}
