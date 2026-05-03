# Rev. Emeka Eze Birthday Celebration — Official Website

A luxury, cinematic celebration website for the birthday of **Highly Esteemed Rev. Dr. Emeka Eze**, spanning three events across 21st, 22nd, and 24th May 2026.

---

## Overview

This is a fully responsive, static single-page application (SPA) with client-side routing. It covers seven distinct sections — Home, Venue, Schedule, Dress Code, RSVP, Travel, and Hotels — each with its own visual identity and entrance animations.

The RSVP form submits to a **Google Apps Script** backend which logs responses into a Google Sheet and automatically sends a personalised PDF ticket to each guest's email address.

---

## Tech Stack

| Concern        | Technology                                      |
| -------------- | ----------------------------------------------- |
| Structure      | HTML5 semantic markup                           |
| Styling        | Custom CSS (CSS custom properties design system)|
| Animations     | GSAP 3.12.5 (entrance animations, curtain wipe) |
| Text Splitting | Split Type 0.3.4 (line-by-line reveal)          |
| Fonts          | Google Fonts — Playfair Display · DM Sans       |
| RSVP Backend   | Google Apps Script → Google Sheets              |
| Ticket Email   | Google Apps Script → Gmail (PDF attachment)     |
| Hosting        | Netlify (static deployment with SPA redirect)   |

---

## Project Structure

```
rev-eze-birthday/
├── index.html              — All markup: 7 pages, nav, preloader, modals
├── styles/
│   └── main.css            — All CSS: design tokens, layout, animations, responsive
├── scripts/
│   ├── main.js             — All JS: router, GSAP animations, RSVP form, cursor
│   └── apps-script.gs      — Google Apps Script: RSVP handler, ticket generator
├── assets/
│   ├── images/             — Hero portraits, gallery images, logo variants
│   └── reference img/      — Design reference screenshots
├── CLAUDE.md               — Developer guide: architecture, constraints, patterns
├── CONTENT.md              — Copy source of truth: all text content per section
└── Brand_Guidelines.md     — Design system: colours, typography, spacing, motion
```

---

## Running Locally

No build step, no package manager, no framework.

```bash
# Python (works on any machine with Python installed)
python -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

VS Code **Live Server** extension also works — right-click `index.html` → *Open with Live Server*.

> Do not open `index.html` directly as a `file://` URL — the SPA router requires a server to handle path-based navigation correctly.

---

## Key Features

- **Hero image slideshow** — four portrait images crossfade infinitely in the hero section
- **Live countdown timer** — counts down to the first event (21st May 2026 at 6:00 PM)
- **Client-side SPA routing** — seven pages with smooth GSAP transitions and `history.pushState`
- **RSVP form** — validates client-side, POSTs to Google Apps Script, sends a PDF ticket via email
- **Duplicate registration guard** — blocks re-submission from the same email address
- **Image lightbox** — full-screen viewer with navigation for gallery images
- **Custom magnetic cursor** — GSAP-powered cursor with hover expansion (desktop only)
- **Animated preloader** — logo reveal with gold glow breathe, then curtain wipe into hero
- **Mobile-first responsive** — hamburger nav overlay, adapted layouts at 768px and 1025px

---

## Design System

Defined in `styles/main.css` at `:root` and documented in `Brand_Guidelines.md`.

| Token                | Value     | Usage                              |
| -------------------- | --------- | ---------------------------------- |
| `--color-bg-dark`    | `#0a0a1a` | Hero, Schedule, RSVP, Hotels       |
| `--color-gold`       | `#c9a84c` | All accents, borders, CTAs         |
| `--color-bg-light`   | `#f5edd6` | Venue, Theme, Travel               |
| `--color-text-light` | `#f0ebe3` | Text on dark backgrounds           |
| `--color-text-dark`  | `#1a1a2e` | Text on light backgrounds          |
| `--font-display`     | Playfair Display | Headings, name, pull quotes |
| `--font-body`        | DM Sans   | Body, labels, nav, form fields     |

---

## RSVP Backend

The RSVP form (`#rsvp`) posts to a **Google Apps Script Web App**. The script:

1. Receives the POST request
2. Appends a row to the "RSVP Responses" Google Sheet
3. Generates a personalised PDF ticket via Google Docs API
4. Emails the ticket to the guest as an attachment

To update the script: paste the contents of `scripts/apps-script.gs` into the Google Apps Script editor, then **Deploy → New deployment** (not *edit existing*). Copy the new Web App URL and update line `~721` in `scripts/main.js`.

---

## Content

All copy — names, dates, venue, dress codes, schedule — is documented in `CONTENT.md`. Use it as the single source of truth before editing `index.html`.

---

## Deployment

The site is deployed on **Netlify**. A `_redirects` file handles the SPA routing:

```
/* /index.html 200
```

Push to the `main` branch to trigger an automatic deploy.

---

## Contacts & Placeholders

The following items still require client input before the site goes fully live:

- WhatsApp number for the Adire fabric enquiry link (`https://wa.me/[number]`)
- Hotel listings (name, address, distance, tier, description, link) — 3 to 5 hotels
- Parking and public transport directions for the Travel section
- RSVP deadline date

---

*Built with care for a landmark celebration.*
