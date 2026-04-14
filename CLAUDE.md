# CLAUDE.md — Rev. Emeka Eze Birthday Website

> Read this file in full before writing any code. This is your complete project brief.

---

## 1. What You Are Building

A **single-page, modern, fully responsive celebration website** for the birthday of **Highly Reverend Emeka Eze**.

- One HTML page with smooth anchor-scroll navigation
- Seven distinct sections, each with its own visual identity
- Animated, luxury aesthetic — bold typography, gold accents, cinematic hero
- RSVP form with backend submission
- Fully functional on mobile, tablet, and desktop

---

## 2. Tech Stack

| Concern        | Use This                                                             |
| -------------- | -------------------------------------------------------------------- |
| Structure      | HTML5 semantic markup                                                |
| Styling        | Tailwind CSS (CDN) + custom CSS variables                            |
| Smooth Scroll  | Lenis v1.0.42 (CDN) — replaces native browser scroll                 |
| Animations     | GSAP 3.12.5 + ScrollTrigger (CDN) — all scroll-driven motion         |
| Text Splitting | Split Type 0.3.4 (CDN) — line/word/char splits for staggered reveals |
| Countdown      | Vanilla JavaScript (no library needed)                               |
| Fonts          | Google Fonts — display: `Playfair Display`, body: `DM Sans`          |
| Icons          | Lucide Icons (CDN) or inline SVG                                     |
| Map            | Google Maps iframe embed (no API key required)                       |
| RSVP Backend   | Formspree (free tier) — endpoint to be added by client               |
| Hosting        | Vercel or Netlify static deployment                                  |

> If the client later specifies a different backend or framework, adapt accordingly. Default to the above.

---

## 3. Design Tokens

Apply these consistently via CSS custom properties at `:root`.

```css
:root {
  /* Colours */
  --color-bg-dark: #0a0a1a; /* Midnight Navy — primary dark background */
  --color-bg-light: #f5edd6; /* Champagne — light section backgrounds */
  --color-gold: #c9a84c; /* Royal Gold — accents, borders, highlights */
  --color-gold-light: #f0d98a; /* Light Gold — hover states, shimmer */
  --color-text-light: #f0ebe3; /* Off-White — text on dark backgrounds */
  --color-text-dark: #1a1a2e; /* Deep Charcoal — text on light backgrounds */
  --color-text-muted: #9a8e7e; /* Muted — captions, secondary labels */

  /* Typography */
  --font-display: "Playfair Display", Georgia, serif;
  --font-body: "DM Sans", system-ui, sans-serif;

  /* Spacing scale */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 2rem;
  --space-lg: 4rem;
  --space-xl: 8rem;

  /* Borders & Radius */
  --radius-sm: 0.5rem;
  --radius-md: 1rem;
  --radius-lg: 1.5rem;
  --border-gold: 1px solid var(--color-gold);
}
```

---

## 4. Global Rules

- **Mobile-first.** Build at 375px, expand with breakpoints at 768px and 1280px.
- **Sections alternate** between dark (`--color-bg-dark`) and light (`--color-bg-light`) backgrounds for visual rhythm. Hero = dark. Venue = light. Schedule = dark. Theme = light. RSVP = dark. Travel = light. Hotels = dark.
- **Sticky navigation** with `backdrop-filter: blur(12px)` and a semi-transparent dark background on scroll.
- **Smooth scroll** on all anchor links: `html { scroll-behavior: smooth; }`.
- **All images** must have descriptive `alt` attributes.
- **All form inputs** must have associated `<label>` elements.
- **Do not use** Inter, Roboto, Arial, or system fonts for display text.
- **Do not use** purple gradients or generic AI-aesthetic design patterns.
- **Never use `<form>` with default page-reload** — intercept submission with JavaScript.

---

## 5. Navigation

Sticky top bar. On mobile: hamburger menu that opens a full-screen overlay nav.

```
Logo/Monogram (left)    Home · Venue · Schedule · Dress Code · RSVP · Travel · Hotels    RSVP Button (right, gold)
```

| Label      | Anchor      |
| ---------- | ----------- |
| Home       | `#home`     |
| Venue      | `#venue`    |
| Schedule   | `#schedule` |
| Dress Code | `#theme`    |
| RSVP       | `#rsvp`     |
| Travel     | `#travel`   |
| Hotels     | `#hotels`   |

---

## 6. Sections — Build in This Order

---

### Section 1 — Home (`#home`)

**Purpose:** Full-screen cinematic hero. Immediate emotional impact.

