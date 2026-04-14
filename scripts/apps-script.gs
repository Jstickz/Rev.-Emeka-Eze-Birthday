// ─────────────────────────────────────────────────────────────────────────────
// Rev. Emeka Eze Birthday — RSVP Google Apps Script
//
// HOW TO SET THIS UP (takes about 5 minutes):
//
// 1. Open your Google Sheet (the one you created for RSVP responses).
// 2. Click Extensions → Apps Script.
// 3. Delete any existing code in the editor.
// 4. Paste this entire file into the editor.
// 5. Click Save (the floppy disk icon).
// 6. Click Deploy → New deployment.
// 7. Click the gear icon next to "Type" and select Web app.
// 8. Set "Execute as" → Me.
//    Set "Who has access" → Anyone.
// 9. Click Deploy. If asked, click Authorize access and follow the prompts.
// 10. Copy the Web app URL that appears — it looks like:
//     https://script.google.com/macros/s/XXXXXXXXXXXX/exec
// 11. Send that URL to your developer so it can be added to the website.
//
// IMPORTANT: Every time you change this script you must create a NEW deployment
// (Deploy → New deployment) — editing an existing deployment does NOT update
// the live URL.
// ─────────────────────────────────────────────────────────────────────────────

// The name of the sheet tab where responses will be written.
// Change this only if you rename the tab in your Google Sheet.
var SHEET_NAME = "RSVP Responses";

// Column headers — must match the order in appendRow() below.
var HEADERS = [
  "Timestamp",
  "First Name",
  "Last Name",
  "Title",
  "Phone",
  "Email",
  "Attending",
  "Events",
  "Adire Fabric Interest",
  "Attending With Someone"
];

// ─── doPost ──────────────────────────────────────────────────────────────────
// Called automatically by Google when the website POSTs form data.
function doPost(e) {

  // Allow cross-origin requests from any domain (required for browser fetch)
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    // Parse the JSON body sent from the website
    var data = JSON.parse(e.postData.contents);

    // Get (or create) the response sheet
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    // If the sheet doesn't exist yet, create it and add headers
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);

      // Style the header row
      var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setBackground("#C9A84C");
      headerRange.setFontColor("#0A0A1A");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    // Build the row in the same order as HEADERS
    var timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "dd/MM/yyyy HH:mm:ss"
    );

    var row = [
      timestamp,
      data.first_name            || "",
      data.last_name             || "",
      data.title                 || "",
      data.phone                 || "",
      data.email                 || "",
      data.attendance            || "",
      data.events                || "",
      data.adire_interest        || "",
      data.attending_with_someone || ""
    ];

    sheet.appendRow(row);

    // Auto-resize columns so everything is readable
    sheet.autoResizeColumns(1, HEADERS.length);

    // Return success
    output.setContent(JSON.stringify({ result: "success" }));

  } catch (err) {
    // Return the error message so it can be logged if needed
    output.setContent(JSON.stringify({ result: "error", message: err.toString() }));
  }

  return output;
}

// ─── doGet ───────────────────────────────────────────────────────────────────
// Handles GET requests — just returns a confirmation message.
// Useful for testing that the script is deployed correctly.
// Visit the Web app URL in a browser; you should see: {"status":"active"}
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "active" }))
    .setMimeType(ContentService.MimeType.JSON);
}
