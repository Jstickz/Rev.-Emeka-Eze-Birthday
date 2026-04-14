# Website Content — Rev. Emeka Eze Birthday Celebration

> This file contains all curated copy for each section of the birthday website.
> Use it as the single source of truth when updating `index.html`.

---

## Section 1 — Home (`#home`)

### Hero Identity

- **Name:** Highly Reverend Emeka Eze
- **Overline:** A Birthday Celebration

### Event Dates

The celebration spans three days:

| Date          | Day      |
| ------------- | -------- |
| 21st May 2026 | Thursday |
| 22nd May 2026 | Friday   |
| 24th May 2026 | Sunday   |

### Venue Address (displayed in hero)

Assemblies of God International Worship Centre, Abuja

### Countdown Target

Count down to the **first event** — A Night of Lights:
**Thursday, 21st May 2026 at 6:00 PM**

```js
const eventDate = new Date("2026-05-21T18:00:00");
```

---

## Section 2 — Event Venue (`#venue`)

### Venue Name

Assemblies of God International Worship Centre

### Full Address

Assemblies of God International Worship Centre, Abuja, Nigeria

### Map Description (copy for the venue text block)

> All three events — A Night of Lights, the Birthday Celebration, and The Royal Thanksgiving — will be held at the same venue: the Assemblies of God International Worship Centre, Abuja. A place of worship, grace, and community, it provides the perfect setting for this momentous occasion.

### Google Maps Embed

Use this address for the Google Maps iframe embed and "Get Directions" link:

```
Assemblies of God International Worship Centre, Abuja, Nigeria
```

- **Embed URL:** `https://maps.google.com/maps?q=Assemblies+of+God+International+Worship+Centre+Abuja+Nigeria&output=embed`
- **Directions URL:** `https://maps.google.com/?q=Assemblies+of+God+International+Worship+Centre+Abuja+Nigeria`

### "Get Directions" Button Label

Get Directions →

---

## Section 3 — Schedule (`#schedule`)

### Section Heading

The Order of the Days

### Three-Day Event Schedule

#### Event 1

| Field          | Detail                                                |
| -------------- | ----------------------------------------------------- |
| **Event Name** | A Night of Lights                                     |
| **Date**       | Thursday, 21st May 2026                               |
| **Time**       | 6:00 PM                                               |
| **Venue**      | Assemblies of God International Worship Centre, Abuja |

#### Event 2

| Field          | Detail                                                |
| -------------- | ----------------------------------------------------- |
| **Event Name** | Birthday Celebration                                  |
| **Date**       | Friday, 22nd May 2026                                 |
| **Time**       | 12:00 PM (Noon)                                       |
| **Venue**      | Assemblies of God International Worship Centre, Abuja |

#### Event 3

| Field          | Detail                                                |
| -------------- | ----------------------------------------------------- |
| **Event Name** | The Royal Thanksgiving                                |
| **Date**       | Sunday, 24th May 2026                                 |
| **Time**       | 10:00 AM                                              |
| **Venue**      | Assemblies of God International Worship Centre, Abuja |

---

## Section 4 — Birthday Theme / Dress Code (`#theme`)

### Section Heading

Birthday Theme & Dress Code

### Typographic Statement (large display text)

> LIGHT. GOLD. GLORY.

### Event Themes & Dress Codes

#### A Night of Lights — Thursday, 21st May 2026

- **Dress Code:** All that glitters, combined with customized Adire fabric
- **Note:** Guests interested in the customized Adire fabric should send a WhatsApp message to the host's number.

#### Birthday Celebration — Friday, 22nd May 2026

- **Dress Code (Women):** Gold Outfit
- **Dress Code (Men):** White Agbada / Kaftan

#### The Royal Thanksgiving — Sunday, 24th May 2026

- **Dress Code:** Traditional Attire

### Official Event Colours

| Colour Name | Hex       | Swatch Use           |
| ----------- | --------- | -------------------- |
| White       | `#FFFFFF` | Primary event colour |
| Gold        | `#C9A84C` | Primary event colour |

> Replace the placeholder swatches in the theme section with **White** (`#FFFFFF`) and **Gold** (`#C9A84C`) only, as confirmed by the client.

---

## Section 5 — RSVP (`#rsvp`)

### Section Heading

Will You Be There?

### Sub-copy

Kindly let us know if you will be joining us for this joyous celebration.

### Form Fields

| Field                                | Type                                | Options / Notes                                                                              | Required           |
| ------------------------------------ | ----------------------------------- | -------------------------------------------------------------------------------------------- | ------------------ |
| First Name                           | Text                                | —                                                                                            | Yes                |
| Last Name                            | Text                                | —                                                                                            | Yes                |
| Title                                | Dropdown / Select                   | Bishop, Rev, Pastor, Deacon, Deaconess, Mr, Mrs, Miss                                        | Yes                |
| Phone Number                         | Tel                                 | —                                                                                            | Yes                |
| Email Address                        | Email                               | —                                                                                            | Yes                |
| Will you be attending?               | Radio / Toggle                      | Yes / No                                                                                     | Yes                |
| Which event(s) will you attend?      | Checkboxes                          | A Night of Lights (21 May) / Birthday Celebration (22 May) / The Royal Thanksgiving (24 May) | Yes (if attending) |
| Customized Adire Fabric Interest     | Radio / Toggle                      | Yes — I'll send a WhatsApp message / No                                                      | No                 |
| Adire fabric note (conditional hint) | Static text shown if "Yes" selected | "Please send a WhatsApp message to [host number] to indicate your interest."                 | —                  |
| Will you be attending with someone?  | Radio / Toggle                      | Yes / No                                                                                     | Yes                |

### Closing Note on the Form

> We look forward to seeing you. Thank you kindly.

### Success Message (after form submission)

> You're Confirmed! Thank you for responding. We look forward to celebrating with you.

---

## Section 6 — Travel (`#travel`)

### Section Heading

Getting Here

### Arrival Guidance

> We kindly ask all guests to arrive early. Please plan to be at the venue at least 30–45 minutes before each event begins to allow for seating and a relaxed, joyful start to the celebration.

### Closing Sentiment (use in travel section or footer area)

> We look forward to seeing you. Thank you kindly.

---

## Footer

```
© 2026 · Highly Reverend Emeka Eze · Birthday Celebration
With love & gratitude
```

---

## Notes for Implementation

- **Photos:** Client will supply portrait photos for the hero section.
- **WhatsApp Number:** Client to supply their WhatsApp number for the Adire fabric enquiry link. Format the link as `https://wa.me/[number]`.
- **Formspree ID:** Client to supply the Formspree form endpoint for RSVP submissions.
- **RSVP Deadline:** Client to confirm the RSVP deadline date.
- **Hotel listings:** Still to be supplied by client (name, address, distance, tier, link).
- **Transport details:** Parking and public transport info still to be supplied by client.
