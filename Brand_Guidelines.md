# Brand Guidelines — Rev. Emeka Eze Birthday Celebration

---

## 1. Brand Identity

**Subject:** Highly Esteemed Reverend Emeka Eze  
**Event:** Birthday Celebration  
**Aesthetic:** Luxury · Cinematic · Spiritual Elegance  
**Tone:** Warm, reverent, celebratory — never casual or corporate

---

## 2. Colour Palette

| Name          | Hex       | Usage                                            |
| ------------- | --------- | ------------------------------------------------ |
| Midnight Navy | `#0a0a1a` | Primary dark background, preloader, hero         |
| Royal Gold    | `#c9a84c` | Accents, borders, highlights, CTAs, icons        |
| Light Gold    | `#f0d98a` | Hover states, shimmer effects                    |
| Champagne     | `#f5edd6` | Light section backgrounds (Venue, Theme, Travel) |
| Off-White     | `#f0ebe3` | Body text on dark backgrounds                    |
| Deep Charcoal | `#1a1a2e` | Body text on light backgrounds                   |
| Muted Taupe   | `#9a8e7e` | Captions, secondary labels, distances, meta text |

### Event Colour Swatches (Placeholder — client to confirm)

| Name          | Hex       |
| ------------- | --------- |
| Midnight Navy | `#0A0A1A` |
| Royal Gold    | `#C9A84C` |
| Ivory White   | `#F5EDD6` |
| Deep Burgundy | `#6B1A2A` |

### Section Background Rhythm

Sections strictly alternate dark and light for visual rhythm:

| Section  | Background |
| -------- | ---------- |
| Hero     | Dark       |
| Venue    | Light      |
| Schedule | Dark       |
| Theme    | Light      |
| RSVP     | Dark       |
| Travel   | Light      |
| Hotels   | Dark       |
| Footer   | Dark       |

---

## 3. Typography

### Typefaces

| Role      | Font             | Fallback              | Source       |
| --------- | ---------------- | --------------------- | ------------ |
| Display   | Playfair Display | Georgia, serif        | Google Fonts |
| Body / UI | DM Sans          | system-ui, sans-serif | Google Fonts |

### Rules

- **Never use** Inter, Roboto, Arial, or system fonts for any display or heading text.
- Display font (`Playfair Display`) is reserved for headings, names, event titles, and pull quotes.
- Body font (`DM Sans`) is used for paragraphs, labels, captions, navigation links, and form fields.

### Type Scale Reference

| Element             | Size                     | Weight | Font    |
| ------------------- | ------------------------ | ------ | ------- |
| Hero Name           | `clamp(3rem, 7vw, 7rem)` | 700    | Display |
| Section Headings    | ~2.5–3.5rem              | 700    | Display |
| Schedule Event Name | 1.4rem                   | 600    | Display |
| Body Text           | 1rem                     | 400    | Body    |
| Captions / Meta     | 0.85rem                  | 400    | Body    |
| Time Badge          | 0.85rem                  | 700    | Body    |

---

## 4. Spacing System

Defined as CSS custom properties and used consistently across all sections.

| Token        | Value  |
| ------------ | ------ |
| `--space-xs` | 0.5rem |
| `--space-sm` | 1rem   |
| `--space-md` | 2rem   |
| `--space-lg` | 4rem   |
| `--space-xl` | 8rem   |

---

## 5. Border & Shape

| Token           | Value                         | Usage                            |
| --------------- | ----------------------------- | -------------------------------- |
| `--radius-sm`   | 0.5rem                        | Input fields, small pills        |
| `--radius-md`   | 1rem                          | Cards, map iframes, hotel images |
| `--radius-lg`   | 1.5rem                        | Large containers                 |
| `--border-gold` | `1px solid var(--color-gold)` | Countdown boxes, map frames      |

---

## 6. Component Styles

### Buttons

**Primary CTA (Gold Fill)**

- Background: `--color-gold`
- Text: `--color-bg-dark` (dark on gold)
- Font weight: 700
- Example: RSVP Submit button, nav RSVP button

**Secondary CTA (Gold Outline)**

