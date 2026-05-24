# Portfolio Website Specification

## 1. Sitemap

| Page | Sections | Route |
|------|----------|-------|
| Home | Hero, About, Work, Skills, Experience, Contact | `/` |

All sections are single-page scroll sections.

---

## 2. Component Tree

```
App
├── Navbar
│   ├── Logo
│   ├── NavLinks
│   ├── CTA_Button
│   └── ThemeToggle
├── DotNav
├── HeroSection
│   ├── HeroText
│   ├── ThreeCanvas
│   │   └── SceneManager (wireframe cube, core, particles, bloom)
│   ├── StatWidget (x2)
│   └── ScrollIndicator
├── AboutSection
│   ├── SectionHeader
│   └── StatCard (x4)
├── WorkSection
│   ├── SectionHeader
│   └── ProjectCard (x3)
├── SkillsSection
│   ├── SectionHeader
│   └── SkillOrb (x10)
├── ExperienceSection
│   ├── SectionHeader
│   └── ExperienceCard (x2)
│       └── TimelineNode
├── ContactSection
│   ├── ContactInfo
│   └── ContactForm
└── Footer
```

### Props Contracts

```typescript
// StatWidget
interface StatWidgetProps {
  value: string;
  label: string;
  position: 'top-left' | 'bottom-right';
}

// TechIconCard
interface TechIconCardProps {
  icon: string;
  label: string;
  orbitAngle?: number;
}

// StatCard
interface StatCardProps {
  icon: string;
  value: string;
  label: string;
}

// ProjectCard
interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  image: string;
  link?: string;
}

// SkillOrb
interface SkillOrbProps {
  name: string;
  proficiency: number;
  years: number;
}

// ExperienceCard
interface ExperienceCardProps {
  role: string;
  company: string;
  date: string;
  bullets: string[];
  side: 'left' | 'right';
}
```

---

## 3. Design Token System

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a0a0a` | Page background |
| `--bg-secondary` | `#111111` | Card backgrounds |
| `--accent-primary` | `#FF6B00` | Primary accent |
| `--accent-secondary` | `#FF9A3C` | Gradient endpoint |
| `--accent-glow` | `#FF4500` | Bloom/glow color |
| `--text-primary` | `#FFFFFF` | Headlines |
| `--text-secondary` | `#E0E0E0` | Body text |
| `--text-muted` | `#888888` | Labels, captions |
| `--glass-bg` | `rgba(255,107,0,0.05)` | Glassmorphism fill |
| `--glass-border` | `rgba(255,107,0,0.15)` | Glassmorphism border |
| `--glass-border-hover` | `rgba(255,107,0,0.4)` | Hover state border |

### Typography

| Token | Value |
|-------|-------|
| `--font-primary` | `Inter`, system-ui, sans-serif |
| `--font-mono` | `'JetBrains Mono'`, monospace |
| `--hero-size` | `72px` |
| `--h2-size` | `48px` |
| `--h3-size` | `32px` |
| `--body-size` | `16px` |
| `--label-size` | `14px` |
| `--section-label-size` | `16px` |

### Spacing Scale

| Token | Value |
|-------|-------|
| `--space-xs` | `4px` |
| `--space-sm` | `8px` |
| `--space-md` | `16px` |
| `--space-lg` | `24px` |
| `--space-xl` | `40px` |
| `--space-2xl` | `64px` |
| `--space-3xl` | `96px` |

### Breakpoints

| Token | Value |
|-------|-------|
| `--bp-mobile` | `375px` |
| `--bp-tablet` | `768px` |
| `--bp-desktop` | `1024px` |
| `--bp-wide` | `1440px` |

---

## 4. 3D Interaction Contract

### Three.js Objects

