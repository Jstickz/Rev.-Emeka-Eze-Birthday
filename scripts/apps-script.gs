// ─────────────────────────────────────────────────────────────────────────────
// Rev. Emeka Eze Birthday — RSVP Google Apps Script
//
// SETUP INSTRUCTIONS (do this once):
//
// 1. Open your Google Sheet → Extensions → Apps Script.
// 2. Paste this entire file, replacing any existing code.
// 3. Fill in the CONFIG section below (API keys, Doc template ID, etc).
// 4. Click Save, then Deploy → New deployment → Web app.
//    Execute as: Me | Who has access: Anyone
// 5. Copy the Web App URL and paste it into main.js (APPS_SCRIPT_URL).
//
// IMPORTANT: Every change to this script requires a NEW deployment
// (Deploy → New deployment). Editing an existing deployment has no effect
// on the live URL.
// ─────────────────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════
//  CONFIG — fill these in before deploying
// ═══════════════════════════════════════════════════════════════

var CONFIG = {
  // ── Google Sheet ──────────────────────────────────────────────
  // Name of the sheet tab where RSVP responses are stored
  SHEET_NAME: "RSVP Responses",

  // ── Ticket PDF template ───────────────────────────────────────
  // Create a Google Doc in your Drive, design the ticket layout,
  // and use these exact placeholders in the body:
  //   {{FULL_NAME}}  {{TITLE}}  {{TICKET_ID}}  {{EVENTS}}  {{DATE_LABEL}}
  // For the QR code: insert a 1x1 table cell and name it {{QR_CODE}}
  // (or just leave {{QR_CODE}} as a text placeholder — the script will
  //  replace it with "See ticket ID" if image insertion is not configured)
  //
  // To get the Doc ID: open the Doc → copy the long string from the URL:
  //   https://docs.google.com/document/d/  <<<THIS PART>>>  /edit
  TICKET_TEMPLATE_DOC_ID: "YOUR_GOOGLE_DOC_TEMPLATE_ID",

  // ── Resend (email service) ────────────────────────────────────
  // Sign up free at https://resend.com → API Keys → Create API Key
  RESEND_API_KEY: "YOUR_RESEND_API_KEY",

  // The "From" address for ticket emails.
  // On Resend's free tier you can use: onboarding@resend.dev
  // For a custom domain (e.g. tickets@revcelebration.com) you must
  // verify the domain in Resend's dashboard first.
  EMAIL_FROM: "Rev. Emeka Eze Celebration <onboarding@resend.dev>",

  // ── Twilio (WhatsApp) ─────────────────────────────────────────
  // Sign up at https://twilio.com → get Account SID and Auth Token
  // from your Twilio Console dashboard.
  TWILIO_ACCOUNT_SID: "YOUR_TWILIO_ACCOUNT_SID",
  TWILIO_AUTH_TOKEN: "YOUR_TWILIO_AUTH_TOKEN",

  // The WhatsApp-enabled Twilio number in E.164 format, e.g. +14155238886
  // (This is the Twilio sandbox number during testing, or your purchased
  //  number once you go live.)
  TWILIO_WHATSAPP_FROM: "whatsapp:+YOUR_TWILIO_WHATSAPP_NUMBER",

  // ── Event details (used in emails and WhatsApp messages) ──────
  EVENT_NAME: "Rev. Dr. Emeka Eze Birthday Celebration",
  EVENT_DATES: "21st, 22nd & 24th May 2026",
  EVENT_VENUE: "Assemblies of God International Worship Centre, Abuja",
};

// ═══════════════════════════════════════════════════════════════
//  COLUMN HEADERS  (order must match appendRow call in doPost)
// ═══════════════════════════════════════════════════════════════

var HEADERS = [
  "Timestamp",
  "Ticket ID",
  "First Name",
  "Last Name",
  "Title",
  "Phone",
  "Email",
  "Attending",
  "Events",
  "Adire Fabric Interest",
  "Attending With Someone",
  "WhatsApp Consent",
];

// ═══════════════════════════════════════════════════════════════
//  doPost — called by the website when a guest submits the RSVP form
// ═══════════════════════════════════════════════════════════════