- Background: transparent
- Border: `1px solid var(--color-gold)`
- Text: `--color-gold`
- Example: "Get Directions", "View Hotel →"

### Input Fields (RSVP Form)

- Background: `rgba(255,255,255,0.05)` — frosted glass feel on dark bg
- Border: `1px solid rgba(201,168,76,0.3)`
- Border Radius: `--radius-sm`
- Text: `--color-text-light`
- Padding: `0.875rem 1rem`
- **Focus state:** `border-color: --color-gold; box-shadow: 0 0 0 3px rgba(201,168,76,0.15)`

### Cards (Hotels, Travel)

- Background: white (Travel) or semi-dark (Hotels)
- Border Radius: `--radius-md`
- Subtle drop shadow
- Gold top border accent: `3px solid var(--color-gold)`
- Hover lift: `transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.4)`

### Tier Badges

| Tier      | Colour        |
| --------- | ------------- |
| Luxury    | Gold          |
| Mid-range | Silver / Grey |
| Budget    | Muted         |

### Pull-Quote / Dress Code Box

- Left border: `4px solid var(--color-gold)`
- Fill: light cream
- Font: Display, italic

---

## 7. Iconography

- **Library:** Lucide Icons (CDN) or inline SVG
- **Size:** 32px in card contexts
- **Colour:** Royal Gold (`#c9a84c`)
- Icon assignments:
  - Clock — Arrive Early (Travel section)
  - Car — By Car (Travel section)
  - Bus — Public Transport (Travel section)

---

## 8. Photography

- **Hero image:** Full-bleed portrait of Rev. Emeka Eze
  - Minimum width: 2000px
  - Format: WebP preferred
  - Position: `background-position: center top`
- **Overlay:** `linear-gradient(to top, rgba(10,10,26,0.95) 0%, rgba(10,10,26,0.4) 60%, transparent 100%)`
  - Purpose: ensures text legibility without obscuring the subject's face
- **Hotel thumbnails:** Placeholder gradients until real images supplied

---

## 9. Animation & Motion Identity

The site targets an Awwwards-level motion aesthetic. Motion is premium, intentional, and never gratuitous.

| Principle       | Implementation                                          |
| --------------- | ------------------------------------------------------- |
| Smooth Scroll   | Lenis (`duration: 1.4`, exponential easing)             |
| Entrance        | Clip-path curtain wipe on hero reveal                   |
| Text            | Line-by-line mask reveal (Split Type + GSAP)            |
| Depth           | Parallax at different scroll speeds (hero photo vs. bg) |
| Scroll Reveals  | Fade-up (`y: 60 → 0, opacity: 0 → 1`)                   |
| Stagger Timing  | `0.08s` for text lines, `0.1s` for cards                |
| Cursor          | Magnetic circle, `mix-blend-mode: difference`           |
| Easing Standard | `power3.out` for entrances, `power4.inOut` for wipes    |

---

## 10. Navigation

```
[Monogram]   Home · Venue · Schedule · Dress Code · RSVP · Travel · Hotels   [RSVP]
```

- Sticky, full-width top bar
- **Default state:** transparent / invisible background
- **Scrolled state (past 60px):** `background: rgba(10,10,26,0.85); backdrop-filter: blur(16px)`
- Transition: `0.4s ease` on background and backdrop-filter
- Mobile: hamburger icon → full-screen overlay nav

---

## 11. What to Avoid

| Avoid                              | Reason                                           |
| ---------------------------------- | ------------------------------------------------ |
| Inter, Roboto, Arial for headings  | Dilutes the luxury typographic voice             |
| Purple gradients                   | Generic AI-aesthetic — off-brand                 |
| Default page-reload on form submit | Poor UX; intercept with JS always                |
| `localStorage` / `sessionStorage`  | Not needed; keep implementation clean            |
| `!important` in CSS                | Signals specificity problems — avoid by design   |
| Hard-coded placeholder content     | All client-supplied content must remain editable |
| Unnecessary JS dependencies        | Keep the bundle lean                             |

---

_These guidelines apply to all digital touchpoints for the Rev. Emeka Eze Birthday Celebration. Any deviations require explicit sign-off._
