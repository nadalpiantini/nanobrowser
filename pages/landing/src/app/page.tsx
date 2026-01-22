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

      {/* Features Section - Simplified */}
      <section className="relative py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-crimson">
            FreeJack Features
          </h2>

          {/* Features Grid - 3 Steps */}
          <div className="grid md:grid-cols-3 gap-12 mb-20">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full border-2 border-neon-cyan flex items-center justify-center">
                <svg className="w-10 h-10 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Install Extension</h3>
              <p className="text-gray-400 text-sm">Add FreeJack to Chrome with one click.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full border-2 border-neon-magenta flex items-center justify-center">
                <svg className="w-10 h-10 text-neon-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Configure Model</h3>
              <p className="text-gray-400 text-sm">Choose your preferred AI model or use our free tier.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full border-2 border-neon-crimson flex items-center justify-center">
                <svg className="w-10 h-10 text-neon-crimson" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Automate</h3>
              <p className="text-gray-400 text-sm">Describe what you want to do in plain English.</p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Cost Effective */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-neon-cyan flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Cost Effective</h4>
                <p className="text-gray-400 text-sm">Generous free tier and transparent pricing.</p>
              </div>
            </div>

            {/* Get Started Quickly */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-neon-magenta flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-neon-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Get Started Quickly</h4>
                <p className="text-gray-400 text-sm">Three simple steps to automate web tasks.</p>
              </div>
            </div>
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