| Object | Geometry | Material | Behavior |
|--------|----------|----------|----------|
| Crystalline Cube | `BoxGeometry(2,2,2)` + `EdgesGeometry` | `MeshPhysicalMaterial` (transmission:0.9, roughness:0.05); `LineBasicMaterial` (#FF6B00) | Scroll rotation, hover tilt, click explosion |
| Inner Core | `IcosahedronGeometry(0.4)` | `MeshStandardMaterial` (emissive:#FF4500) | Pulse scale animation |
| Floating Particles | `BufferGeometry` (200 points) | `PointsMaterial` (#FF6B00, 0.3 opacity) | Slow drift (noise-based) |
| Orbit Cards | HTML overlay via CSS3DRenderer | CSS transforms | Elliptical orbit at 0.003 rad/frame |

### Interactions

| Trigger | Object | Effect |
|---------|--------|--------|
| Scroll | Cube | Rotate Y and X proportional to scroll (GSAP ScrollTrigger) |
| Hover | Cube | Tilt 15° toward mouse (lerped, ~0.1 factor); edge glow intensify |
| Hover | Core | Brighten emissive to `#FF6B00` |
| Click | Cube | Explosive burst: 50 orange particles, fade 800ms; spring reset |
| Hover | Orbit | Pause orbit speed |
| Resize | Scene | Update camera aspect + renderer size |

### Post-Processing

- `UnrealBloomPass` (threshold:0.8, strength:1.5, radius:0.5)
- Applied to all scene renders for glow effect

---

## 5. Animation Timeline (GSAP)

### Entry Animations

| Section | Elements | Animation | Duration | Ease |
|---------|----------|-----------|----------|------|
| **Global** | Section children | opacity 0→1, y:40→0 | 0.8s | `power3.out` |
| **Global** | Stagger | Per-child delay | 0.15s | — |
| **Trigger** | ScrollTrigger | start: `"top 80%"` | — | — |

### Specific Animations

| Section | Element | Animation |
|---------|---------|-----------|
| Navbar | On scroll >50px | `backdrop-blur-md` + `bg-opacity-80` class toggle |
| Hero | Headline words | Stagger fade-up, 0.1s per word |
| Hero | StatWidgets | Float animation (CSS keyframes, 3s infinite) |
| Hero | ScrollIndicator | Bounce animation, 1.5s infinite |
| About | StatCards | Stagger in, scale 0.95→1 |
| Work | ProjectCards | Slide up + fade, stagger 0.2s |
| Skills | SkillOrbs | Pop in with bounce, stagger 0.1s |
| Experience | Cards | Slide from left/right alternating |
| Contact | Form fields | Slide up, stagger 0.1s |

### Scroll-Triggered Transitions

| Section | Trigger Point | Effect |
|---------|---------------|--------|
| Hero → About | Hero bottom visible | Fade hero text slightly; About section enters |
| About | Top 80% viewport | Stats counter animate from 0 |
| Work | Top 80% | Cards slide up |
| Skills | Top 80% | Orbs expand from 0 scale |
| Experience | Top 80% | Timeline draws (CSS stroke-dashoffset) |
| Contact | Top 80% | Form fields stagger in |

---

## 6. File/Folder Structure

```
portfolio/
├── docs/
│   ├── spec.md
│   └── qa-report.md
├── public/
│   └── (static assets)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── HeroSection.jsx
│   │   ├── AboutSection.jsx
│   │   ├── WorkSection.jsx
│   │   ├── SkillsSection.jsx
│   │   ├── ExperienceSection.jsx
│   │   ├── ContactSection.jsx
│   │   ├── Footer.jsx
│   │   ├── ThreeCanvas.jsx
│   │   ├── StatWidget.jsx
│   │   ├── TechIconCard.jsx
│   │   ├── StatCard.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── SkillOrb.jsx
│   │   ├── ExperienceCard.jsx
│   │   ├── ContactForm.jsx
│   │   ├── DotNav.jsx
│   │   └── ScrollIndicator.jsx
│   ├── three/
│   │   └── SceneManager.js
│   ├── styles/
│   │   ├── tokens.css
│   │   └── globals.css
│   ├── data/
│   │   └── content.json
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## 7. External Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.160.0",
    "gsap": "^3.12.5",
    "@studio-freight/lenis": "^1.0.42"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.8"
  }
}
```

### CDN Resources (index.html)

- Google Fonts: Inter (400, 500, 600, 700), JetBrains Mono (400)
- Three.js via npm (not CDN for bundler compatibility)

### Icon Sources

- `lucide-react` for UI icons (GitHub, LinkedIn, Mail, Arrow, Sun, Moon, etc.)

---

## 8. Global Rules

1. **No inline styles** — all styling via Tailwind classes or CSS custom properties from `tokens.css`
2. **All Three.js scenes must call `destroy()` on component unmount** to prevent memory leaks
3. **Commit-ready** — clean file structure, no console.log in production code (except contact form placeholder)
4. **Final project must run with**: `npm install && npm run dev`
5. **All content from `/src/data/content.json`** — no hardcoded strings in components
6. **Theme toggle** toggles `.light-mode` on `<body>`; default is dark