function doPost(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    // Debug: log what arrives so we can diagnose issues
    Logger.log("postData type: " + (e.postData ? e.postData.type : "NONE"));
    Logger.log("postData contents: " + (e.postData ? e.postData.contents : "EMPTY"));

    // Parse the JSON body — works with both text/plain and application/json content types
    var raw = e.postData.contents;
    var data;
    try {
      data = JSON.parse(raw);
    } catch (parseErr) {
      // If direct parse fails, try URL-decoding first (some browsers encode the body)
      data = JSON.parse(decodeURIComponent(raw));
    }

    Logger.log("Parsed data for: " + (data.first_name || "?") + " " + (data.last_name || "?"));

    // 1. Generate unique ticket ID
    var ticketId = generateTicketId();

    // 2. Save to Google Sheet
    saveToSheet(data, ticketId);

    // 3. Generate QR code image blob
    var qrBlob = generateQRCode(ticketId);

    // 4. Generate PDF ticket
    var pdfBlob = generateTicketPDF(data, ticketId, qrBlob);

    // 5. Send confirmation email with PDF ticket attached
    if (data.email) {
      sendConfirmationEmail(data, ticketId, pdfBlob);
    }

    // 6. Send WhatsApp confirmation (only if user opted in)
    if (data.whatsapp_consent === "yes" && data.phone) {
      sendWhatsAppMessage(
        data.phone,
        buildWhatsAppConfirmation(data, ticketId),
      );
    }

    output.setContent(
      JSON.stringify({ result: "success", ticket_id: ticketId }),
    );
  } catch (err) {
    Logger.log("doPost error: " + err.toString());
    output.setContent(
      JSON.stringify({ result: "error", message: err.toString() }),
    );
  }

  return output;
}

// ═══════════════════════════════════════════════════════════════
//  doGet — health check + email duplicate check
// ═══════════════════════════════════════════════════════════════

