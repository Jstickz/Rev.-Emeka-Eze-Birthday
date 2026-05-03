# Research & Implementation Plan: Email Tickets + WhatsApp Reminders

## Context

The Rev. Emeka Eze birthday celebration website already collects RSVP registrations via a form that saves data to Google Sheets through Google Apps Script. The user now wants three new features:

1. **Automatic ticket email** — every registrant gets a PDF ticket immediately upon registration
2. **Email reminders** — automated reminder emails sent before the event (May 21–24, 2026)
3. **WhatsApp reminders** — automated WhatsApp messages sent to collected phone numbers

**User profile:** 300–1,000 expected attendees | PDF ticket format | Nigeria/Africa-based attendees

---

## What Is Currently Built

- **Frontend:** Static HTML/CSS/JS (`index.html`, `scripts/main.js`)
- **Form fields collected:** First Name, Last Name, Title, Phone, Email, Attendance, Events, Adire Interest, Plus-one
- **Backend:** Google Apps Script (`scripts/apps-script.gs`) — receives POST, writes to Google Sheets
- **Deployed GAS URL:** configured in `main.js` line 721
- **No email or notification logic exists yet**

---

## Research Findings: What Is Possible

### Email Tickets

| Approach | Feasibility | Notes |
|---|---|---|
| Google Apps Script MailApp | Limited | 100 emails/day cap — NOT enough for 300–1,000 attendees |
| **Resend API via GAS** | **Best fit** | 3,000 emails/month free, called via `UrlFetchApp` |
| Brevo (Sendinblue) | Good | 300 free emails/day (permanent) |
| SendGrid | Good | 60-day trial only, then paid |

**Verdict:** Use **Resend** (3,000/month free tier). Can be called from Google Apps Script via `UrlFetchApp.fetch()`.

### PDF Ticket Generation

| Approach | Feasibility | Notes |
|---|---|---|
| **Native GAS + Google Docs API** | **Best fit** | Generate from a template Doc — free, no external service |
| External PDF service | Possible | Adds cost and complexity |
| HTML-to-PDF via Puppeteer | Requires Node.js | Not available in GAS |

**Verdict:** Use **Google Docs API** within GAS. Create a Google Doc template with placeholders. GAS fills them in, exports as PDF blob, attaches to email. Completely free.

### QR Code Generation

- **Best approach:** Call `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={TICKET_ID}` (free, no account needed, no limits)
- GAS fetches the image blob and embeds it in the PDF ticket

### Email Reminders (Scheduled)

- Google Apps Script supports **time-based installable triggers**
- A trigger function reads the Sheet and sends reminder emails to all registrants
- Schedule: 1 week before (May 14) and 1 day before (May 20)
- Resend API handles the sending volume

### WhatsApp Reminders

| Service | Cost | Setup Complexity | Nigeria Support |
|---|---|---|---|
| **Twilio WhatsApp API** | ~$0.005/msg + Meta fee (~$0.01–0.05/msg) | Medium | Excellent |
| Meta WhatsApp Cloud API (direct) | Cheaper per message | High (business verification) | Excellent |
| WhatsApp-only services (Wati, Interakt) | ~$49/month flat | Low | Excellent |

**Verdict for Nigeria/Africa:** WhatsApp is the right choice. Twilio is the easiest integration and can be called directly from Google Apps Script.

**Legal requirement:** WhatsApp requires explicit user opt-in. A consent checkbox must be added to the RSVP form: *"I agree to receive WhatsApp event reminders."*

---

## Recommended Architecture

Everything stays inside **Google Apps Script** — no new servers needed.

```
User submits RSVP form
        ↓
Google Apps Script (doPost)
        ↓
1. Saves row to Google Sheet          ← already works
2. Generates unique Ticket ID (UUID)
3. Fetches QR code image (via QRServer API)
4. Creates PDF ticket (via Google Docs template)
5. Sends confirmation email + PDF (via Resend API)
6. Sends WhatsApp confirmation (via Twilio API)  [if opted in]
        ↓
Time-based GAS triggers (pre-scheduled)
        ↓
7. Reminder email — May 14 (1 week before)
8. Reminder email — May 20 (1 day before)
9. WhatsApp reminder — same schedule
```

---

## Implementation Phases

### Phase 1: Third-Party Service Setup (Your Action Required)