**Content to render:**

- Portrait photo of Rev. Emeka Eze (full-bleed background)
- Name: `Highly Reverend Emeka Eze`
- Event date: `[DATE — to be provided by client]`
- Venue address: `[ADDRESS — to be provided by client]`
- Live countdown timer: Days · Hours · Minutes · Seconds

**Implementation:**

- Full viewport height (`100vh`)
- Photo as CSS `background-image` with `background-size: cover; background-position: center top`
- Dark gradient overlay: `linear-gradient(to top, rgba(10,10,26,0.95) 0%, rgba(10,10,26,0.4) 60%, transparent 100%)`
- Name in `--font-display`, large (clamp 3rem–7rem), centred, `--color-text-light`
- A thin gold horizontal rule (`2px solid var(--color-gold)`) between name and date
- Date in a refined monospaced or condensed style, `--color-gold`, letter-spaced
- Address in `--font-body`, small, `--color-text-muted`
- Countdown: four boxes in a row, each with a large numeral and a label (DAYS / HRS / MIN / SEC). Gold border, semi-transparent dark fill, gap between boxes
- Scroll-down chevron at the bottom centre, animated with a gentle bounce (`@keyframes bounce`)
- GSAP entrance: name fades up, rule scales in, date and address stagger in, countdown boxes pop in with delay

**Countdown JS logic:**

```javascript
// Set this to the actual event datetime
const eventDate = new Date("2026-01-01T10:00:00");

function updateCountdown() {
  const now = new Date();
  const diff = eventDate - now;
  if (diff <= 0) {
    /* show "Event has started!" */ return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  // Update DOM elements
}
setInterval(updateCountdown, 1000);
updateCountdown();
```

---

### Section 2 — Event Venue (`#venue`)

**Purpose:** Orient guests to the physical location.

**Content to render:**

- Section heading: `Event Venue`
- Venue name: `[VENUE NAME — to be provided by client]`
- Full address: `[FULL ADDRESS — to be provided by client]`
- 2–3 sentence venue description: `[TO BE PROVIDED BY CLIENT]`
- Google Maps iframe centred on the venue
- "Get Directions" button → opens Google Maps in new tab

**Implementation:**

- Light background (`--color-bg-light`)
- Two-column layout on desktop: text left, map right. Single column on mobile (map below text).
- Map iframe: `width: 100%; height: 400px; border-radius: var(--radius-md); border: var(--border-gold);`
- Map embed URL template: `https://maps.google.com/maps?q=[ENCODED+ADDRESS]&output=embed`
- "Get Directions" CTA: outlined gold button, opens `https://maps.google.com/?q=[ADDRESS]` in `_blank`
- ScrollTrigger: text slides in from left, map fades in from right

---

### Section 3 — Schedule (`#schedule`)

**Purpose:** A scannable timeline of all events across the day.

**Content to render (placeholders — client to replace):**

| Time     | Event                          | Location      |
| -------- | ------------------------------ | ------------- |
| 10:00 AM | Thanksgiving Service           | [Church Name] |
| 1:00 PM  | Cocktail Reception             | [Venue Foyer] |
| 3:00 PM  | Birthday Luncheon              | [Main Hall]   |
| 7:00 PM  | Evening Dinner & Entertainment | [Ballroom]    |

**Implementation:**

- Dark background (`--color-bg-dark`)
- Vertical timeline: a centred vertical gold line (`2px solid var(--color-gold)`)
- Event cards alternate left and right of the line on desktop; single column on mobile
- Each card contains:
  - Time badge: gold pill (`background: var(--color-gold); color: var(--color-bg-dark); border-radius: 999px; padding: 0.25rem 0.75rem; font-size: 0.85rem; font-weight: 700`)
  - Event name: `--font-display`, 1.4rem, `--color-text-light`
  - Location: `--font-body`, small, `--color-text-muted`
- A gold circle dot sits on the timeline line at each event's connector point
- ScrollTrigger: each card animates in from its respective side with `opacity: 0 → 1` and `translateX(±40px → 0)`

---

### Section 4 — Birthday Theme (`#theme`)

**Purpose:** Communicate the dress code and colour palette to guests.

**Content to render:**

- Section heading: `Birthday Theme`
- Theme name: `[TO BE PROVIDED BY CLIENT]` (e.g., "A Night of Elegance")
- Dress code: `[TO BE PROVIDED BY CLIENT]` (e.g., "Black Tie / Traditional Attire")
- Colour swatches: 2–4 official event colours with names