function doGet(e) {
  // Email duplicate check — called from the frontend on email field blur
  if (e && e.parameter && e.parameter.check_email) {
    var email = e.parameter.check_email.toLowerCase().trim();
    var registered = isEmailRegistered(email);
    return ContentService
      .createTextOutput(JSON.stringify({ registered: registered }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  // Health check
  return ContentService
    .createTextOutput(JSON.stringify({ status: "active" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function isEmailRegistered(email) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) return false;
  var data = sheet.getDataRange().getValues();
  // HEADERS: Email is index 6
  for (var i = 1; i < data.length; i++) {
    if ((data[i][6] || "").toString().toLowerCase().trim() === email) {
      return true;
    }
  }
  return false;
}

// ═══════════════════════════════════════════════════════════════
//  TICKET ID
// ═══════════════════════════════════════════════════════════════

function generateTicketId() {
  // Format: REV-XXXXXX  (6 uppercase alphanumeric characters)
  var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion
  var id = "REV-";
  for (var i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// ═══════════════════════════════════════════════════════════════
//  GOOGLE SHEET
// ═══════════════════════════════════════════════════════════════

function saveToSheet(data, ticketId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.appendRow(HEADERS);
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground("#C9A84C");
    headerRange.setFontColor("#0A0A1A");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  var timestamp = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "dd/MM/yyyy HH:mm:ss",
  );

  sheet.appendRow([
    timestamp,
    ticketId,
    data.first_name || "",
    data.last_name || "",
    data.title || "",
    data.phone || "",
    data.email || "",
    data.attendance || "",
    data.events || "",
    data.adire_interest || "",
    data.attending_with_someone || "",
    data.whatsapp_consent || "no",
  ]);

  sheet.autoResizeColumns(1, HEADERS.length);
}

// ═══════════════════════════════════════════════════════════════
//  QR CODE
// ═══════════════════════════════════════════════════════════════

function generateQRCode(ticketId) {
  // QRServer.com — free, no account required
  var url =
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=" +
    encodeURIComponent(ticketId);
  var response = UrlFetchApp.fetch(url);
  return response.getBlob().setName("qr-" + ticketId + ".png");
}

// ═══════════════════════════════════════════════════════════════
//  PDF TICKET  (generated from a Google Doc template)
// ═══════════════════════════════════════════════════════════════

function generateTicketPDF(data, ticketId, qrBlob) {
  var fullName =
    (data.title ? data.title + " " : "") +
    (data.first_name || "") +
    " " +
    (data.last_name || "");
  fullName = fullName.trim();

  var eventsText = data.events || "—";

  // Clone the template into a temporary copy
  var templateFile = DriveApp.getFileById(CONFIG.TICKET_TEMPLATE_DOC_ID);
  var tempCopy = templateFile.makeCopy("TICKET_" + ticketId + "_TEMP");
  var doc = DocumentApp.openById(tempCopy.getId());
  var body = doc.getBody();

  // Replace text placeholders
  body.replaceText("\\{\\{FULL_NAME\\}\\}", fullName);
  body.replaceText("\\{\\{TITLE\\}\\}", data.title || "");
  body.replaceText("\\{\\{TICKET_ID\\}\\}", ticketId);
  body.replaceText("\\{\\{EVENTS\\}\\}", eventsText);
  body.replaceText("\\{\\{DATE_LABEL\\}\\}", CONFIG.EVENT_DATES);

  // Replace the {{QR_CODE}} placeholder with the actual QR image.
  // The placeholder lives inside a TABLE CELL, not a body-level paragraph,
  // so we must iterate through tables → rows → cells to find it.
  var numChildren = body.getNumChildren();
  for (var c = 0; c < numChildren; c++) {
    var child = body.getChild(c);
    if (child.getType() !== DocumentApp.ElementType.TABLE) continue;
    var table = child.asTable();
    for (var r = 0; r < table.getNumRows(); r++) {
      for (var col = 0; col < table.getRow(r).getNumCells(); col++) {
        var cell = table.getRow(r).getCell(col);
        if (cell.getText().indexOf("{{QR_CODE}}") === -1) continue;

        // Found the cell — clear it and insert the QR image inline
        cell.clear();
        var imgPara = cell.insertParagraph(0, "");
        imgPara.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
        imgPara.appendInlineImage(qrBlob).setWidth(90).setHeight(90);

        // Re-add the "Scan at entrance" note below the image
        var notePara = cell.insertParagraph(1, "Scan at entrance");
        notePara.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
        var ns = {};
        ns[DocumentApp.Attribute.FONT_FAMILY] = "Arial";
        ns[DocumentApp.Attribute.FONT_SIZE] = 6;
        ns[DocumentApp.Attribute.FOREGROUND_COLOR] = "#9A8E7E";
        ns[DocumentApp.Attribute.ITALIC] = true;
        ns[DocumentApp.Attribute.SPACING_BEFORE] = 4;
        notePara.setAttributes(ns);
      }
    }
  }

  doc.saveAndClose();

  // Export as PDF blob
  var pdfBlob = tempCopy
    .getAs("application/pdf")
    .setName("Ticket-" + ticketId + ".pdf");

  // Delete the temporary copy from Drive
  tempCopy.setTrashed(true);

  return pdfBlob;
}

// ═══════════════════════════════════════════════════════════════
//  CONFIRMATION EMAIL  (sent via Resend API)
// ═══════════════════════════════════════════════════════════════

function sendConfirmationEmail(data, ticketId, pdfBlob) {
  var fullName =
    (data.title ? data.title + " " : "") +
    (data.first_name || "") +
    " " +
    (data.last_name || "");
  fullName = fullName.trim();

  var subject = "Your Ticket — " + CONFIG.EVENT_NAME;

  var htmlBody = buildConfirmationEmailHTML(
    fullName,
    ticketId,
    data.events || "—",
  );

  // Resend requires attachments as base64 content
  var pdfBase64 = Utilities.base64Encode(pdfBlob.getBytes());

  var payload = {
    from: CONFIG.EMAIL_FROM,
    to: [data.email],
    subject: subject,
    html: htmlBody,
    attachments: [
      {
        filename: "Ticket-" + ticketId + ".pdf",
        content: pdfBase64,
        content_type: "application/pdf",
      },
    ],
  };

  var options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + CONFIG.RESEND_API_KEY,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  var response = UrlFetchApp.fetch("https://api.resend.com/emails", options);
  Logger.log(
    "Resend response (" + data.email + "): " + response.getContentText(),
  );
}

// ═══════════════════════════════════════════════════════════════
//  CONFIRMATION EMAIL HTML TEMPLATE
// ═══════════════════════════════════════════════════════════════

function buildConfirmationEmailHTML(fullName, ticketId, events) {
  return (
    '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    "<title>Your Event Ticket</title>" +
    '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;600&display=swap" rel="stylesheet">' +
    "</head><body style=\"margin:0;padding:0;background:#0a0a1a;font-family:'DM Sans',Arial,sans-serif;\">" +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a0a1a;">' +
    '<tr><td align="center" style="padding:40px 16px;">' +
    // Card
    '<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#111127;border:1px solid #c9a84c;border-radius:12px;overflow:hidden;">' +
    // Gold top bar
    '<tr><td style="background:#c9a84c;height:6px;"></td></tr>' +
    // Header
    '<tr><td style="padding:36px 40px 24px;text-align:center;">' +
    "<p style=\"margin:0 0 8px;font-family:'DM Sans',Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a84c;\">Imperial Royalty Birthday Celebration</p>" +
    "<h1 style=\"margin:0;font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:700;color:#f0ebe3;line-height:1.2;\">Your Ticket is Confirmed</h1>" +
    "</td></tr>" +
    // Rule
    '<tr><td style="padding:0 40px;"><div style="height:1px;background:#c9a84c;opacity:0.3;"></div></td></tr>' +
    // Guest info
    '<tr><td style="padding:28px 40px 0;">' +
    '<p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c9a84c;">Guest</p>' +
    "<p style=\"margin:0;font-family:'Playfair Display',Georgia,serif;font-size:22px;color:#f0ebe3;\">" +
    fullName +
    "</p>" +
    "</td></tr>" +
    // Events attending
    '<tr><td style="padding:20px 40px 0;">' +
    '<p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c9a84c;">Events Attending</p>' +
    '<p style="margin:0;font-size:15px;color:#f0ebe3;line-height:1.6;">' +
    events.replace(/,\s*/g, "<br>") +
    "</p>" +
    "</td></tr>" +
    // Venue
    '<tr><td style="padding:20px 40px 0;">' +
    '<p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c9a84c;">Venue</p>' +
    '<p style="margin:0;font-size:15px;color:#f0ebe3;">' +
    "Assemblies of God International Worship Centre, Abuja" +
    "</p>" +
    "</td></tr>" +
    // Ticket ID
    '<tr><td style="padding:28px 40px;">' +
    '<div style="background:#0a0a1a;border:1px solid rgba(201,168,76,0.4);border-radius:8px;padding:20px;text-align:center;">' +
    '<p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c9a84c;">Ticket ID</p>' +
    "<p style=\"margin:0;font-family:'DM Sans',Arial,sans-serif;font-size:26px;font-weight:700;letter-spacing:4px;color:#f0ebe3;\">" +
    ticketId +
    "</p>" +
    '<p style="margin:8px 0 0;font-size:12px;color:#9a8e7e;">Your PDF ticket is attached — please present it at the venue entrance.</p>' +
    "</div>" +
    "</td></tr>" +
    // Footer note
    '<tr><td style="padding:0 40px 16px;text-align:center;">' +
    '<p style="margin:0;font-size:12px;color:#9a8e7e;">If you did not register for this event, please disregard this email.</p>' +
    "</td></tr>" +
    // Gold bottom bar
    '<tr><td style="background:#c9a84c;height:4px;"></td></tr>' +
    "</table>" +
    "</td></tr></table>" +
    "</body></html>"
  );
}

// ═══════════════════════════════════════════════════════════════
//  WHATSAPP  (sent via Twilio API)
// ═══════════════════════════════════════════════════════════════

function sendWhatsAppMessage(phone, message) {
  // Normalise phone: strip spaces, ensure it starts with +
  var to = phone.replace(/\s+/g, "");
  if (!to.startsWith("+")) {
    to = "+" + to;
  }

  var credentials = Utilities.base64Encode(
    CONFIG.TWILIO_ACCOUNT_SID + ":" + CONFIG.TWILIO_AUTH_TOKEN,
  );

  var url =
    "https://api.twilio.com/2010-04-01/Accounts/" +
    CONFIG.TWILIO_ACCOUNT_SID +
    "/Messages.json";

  var options = {
    method: "post",
    headers: {
      Authorization: "Basic " + credentials,
    },
    payload: {
      From: CONFIG.TWILIO_WHATSAPP_FROM,
      To: "whatsapp:" + to,
      Body: message,
    },
    muteHttpExceptions: true,
  };

  var response = UrlFetchApp.fetch(url, options);
  Logger.log("Twilio response (" + to + "): " + response.getContentText());
}

function buildWhatsAppConfirmation(data, ticketId) {
  var fullName =
    (data.title ? data.title + " " : "") +
    (data.first_name || "") +
    " " +
    (data.last_name || "");
  return (
    "Hello " +
    fullName.trim() +
    ",\n\n" +
    "Your RSVP for *" +
    CONFIG.EVENT_NAME +
    "* is confirmed! 🎉\n\n" +
    "*Ticket ID:* " +
    ticketId +
    "\n" +
    "*Date:* " +
    CONFIG.EVENT_DATES +
    "\n" +
    "*Venue:* " +
    CONFIG.EVENT_VENUE +
    "\n\n" +
    "Your PDF ticket has been sent to your email. Please present it at the venue entrance.\n\n" +
    "We look forward to celebrating with you!"
  );
}

// ═══════════════════════════════════════════════════════════════
//  REMINDER EMAILS  (call manually or via time-based trigger)
// ═══════════════════════════════════════════════════════════════

function sendReminderEmails() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    Logger.log("Sheet not found.");
    return;
  }

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    Logger.log("No registrants found.");
    return;
  }

  var headers = data[0];
  var colEmail = headers.indexOf("Email");
  var colFirst = headers.indexOf("First Name");
  var colLast = headers.indexOf("Last Name");
  var colTitle = headers.indexOf("Title");
  var colEvents = headers.indexOf("Events");
  var colAttend = headers.indexOf("Attending");

  var sent = 0;
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[colAttend] !== "attending") continue; // skip non-attendees
    var email = row[colEmail];
    if (!email) continue;

    var fullName =
      (row[colTitle] ? row[colTitle] + " " : "") +
      row[colFirst] +
      " " +
      row[colLast];

    var subject = "Reminder: " + CONFIG.EVENT_NAME + " is almost here!";
    var html = buildReminderEmailHTML(fullName.trim(), row[colEvents] || "—");

    var payload = {
      from: CONFIG.EMAIL_FROM,
      to: [email],
      subject: subject,
      html: html,
    };

    UrlFetchApp.fetch("https://api.resend.com/emails", {
      method: "post",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + CONFIG.RESEND_API_KEY,
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    });

    Utilities.sleep(300); // stay well under Resend's rate limit
    sent++;
  }

  Logger.log("Reminder emails sent: " + sent);
}

function buildReminderEmailHTML(fullName, events) {
  return (
    '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">' +
    '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;600&display=swap" rel="stylesheet">' +
    "</head><body style=\"margin:0;padding:0;background:#0a0a1a;font-family:'DM Sans',Arial,sans-serif;\">" +
    '<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a1a;">' +
    '<tr><td align="center" style="padding:40px 16px;">' +
    '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#111127;border:1px solid #c9a84c;border-radius:12px;overflow:hidden;">' +
    '<tr><td style="background:#c9a84c;height:6px;"></td></tr>' +
    '<tr><td style="padding:36px 40px 24px;text-align:center;">' +
    '<p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a84c;">Don\'t Forget</p>' +
    "<h1 style=\"margin:0;font-family:'Playfair Display',Georgia,serif;font-size:26px;color:#f0ebe3;\">The Celebration is Almost Here!</h1>" +
    "</td></tr>" +
    '<tr><td style="padding:0 40px;"><div style="height:1px;background:#c9a84c;opacity:0.3;"></div></td></tr>' +
    '<tr><td style="padding:28px 40px;">' +
    '<p style="margin:0 0 16px;font-size:15px;color:#f0ebe3;">Dear <strong>' +
    fullName +
    "</strong>,</p>" +
    '<p style="margin:0 0 16px;font-size:15px;color:#f0ebe3;">This is a friendly reminder that the <strong>' +
    CONFIG.EVENT_NAME +
    "</strong> is approaching.</p>" +
    '<p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c9a84c;">Your Events</p>' +
    '<p style="margin:0 0 20px;font-size:15px;color:#f0ebe3;line-height:1.6;">' +
    events.replace(/,\s*/g, "<br>") +
    "</p>" +
    '<p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c9a84c;">Venue</p>' +
    '<p style="margin:0 0 20px;font-size:15px;color:#f0ebe3;">Assemblies of God International Worship Centre, Abuja</p>' +
    '<p style="margin:0;font-size:14px;color:#9a8e7e;">Please remember to bring your ticket (PDF) — you can find it in our earlier email.</p>' +
    "</td></tr>" +
    '<tr><td style="background:#c9a84c;height:4px;"></td></tr>' +
    "</table></td></tr></table></body></html>"
  );
}

// ═══════════════════════════════════════════════════════════════
//  WHATSAPP REMINDERS  (call manually or via time-based trigger)
// ═══════════════════════════════════════════════════════════════

function sendWhatsAppReminders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    Logger.log("Sheet not found.");
    return;
  }

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    Logger.log("No registrants found.");
    return;
  }

  var headers = data[0];
  var colPhone = headers.indexOf("Phone");
  var colFirst = headers.indexOf("First Name");
  var colLast = headers.indexOf("Last Name");
  var colTitle = headers.indexOf("Title");
  var colAttend = headers.indexOf("Attending");
  var colConsent = headers.indexOf("WhatsApp Consent");

  var sent = 0;
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[colAttend] !== "attending") continue;
    if (row[colConsent] !== "yes") continue;
    var phone = row[colPhone];
    if (!phone) continue;

    var fullName =
      (row[colTitle] ? row[colTitle] + " " : "") +
      row[colFirst] +
      " " +
      row[colLast];

    var message =
      "Hello " +
      fullName.trim() +
      ",\n\n" +
      "This is a reminder that *" +
      CONFIG.EVENT_NAME +
      "* is almost here! 🎉\n\n" +
      "*Date:* " +
      CONFIG.EVENT_DATES +
      "\n" +
      "*Venue:* " +
      CONFIG.EVENT_VENUE +
      "\n\n" +
      "Please remember to bring your ticket to the venue entrance.\n\n" +
      "We look forward to seeing you!";

    sendWhatsAppMessage(phone, message);
    Utilities.sleep(1200); // Twilio: 1 message per second per number
    sent++;
  }

  Logger.log("WhatsApp reminders sent: " + sent);
}