- [ ] **Resend account** — sign up at resend.com → get API key (free, 3,000 emails/month)
- [ ] **Twilio account** — sign up at twilio.com → get Account SID + Auth Token
- [ ] **Twilio WhatsApp number** — enable WhatsApp sender in Twilio (~$1/month for a number)
- [ ] **Google Doc ticket template** — we will create this together in Google Drive

### Phase 2: Google Docs Ticket Template

Create a Google Doc with these placeholders:
- `{{FULL_NAME}}` — registrant's full name
- `{{TITLE}}` — honorific (Rev, Bishop, Mr, Mrs, etc.)
- `{{TICKET_ID}}` — unique ticket identifier
- `{{EVENTS}}` — events they registered for
- `{{QR_CODE}}` — QR code image (inserted as inline image)
- Styled with event's gold/dark branding

### Phase 3: Google Apps Script Updates (`scripts/apps-script.gs`)

**Add to the existing `doPost(e)` function:**
- `generateTicketId()` — UUID via `Utilities.getUuid()`
- `generateQRCode(ticketId)` — fetch image blob from QRServer API
- `generateTicketPDF(data, qrBlob)` — clone Doc template, fill placeholders, export as PDF
- `sendConfirmationEmail(email, name, pdfBlob)` — POST to Resend API with PDF attachment
- `sendWhatsAppConfirmation(phone, name)` — POST to Twilio API (only if `whatsapp_consent` is true)
- Save `ticket_id` and `whatsapp_consent` as new columns in the Sheet

**Add new standalone functions (called by scheduled triggers):**
- `sendReminderEmails()` — reads Sheet, sends reminder to all attendees via Resend
- `sendWhatsAppReminders()` — reads Sheet, sends WhatsApp to opted-in attendees via Twilio
- `setupTriggers()` — one-time setup function to register time-based triggers for May 14 and May 20

### Phase 4: Form Updates

**`index.html`** — Add WhatsApp consent field to the RSVP form (after the phone number field):
```
[ ] I agree to receive WhatsApp event reminders on this number
```

**`scripts/main.js`** — Add `whatsapp_consent` to the form submission payload

---

## Files to Modify

| File | Changes |
|---|---|
| `scripts/apps-script.gs` | Major additions — ticket generation, email, WhatsApp API calls, scheduled reminders |
| `index.html` | Add WhatsApp consent checkbox to RSVP form |
| `scripts/main.js` | Add `whatsapp_consent` to form payload (line ~736–746) |

**New resources to create (outside the codebase):**
- Google Doc ticket template (in Google Drive)
- Resend API account + API key
- Twilio account + API credentials

---

## Costs Summary

| Service | Free Tier | Cost If Exceeded |
|---|---|---|
| Resend (email) | 3,000 emails/month | $20/month for 50K |
| QRServer (QR codes) | Free, unlimited | Free |
| Google Docs (PDF) | Free | Free |
| Twilio WhatsApp messages | None | ~$0.01–0.05 per message |
| Twilio WhatsApp number | Trial credits | ~$1/month |

**Estimated cost for 1,000 attendees + 2 reminders (~3,000 WhatsApp messages):**
- Email: **Free** (Resend)
- WhatsApp: **~$30–150** total (depending on opt-in rate)

---

## Verification Checklist

- [ ] Submit test RSVP → confirmation email arrives with PDF attachment
- [ ] Open PDF → name, ticket ID, events, QR code all correct and styled
- [ ] Scan QR code → decodes to correct ticket ID
- [ ] Submit test with WhatsApp consent checked → WhatsApp message received on test phone
- [ ] Manually run `sendReminderEmails()` in GAS editor → reminder email arrives
- [ ] Manually run `sendWhatsAppReminders()` → WhatsApp reminder received
- [ ] Check GAS execution logs for any errors
- [ ] Verify Google Sheet has new columns: Ticket ID, WhatsApp Consent

---

## Progress Tracker

- [x] Phase 1: Accounts set up (Resend + Twilio)
- [x] Phase 2: Google Docs ticket template created
- [x] Phase 3: `apps-script.gs` updated (code complete — needs redeploy after Phase 1 & 2)
- [x] Phase 4: Form consent checkbox added (`index.html` + `main.js` updated)
- [x] Phase 5: End-to-end test passed (May 3, 2026 — sheet write + PDF ticket email confirmed working)
- [x] Phase 6: Reminder triggers scheduled — run `setupTriggers()` once in GAS editor
