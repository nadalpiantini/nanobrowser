# Freejack Landing Page 🌴

Miami Nights 80's landing page for Freejack AI Web Agent.

## Design Concept

**Miami 80's × Apple Tahoe 2026**

- 🌴 **Miami Nights 80's**: Neon colors (magenta/cyan/yellow), retro grid, glow effects
- 🍎 **Apple Tahoe 2026**: Clean, spacious, minimalist aesthetics
- ✍️ **Copy Style**: Agulla & Baccetti - concise, memorable, intelligent

## Tech Stack

- **Next.js 15** - App Router, React Server Components
- **React 19** - Latest features
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **PostCSS** - CSS processing

## Quick Start

```bash
# Install dependencies (from repo root)
pnpm install

# Start dev server
pnpm dev

# Open browser
http://localhost:3001
```

## Design Elements

### Colors (Miami Nights)
- **Neon Pink**: `#FF10F0`
- **Neon Cyan**: `#00F0FF`
- **Neon Yellow**: `#FFF000`
- **Neon Purple**: `#B026FF`
- **Miami Night**: `#0A0E27` (background)

### Typography
- **Display**: SF Pro Display (headings, brand)
- **Mono**: SF Mono (technical text)

### Animations
- **Float**: 6s ease-in-out infinite (logo)
- **Glow**: 2s alternate (neon text effects)
- **Pulse**: Built-in Tailwind (background glow)

## Components

### Hero Section
- Freejack logo (500×500px) with neon glow
- Animated float effect
- Gradient overlay for depth
- Headline: "Freejack"
- Tagline: "The web is yours now."
- Subtitle: "AI Web Agent"
- CTAs: Get Started / Learn More

### Features Section
- **Think**: Plans your workflow
- **Navigate**: Executes with precision
- **Deliver**: Gets it done

### Footer
- Minimal design
- "Built for the future. Available now."
- Copyright © 2026 Freejack

## File Structure

```
pages/landing/
├── src/
│   └── app/
│       ├── layout.tsx       # Root layout with metadata
│       ├── page.tsx         # Home page component
│       └── globals.css      # Global styles + Miami theme
├── public/
│   ├── freejack_logo.png    # Main logo (500×500)
│   ├── freejack-hero.png    # Hero variant
│   └── favicon.ico          # Site icon
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind + Miami theme
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

## Customization

### Changing Colors
Edit `tailwind.config.js`:
```js
colors: {
  neon: {
    pink: '#FF10F0',    // Change here
    cyan: '#00F0FF',
    yellow: '#FFF000',
  }
}
```

### Changing Copy
Edit `src/app/page.tsx`:
```tsx
<p>The web is yours now.</p>  // Change tagline here
```

### Adding Sections
Add new `<section>` elements in `src/app/page.tsx` after the hero.

## Build for Production

```bash
# Build
pnpm build

# Start production server
pnpm start
```

## Deployment

The landing page is configured for **standalone output** and can be deployed to:
- Vercel (recommended)
- Netlify
- Any Node.js hosting

## Performance

- ✅ Next.js Image optimization
- ✅ React Server Components
- ✅ CSS-in-JS with Tailwind
- ✅ Minimal JavaScript bundle
- ✅ Font optimization (system fonts)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 15+

## License

Part of the Freejack project.

---

**Made with ❤️ by the Freejack team**
Miami vibes × Silicon Valley execution 🌴✨