**Placeholder swatches (replace when client confirms):**

- Midnight Navy `#0A0A1A`
- Royal Gold `#C9A84C`
- Ivory White `#F5EDD6`
- Deep Burgundy `#6B1A2A`

**Implementation:**

- Light background (`--color-bg-light`)
- Dress code displayed in a decorative pull-quote box: gold left border (`4px solid var(--color-gold)`), light cream fill, display font, italic
- Colour swatches: a horizontal row of circles (80px diameter on desktop, 60px on mobile), each with the hex fill and the colour name beneath in small `--font-body` text
- ScrollTrigger: heading fades in, dress code box slides up, swatches pop in staggered

---

### Section 5 — RSVP (`#rsvp`)

**Purpose:** Collect guest attendance confirmations digitally.

**Form fields:**

| Field                    | Type                                | Required |
| ------------------------ | ----------------------------------- | -------- |
| Full Name                | `text`                              | Yes      |
| Phone Number             | `tel`                               | Yes      |
| Email Address            | `email`                             | Yes      |
| Will you attend?         | `radio` (Attending / Not Attending) | Yes      |
| Number of Guests         | `number` (min: 1, max: 10)          | Yes      |
| Special Message / Wishes | `textarea`                          | No       |

**Implementation:**

- Dark background (`--color-bg-dark`)
- Form width: max 640px, centred
- Input styles: `background: rgba(255,255,255,0.05); border: 1px solid rgba(201,168,76,0.3); border-radius: var(--radius-sm); color: var(--color-text-light); padding: 0.875rem 1rem;`
- On focus: `border-color: var(--color-gold); box-shadow: 0 0 0 3px rgba(201,168,76,0.15);`
- Radio buttons: styled as two toggle-pill buttons side by side
- Submit button: full-width, `background: var(--color-gold); color: var(--color-bg-dark); font-weight: 700;` with a shimmer animation (`@keyframes shimmer`) pulsing to draw attention
- On submit:
  1. Prevent default
  2. Validate all required fields client-side; show inline error messages if invalid
  3. POST to Formspree endpoint (client to supply): `https://formspree.io/f/[FORM_ID]`
  4. On success: hide form, show a congratulatory confirmation message with a gold animated checkmark
  5. On error: show a friendly error message with a retry option

---

### Section 6 — Travel (`#travel`)

**Purpose:** Practical arrival guidance. Keep it warm and brief.

**Content to render:**

- Section heading: `Getting Here`
- Three info cards:
  1. **Arrive Early** — "We kindly ask all guests to arrive at least 30–45 minutes before the event begins to allow for seating and a relaxed start."
  2. **By Car** — `[PARKING / DIRECTIONS — to be provided by client]`
  3. **By Public Transport** — `[NEAREST BUS STOP / TRAIN STATION — to be provided by client]`

**Implementation:**

- Light background (`--color-bg-light`)
- Three cards in a row on desktop, stacked on mobile
- Each card: Lucide icon (gold, 32px), bold title, body text in `--color-text-dark`
- Icons to use: `Clock` for Arrive Early, `Car` for By Car, `Bus` for Public Transport
- Card style: white background, `border-radius: var(--radius-md)`, subtle shadow, gold top border (`3px solid var(--color-gold)`)
- ScrollTrigger: cards fade up staggered

---

### Section 7 — Hotels (`#hotels`)

**Purpose:** Help out-of-town guests find nearby accommodation.

**Content to render (placeholders — client to replace with real hotels):**

| Hotel          | Distance     | Tier      | Link  |
| -------------- | ------------ | --------- | ----- |
| [Hotel Name 1] | 5 min drive  | Luxury    | [URL] |
| [Hotel Name 2] | 10 min drive | Mid-range | [URL] |
| [Hotel Name 3] | 15 min drive | Budget    | [URL] |

**Implementation:**

- Dark background (`--color-bg-dark`)
- 3-column grid on desktop, 1 column on mobile
- Each card:
  - Placeholder image or gradient thumbnail at top
  - Tier badge (pill): Luxury = gold, Mid-range = silver/grey, Budget = muted
  - Hotel name in `--font-display`, `--color-text-light`
  - Distance in `--color-text-muted`, small
  - 1–2 sentence description
  - "View Hotel →" CTA button: outlined gold, opens in `_blank`
- Hover state: `transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.4);`
- ScrollTrigger: cards stagger in from bottom

---

## 7. Footer

Simple, centred footer below the Hotels section.

