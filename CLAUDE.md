# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

A **static single-page celebration website** for Rev. Dr. Emeka Eze's birthday (May 21–24, 2026). No build tools, no package manager, no framework. Three files do everything: `index.html`, `styles/main.css`, `scripts/main.js`.

Form submissions go to a **Google Apps Script** (`scripts/apps-script.gs`) deployed as a Web App, which writes rows into a Google Sheet.

---

## No Build Step

There is no `npm install`, no `npm run dev`, no bundler. Open `index.html` directly in a browser or serve with any static file server:

```bash
# Python (any machine)
python -m http.server 8080

# VS Code Live Server extension also works
```

The Google Apps Script (`apps-script.gs`) is NOT run locally — it lives in Google's cloud. To update it: paste the file contents into the Google Apps Script editor, then **Deploy → New deployment** (editing an existing deployment does not update the live URL).

---

## Architecture

### Frontend (static)
- **`index.html`** — single HTML file, ~686 lines. Contains all 7 section markups plus the `<nav>`, preloader, toast, and cursor. Sections: `#home`, `#venue`, `#schedule`, `#theme`, `#rsvp`, `#travel`, `#hotels`.
- **`styles/main.css`** — all CSS. CSS custom properties at `:root` define the design system. No Tailwind (the CLAUDE.md brief mentioned it; it was never used).
- **`scripts/main.js`** — all JavaScript. Single `DOMContentLoaded` listener. Handles: preloader, countdown, GSAP animations, custom cursor, SPA navigation (client-side routing via `history.pushState`), mobile menu, and RSVP form submission.

### SPA Navigation
The site uses **client-side routing** — sections are shown/hidden via `data-page` attributes, not real page loads. Navigation links call `navigateTo(pageId)` which hides all sections, reveals the target, updates the URL, and fires page-specific GSAP entrance animations. There is no full-page scroll; each section is a "page".

### RSVP Form → Google Sheets Pipeline
1. User submits form → `main.js` validates client-side → POSTs JSON to `APPS_SCRIPT_URL` (line 721 in `main.js`)
2. `apps-script.gs` `doPost(e)` receives the POST → writes a row to the "RSVP Responses" sheet tab
3. Response is `no-cors` mode — the frontend cannot read the response body; reaching the `.then()` is treated as success

**Current payload shape** (from `main.js` ~line 736):
```js
{ first_name, last_name, title, phone, email, attendance, events, adire_interest, attending_with_someone }
```

### CDN Dependencies (loaded in `<head>`)
- GSAP 3.12.5 (core only — no ScrollTrigger; sections don't scroll)
- Split Type 0.3.4 (text splitting for heading animations)
- Google Fonts: Playfair Display (display), DM Sans (body)

### Design Tokens
All defined as CSS variables in `styles/main.css` `:root`:
- `--color-bg-dark: #0a0a1a` — primary dark background
- `--color-gold: #c9a84c` — all accents, borders, highlights
- `--color-bg-light: #f5edd6` — light section backgrounds
- `--font-display: "Playfair Display"` — headings
- `--font-body: "DM Sans"` — body text

---

## Upcoming Work (see `IMPLEMENTATION_PLAN.md`)

Three features are planned but not yet built:
1. **PDF ticket email** — sent automatically on RSVP, generated via Google Docs API inside GAS
2. **Email reminders** — scheduled GAS time-based triggers sending via Resend API
3. **WhatsApp reminders** — scheduled GAS triggers sending via Twilio API

This requires:
- Adding `whatsapp_consent` checkbox to the form in `index.html` and the payload in `main.js`
- Expanding `apps-script.gs` significantly (ticket generation, Resend API calls, Twilio API calls)
- New columns in the Google Sheet: `Ticket ID`, `WhatsApp Consent`

---

## Key Constraints

- **No Lenis** — it was specified in the original brief but removed. The site uses single-page section switching, not long-page scroll. Do not add Lenis back.
- **No ScrollTrigger** — same reason. GSAP animations fire on `navigateTo()` page enter, not on scroll.
- **`no-cors` fetch** — the GAS endpoint is called with `mode: 'no-cors'`. You cannot read `.ok` or `.status` from the response. This is intentional.
- **Every GAS change needs a new deployment** — not a re-save of the existing one.