// ═══════════════════════════════════════════════════════════════
//  SCHEDULED TRIGGERS SETUP
//  Run setupTriggers() ONCE from the Apps Script editor
//  (Functions menu → Run → setupTriggers).
//  It creates two time-based triggers:
//    • May 14, 2026 at 09:00 — 1-week reminder
//    • May 20, 2026 at 09:00 — 1-day reminder
// ═══════════════════════════════════════════════════════════════

function setupTriggers() {
  // Delete existing triggers with these function names to avoid duplicates
  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    var fn = existing[i].getHandlerFunction();
    if (fn === "sendReminderEmails" || fn === "sendWhatsAppReminders") {
      ScriptApp.deleteTrigger(existing[i]);
    }
  }

  // ── 1-week reminder: May 14, 2026 at 09:00 ──
  ScriptApp.newTrigger("sendReminderEmails")
    .timeBased()
    .at(new Date("2026-05-14T09:00:00"))
    .create();

  ScriptApp.newTrigger("sendWhatsAppReminders")
    .timeBased()
    .at(new Date("2026-05-14T09:00:00"))
    .create();

  // ── 1-day reminder: May 20, 2026 at 09:00 ──
  ScriptApp.newTrigger("sendReminderEmails")
    .timeBased()
    .at(new Date("2026-05-20T09:00:00"))
    .create();

  ScriptApp.newTrigger("sendWhatsAppReminders")
    .timeBased()
    .at(new Date("2026-05-20T09:00:00"))
    .create();

  Logger.log("4 triggers created: email + WhatsApp reminders on May 14 and May 20.");
}
