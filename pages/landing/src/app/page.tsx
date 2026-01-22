import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Grid overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-miami-dark/50 to-miami-dark pointer-events-none" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
        {/* Freejack Logo - Giant Center */}
        <div className="relative mb-12">
          {/* Main logo */}
          <div className="relative w-64 h-64 md:w-96 md:h-96 lg:w-[32rem] lg:h-[32rem]">
            <Image
              src="/freejack_logo.png"
              alt="Freejack Logo"
              width={512}
              height={512}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Hero Copy - Agulla & Baccetti style */}
        <div className="text-center space-y-6 max-w-3xl">
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-light tracking-wide">
            The web is yours now.
          </p>

          <div className="pt-4">
            <p className="text-sm md:text-base text-gray-400 font-mono uppercase tracking-widest">AI Web Agent</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col sm:flex-row gap-4">
          <a
            href="#"
            className="group relative px-8 py-4 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-crimson rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105">
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-crimson via-neon-magenta to-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
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
            <div className="w-1 h-2 bg-gradient-to-b from-neon-cyan to-neon-magenta rounded-full animate-bounce" />
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