```
© 2026 · Highly Reverend Emeka Eze · Birthday Celebration
```

- Dark background, `--color-text-muted`, small `--font-body`
- Optional: thin gold top border

---

## 8. Animation System (Reference: Awwwards Level — dennissnellenberg.com + exoape.com)

> These are the exact animation patterns from the reference videos. Implement all of them.

---

### 8.0 CDN Script Load Order

Place these in `<head>` in this exact order — order matters:

```html
<!-- Lenis smooth scroll — load FIRST -->
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>

<!-- GSAP core -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

<!-- GSAP ScrollTrigger plugin -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<!-- Split Type (free SplitText alternative) -->
<script src="https://cdn.jsdelivr.net/npm/split-type@0.3.4/umd/index.min.js"></script>
```

---

### 8.1 Lenis Smooth Scroll — Global Setup

Initialize Lenis first, before any GSAP code. Connect it to GSAP's ticker so ScrollTrigger stays in sync.

```javascript
// js/smooth-scroll.js
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

// Connect Lenis to GSAP ticker (CRITICAL — without this, ScrollTrigger breaks)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Optional: expose globally for nav anchor clicks
window.lenis = lenis;
```

**Effect:** Scroll feels like butter — no abrupt jerking. The entire silky feel of both reference sites comes from this single setup.

---

### 8.2 Page Preloader

Both reference sites start with a near-black screen and a centred logo/monogram that fades in, then the whole page reveals dramatically.

```javascript
// js/preloader.js
const tl = gsap.timeline();

tl.to(".preloader__logo", {
  opacity: 1,
  duration: 0.6,
  ease: "power2.out",
})
  .to(".preloader", {
    clipPath: "inset(0 0 100% 0)",
    duration: 1.0,
    ease: "power4.inOut",
    delay: 0.4,
  })
  .set(".preloader", { display: "none" })
  .add(() => initScrollAnimations()); // fire all ScrollTrigger setups after preloader
```

**HTML required:**

```html
<div class="preloader">
  <div class="preloader__logo">
    <!-- SVG monogram or initials "EE" in gold -->
  </div>
</div>
```

**CSS required:**

```css
.preloader {
  position: fixed;
  inset: 0;
  background: #0a0a1a;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: inset(0 0 0% 0); /* starts fully covering the page */
}
.preloader__logo {
  opacity: 0;
}
```

---

### 8.3 Hero Curtain Reveal (Clip-Path Wipe)

After the preloader lifts, the hero section reveals from behind a rounded-corner black mask — like theatre curtains pulling back. This is the signature move from Video 1 (Dennis Snellenberg).

```javascript
// Fire this inside initScrollAnimations() after preloader completes
gsap.from(".hero", {
  clipPath: "inset(8% 4% 8% 4% round 24px)",
  duration: 1.4,
  ease: "power4.inOut",
  clearProps: "clipPath", // remove after animation so layout isn't clipped
});

gsap.from(".hero__photo", {
  scale: 1.08,
  duration: 1.6,
  ease: "power3.out",
});
```

**Effect:** The hero photo scales from slightly zoomed-in to full, while the clip-path reveals it from rounded-corner box to full-bleed. Cinematic and premium.

---

### 8.4 Staggered Heading Line Reveal (Text Mask)

Every section heading uses this technique. Each line of text is masked and slides up from beneath an invisible clip. This is the most recognisable animation from both reference sites.

**HTML structure — wrap EVERY heading like this:**

```html
<h2 class="reveal-heading">
  <span class="line-wrap"
    ><span class="line-inner">Celebrating a Life</span></span
  >
  <span class="line-wrap"><span class="line-inner">of Grace</span></span>
</h2>
```

**CSS:**

```css
.line-wrap {
  display: block;
  overflow: hidden; /* THE KEY — hides the inner span during animation */
  line-height: 1.1;
}
.line-inner {
  display: block;
  transform: translateY(110%); /* starts hidden below the clip */
}
```

**JavaScript — use Split Type to automate line splitting:**

```javascript
function initHeadingReveals() {
  document.querySelectorAll(".reveal-heading").forEach((heading) => {
    const split = new SplitType(heading, { types: "lines" });

    // Wrap each auto-split line in overflow:hidden
    split.lines.forEach((line) => {
      const wrapper = document.createElement("div");
      wrapper.style.overflow = "hidden";
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    ScrollTrigger.create({
      trigger: heading,
      start: "top 88%",
      onEnter: () => {
        gsap.to(split.lines, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
        });
      },
      once: true,
    });

    // Set initial state
    gsap.set(split.lines, { y: "110%", opacity: 0 });
  });
}
```

