import Image from 'next/image';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Grid overlay effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-miami-dark/50 to-miami-dark" />

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4">
        {/* Freejack Logo - Giant Center */}
        <div className="relative mb-12">
          {/* Main logo */}
          <div className="relative size-64 md:size-96 lg:size-[32rem]">
            <Image
              src="/freejack_logo.png"
              alt="Freejack Logo"
              width={512}
              height={512}
              priority
              className="size-full object-contain"
            />
          </div>
        </div>

        {/* Hero Copy - Agulla & Baccetti style */}
        <div className="max-w-3xl space-y-6 text-center">
          <p className="text-xl font-light tracking-wide text-gray-300 md:text-2xl lg:text-3xl">
            The web is yours now.
          </p>

          <div className="pt-4">
            <p className="font-mono text-sm uppercase tracking-widest text-gray-400 md:text-base">AI Web Agent</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col gap-4 sm:flex-row">
          <a
            href="https://chromewebstore.google.com/detail/freejack-ai-web-agent/YOUR_EXTENSION_ID"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-crimson px-8 py-4 text-center text-lg font-bold transition-all hover:scale-105">
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-crimson via-neon-magenta to-neon-cyan opacity-0 transition-opacity group-hover:opacity-100" />
          </a>

          <a
            href="#features"
            className="glass-morphism neon-border rounded-full px-8 py-4 text-center text-lg font-bold transition-all hover:bg-white/10">
            Learn More
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-neon-cyan/50 p-2">
            <div className="h-2 w-1 animate-bounce rounded-full bg-gradient-to-b from-neon-cyan to-neon-magenta" />
          </div>
        </div>
      </section>

      {/* Features Section - Simplified */}
      <section id="features" className="relative px-4 py-20">
        <div className="mx-auto max-w-5xl">
          {/* Section Title */}
          <h2 className="mb-16 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-crimson bg-clip-text text-center text-3xl font-bold text-transparent md:text-4xl">
            FreeJack Features
          </h2>

          {/* Features Grid - 3 Steps */}
          <div className="mb-20 grid gap-12 md:grid-cols-3">
            {/* Step 1 */}
            <div className="space-y-4 text-center">
              <div className="mx-auto flex size-20 items-center justify-center rounded-full border-2 border-neon-cyan">
                <svg className="size-10 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Install Extension</h3>
              <p className="text-sm text-gray-400">Add FreeJack to Chrome with one click.</p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 text-center">
              <div className="mx-auto flex size-20 items-center justify-center rounded-full border-2 border-neon-magenta">
                <svg className="size-10 text-neon-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <p className="text-sm text-gray-400">Choose your preferred AI model or use our free tier.</p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 text-center">
              <div className="mx-auto flex size-20 items-center justify-center rounded-full border-2 border-neon-crimson">
                <svg className="size-10 text-neon-crimson" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Automate</h3>
              <p className="text-sm text-gray-400">Describe what you want to do in plain English.</p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
            {/* Cost Effective */}
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-neon-cyan">
                <svg className="size-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="mb-1 text-lg font-bold text-white">Cost Effective</h4>
                <p className="text-sm text-gray-400">Generous free tier and transparent pricing.</p>
              </div>
            </div>

            {/* Get Started Quickly */}
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-neon-magenta">
                <svg className="size-6 text-neon-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="mb-1 text-lg font-bold text-white">Get Started Quickly</h4>
                <p className="text-sm text-gray-400">Three simple steps to automate web tasks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 text-center font-mono text-sm text-gray-500">
        <p>Built for the future. Available now.</p>
        <p className="mt-2">© 2026 Freejack</p>
      </footer>
    </main>
  );
}