---

### 8.5 Parallax Depth Scroll

From Video 2 (Exoape): the hero photo and the oversized background text move at different scroll speeds, creating a 3D depth illusion.

```javascript
function initParallax() {
  // Hero photo moves SLOWER than scroll (pulls back = depth)
  gsap.to(".hero__photo", {
    yPercent: -20,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1.5, // 1.5s lag = smooth, not snappy
    },
  });

  // Oversized name text moves FASTER (floats forward)
  gsap.to(".hero__name-bg", {
    yPercent: 30,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
  });
}
```

**What `.hero__name-bg` is:** A very large, semi-transparent version of the name sitting behind the photo at the bottom of the hero viewport — like "EMEKA EZE" in giant lettering. As the user scrolls, the text floats up faster than the photo, creating a layered 3D feel.

---

### 8.6 Custom Magnetic Cursor

Both reference sites replace the default OS cursor with a custom circular element that follows the mouse smoothly. It warps and scales on hover.

**HTML — add just before `</body>`:**

```html
<div class="cursor" id="cursor">
  <div class="cursor__inner"></div>
</div>
```

**CSS:**

```css
* {
  cursor: none;
} /* hide default cursor globally */

.cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 48px;
  height: 48px;
  pointer-events: none;
  z-index: 99999;
  mix-blend-mode: difference; /* inverts colour of whatever is underneath */
  transition: transform 0.1s ease;
}

.cursor__inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #ffffff; /* appears as gold on dark bg due to blend mode */
  transform: scale(0.3);
  transition: transform 0.25s ease;
}

/* Expanded state on hover */
.cursor.is-hovering .cursor__inner {
  transform: scale(1);
}
```

**JavaScript:**

```javascript
function initCursor() {
  const cursor = document.getElementById("cursor");
  const inner = cursor.querySelector(".cursor__inner");

  // GSAP quickTo for ultra-smooth lag follow
  const xTo = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3" });

  window.addEventListener("mousemove", (e) => {
    xTo(e.clientX - 24); // offset by half cursor width
    yTo(e.clientY - 24);
  });

  // Expand on interactive elements
  const targets = document.querySelectorAll("a, button, [data-cursor-expand]");
  targets.forEach((el) => {
    el.addEventListener("mouseenter", () =>
      cursor.classList.add("is-hovering"),
    );
    el.addEventListener("mouseleave", () =>
      cursor.classList.remove("is-hovering"),
    );
  });
}
```

> On mobile: disable the cursor entirely — `if ('ontouchstart' in window) return;` at the top of `initCursor()`.

---

### 8.7 Scroll-Triggered Section Reveals (All Non-Hero Sections)

Every content block below the hero uses this base pattern. Apply `.reveal-block` to any element that should animate in.

```javascript
function initRevealBlocks() {
  gsap.utils.toArray(".reveal-block").forEach((el) => {
    gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });
  });
}
```

**Staggered children (cards, swatches, list items):**

```javascript
gsap.utils.toArray(".reveal-stagger").forEach((parent) => {
  const children = parent.children;
  gsap.from(children, {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: parent,
      start: "top 88%",
      once: true,
    },
  });
});
```

Apply `.reveal-block` to: map wrapper, RSVP form, travel section. Apply `.reveal-stagger` to: hotel cards grid, travel cards row, colour swatch row, schedule timeline wrapper.

---

### 8.8 Schedule Timeline Alternating Reveal

Schedule cards slide in from alternating left and right — not just straight up.

```javascript
function initTimeline() {
  document.querySelectorAll(".schedule-card").forEach((card, i) => {
    const fromLeft = i % 2 === 0;
    gsap.from(card, {
      x: fromLeft ? -80 : 80,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        once: true,
      },
    });
  });

  // Timeline line draws itself from top to bottom
  gsap.from(".timeline__line", {
    scaleY: 0,
    transformOrigin: "top center",
    ease: "none",
    scrollTrigger: {
      trigger: ".schedule",
      start: "top 60%",
      end: "bottom 80%",
      scrub: 1,
    },
  });
}
```

---

### 8.9 Sticky Nav on Scroll

The nav starts invisible/transparent. Once the user scrolls past 60px it gains a blur backdrop and semi-transparent dark fill.

```javascript
function initNav() {
  ScrollTrigger.create({
    start: "60px top",
    onEnter: () => document.querySelector("nav").classList.add("nav--scrolled"),
    onLeaveBack: () =>
      document.querySelector("nav").classList.remove("nav--scrolled"),
  });
}
```

```css
nav {
  transition:
    background 0.4s ease,
    backdrop-filter 0.4s ease;
}
nav.nav--scrolled {
  background: rgba(10, 10, 26, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
```

---

### 8.10 RSVP Button Shimmer Pulse

The submit button loops a shimmer animation to draw the eye.

```css
@keyframes shimmer {
  0% {
    box-shadow: 0 0 0 0 rgba(201, 168, 76, 0.5);
  }
  70% {
    box-shadow: 0 0 0 16px rgba(201, 168, 76, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(201, 168, 76, 0);
  }
}

.btn-rsvp-submit {
  animation: shimmer 2.4s ease-out infinite;
}
```

---

### 8.11 Scroll-Down Chevron Bounce

```css
@keyframes bounce-down {
  0%,
  100% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(10px);
    opacity: 0.5;
  }
}

.scroll-chevron {
  animation: bounce-down 1.8s ease-in-out infinite;
}
```

---

### 8.12 Animation Master Init

Call all functions in this order, after the preloader completes:

```javascript
// js/animations.js
function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Tell ScrollTrigger to use Lenis's scroll position
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) lenis.scrollTo(value);
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });
  lenis.on("scroll", ScrollTrigger.update);

  // Init all modules
  initCursor();
  initHeadingReveals();
  initParallax();
  initRevealBlocks();
  initTimeline();
  initNav();
}
```

---

### 8.13 Quick Reference — CSS Classes to Apply in HTML

| Class                | Effect                                       |
| -------------------- | -------------------------------------------- |
| `reveal-heading`     | Staggered line-by-line text reveal on scroll |
| `reveal-block`       | Single element fade-up on scroll             |
| `reveal-stagger`     | Parent whose direct children stagger in      |
| `schedule-card`      | Alternating left/right slide-in              |
| `timeline__line`     | Vertical line that draws itself on scroll    |
| `btn-rsvp-submit`    | Gold shimmer pulse loop                      |
| `scroll-chevron`     | Bounce animation on hero                     |
| `hero__photo`        | Parallax slow-pull on scroll                 |
| `hero__name-bg`      | Parallax fast-float on scroll                |
| `data-cursor-expand` | Any element that expands the cursor on hover |

---

## 9. File Structure

```
rev-eze-birthday/
├── CLAUDE.md
├── index.html
├── assets/
│   ├── images/
│   │   ├── rev-eze-hero.jpg        ← client to supply (min 2000px wide, WebP preferred)
│   │   └── hotels/
│   │       ├── hotel-1.jpg
│   │       ├── hotel-2.jpg
│   │       └── hotel-3.jpg
│   └── icons/                      ← any custom SVG icons
├── css/
│   └── styles.css                  ← custom styles; Tailwind via CDN
└── js/
    ├── main.js                     ← countdown, nav scroll, mobile menu
    ├── animations.js               ← all GSAP / ScrollTrigger logic
    └── rsvp.js                     ← form validation + Formspree submission
```

---

## 10. Placeholders — Client Must Supply

Before the site goes live, replace every item marked `[TO BE PROVIDED BY CLIENT]`:

- [ ] Portrait photo of Rev. Emeka Eze (`assets/images/rev-eze-hero.jpg`)
- [ ] Exact event date and time (for countdown JS)
- [ ] Venue name and full address
- [ ] Venue description (2–3 sentences)
- [ ] Google Maps embed URL for the venue
- [ ] Full event schedule (time, event name, location for each item)
- [ ] Birthday theme name and dress code instruction
- [ ] Official event colour swatches (hex codes)
- [ ] Hotel listings (name, address, tier, distance, description, link) — 3 to 5 hotels
- [ ] Parking and transport directions (Travel section)
- [ ] Formspree form ID (RSVP backend)
- [ ] RSVP deadline date (display in RSVP section heading)

---

## 11. Do Not

- Do not use `Inter`, `Roboto`, `Arial`, or `system-ui` for any display or heading text
- Do not use purple gradients or generic card UI patterns
- Do not use a `<form>` that reloads the page on submit
- Do not use `localStorage` or `sessionStorage`
- Do not add unnecessary dependencies — keep the bundle lean
- Do not use `!important` in CSS unless absolutely unavoidable
- Do not hard-code any content that belongs in the placeholder list above

---

_End of brief. Build section by section, starting with the HTML structure and global CSS, then layer in JavaScript and animations last._
