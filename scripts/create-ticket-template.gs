// ─────────────────────────────────────────────────────────────────────────────
// Rev. Emeka Eze Birthday — Ticket Template Creator
//
// HOW TO USE:
// 1. In your Google Apps Script editor, click the "+" next to "Files"
// 2. Name the new file: create-ticket-template
// 3. Paste this entire file into it
// 4. Click Run → createTicketTemplate
// 5. Grant permissions when prompted
// 6. When done, open the Execution Log (View → Logs) and copy the Document ID
// 7. Paste that ID into CONFIG.TICKET_TEMPLATE_DOC_ID in your main script
//
// Run this function ONCE only. After the template is created you can
// delete or ignore this file — it won't affect the main RSVP script.
// ─────────────────────────────────────────────────────────────────────────────

function createTicketTemplate() {

  var doc  = DocumentApp.create("Rev Eze Birthday — Ticket Template");
  var body = doc.getBody();

  // ── Page setup (A5 portrait) ────────────────────────────────────────────────
  body.setPageWidth(419.53);
  body.setPageHeight(595.28);
  body.setMarginTop(28);
  body.setMarginBottom(28);
  body.setMarginLeft(36);
  body.setMarginRight(36);
  body.setBackgroundColor("#0A0A1A");
  body.clear();

  // ── Shorthand attribute keys ────────────────────────────────────────────────
  var A = DocumentApp.Attribute;
  var H = DocumentApp.HorizontalAlignment;

  // ── Helper: add a styled paragraph ──────────────────────────────────────────
  function addPara(text, fontFamily, fontSize, color, bold, italic, align, spaceAfter) {
    var para = body.appendParagraph(text);
    var s = {};
    s[A.FONT_FAMILY]      = fontFamily;
    s[A.FONT_SIZE]        = fontSize;
    s[A.FOREGROUND_COLOR] = color;
    s[A.BOLD]             = bold  || false;
    s[A.ITALIC]           = italic || false;
    s[A.SPACING_AFTER]    = spaceAfter !== undefined ? spaceAfter : 4;
    s[A.SPACING_BEFORE]   = 0;
    para.setAttributes(s);
    para.setAlignment(align || H.CENTER);
    return para;
  }

  // ── Helper: style a paragraph (for table cells and inline blocks) ───────────
  function stylePara(para, fontFamily, fontSize, color, bold, italic, align, spaceAfter) {
    var s = {};
    s[A.FONT_FAMILY]      = fontFamily;
    s[A.FONT_SIZE]        = fontSize;
    s[A.FOREGROUND_COLOR] = color;
    s[A.BOLD]             = bold  || false;
    s[A.ITALIC]           = italic || false;
    s[A.SPACING_AFTER]    = spaceAfter !== undefined ? spaceAfter : 4;
    s[A.SPACING_BEFORE]   = 0;
    para.setAttributes(s);
    para.setAlignment(align || H.LEFT);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  BUILD THE TICKET LAYOUT
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Top gold bar ────────────────────────────────────────────────────────────
  var topBar = body.appendTable([["  "]]);
  topBar.setBorderColor("#C9A84C");
  topBar.setBorderWidth(0);
  var topCell = topBar.getCell(0, 0);
  topCell.setBackgroundColor("#C9A84C");
  topCell.setPaddingTop(4);
  topCell.setPaddingBottom(4);
  topCell.setPaddingLeft(0);
  topCell.setPaddingRight(0);
  stylePara(topCell.getChild(0).asParagraph(), "Arial", 2, "#C9A84C", false, false, H.CENTER, 0);

  // ── Logo placeholder ────────────────────────────────────────────────────────
  addPara(
    "[ INSERT LOGO HERE — see instructions below ]",
    "Arial", 7, "#C9A84C", false, true, H.CENTER, 4
  );

  // ── Overline ────────────────────────────────────────────────────────────────
  addPara(
    "C E L E B R A T I N G   A N   I M P E R I A L   R O Y A L T Y",
    "Arial", 6, "#C9A84C", true, false, H.CENTER, 2
  );

  // ── Gold rule ───────────────────────────────────────────────────────────────
  addPara(
    "────────────────────────────────────",
    "Arial", 7, "#C9A84C", false, false, H.CENTER, 2
  );

  // ── Main title ──────────────────────────────────────────────────────────────
  addPara(
    "Birthday Celebration",
    "Georgia", 20, "#F0EBE3", true, false, H.CENTER, 3
  );

  // ── Event dates ─────────────────────────────────────────────────────────────
  addPara(
    "21st, 22nd & 24th May 2026",
    "Arial", 9, "#C9A84C", false, false, H.CENTER, 2
  );

  // ── Venue ───────────────────────────────────────────────────────────────────
  addPara(
    "Assemblies of God Int'l Worship Centre, Abuja",
    "Arial", 7, "#9A8E7E", false, true, H.CENTER, 6
  );

  // ── Divider ─────────────────────────────────────────────────────────────────
  addPara(
    "────────────────────────────────────",
    "Arial", 7, "#C9A84C", false, false, H.CENTER, 8
  );

  // ── Guest label + value ─────────────────────────────────────────────────────
  addPara("GUEST", "Arial", 6, "#C9A84C", true, false, H.LEFT, 1);
  addPara("{{FULL_NAME}}", "Georgia", 15, "#F0EBE3", true, false, H.LEFT, 8);

  // ── Events label + value ────────────────────────────────────────────────────
  addPara("EVENTS ATTENDING", "Arial", 6, "#C9A84C", true, false, H.LEFT, 1);
  addPara("{{EVENTS}}", "Arial", 9, "#F0EBE3", false, false, H.LEFT, 8);

  // ── Date label + value ──────────────────────────────────────────────────────
  addPara("DATE", "Arial", 6, "#C9A84C", true, false, H.LEFT, 1);
  addPara("{{DATE_LABEL}}", "Arial", 9, "#F0EBE3", false, false, H.LEFT, 8);

  // ── Divider before ticket box ───────────────────────────────────────────────
  addPara(
    "────────────────────────────────────",
    "Arial", 7, "#C9A84C", false, false, H.CENTER, 6
  );

  // ── Ticket ID + QR Code table ───────────────────────────────────────────────
  var ticketTable = body.appendTable([["TICKET ID", "QR"]]);
  ticketTable.setBorderColor("#C9A84C");
  ticketTable.setBorderWidth(1);

  // Left cell — Ticket ID
  var leftCell = ticketTable.getCell(0, 0);
  leftCell.setBackgroundColor("#111127");
  leftCell.setPaddingTop(10);
  leftCell.setPaddingBottom(10);
  leftCell.setPaddingLeft(12);
  leftCell.setPaddingRight(8);

  // Style the existing "TICKET ID" text
  var idLabel = leftCell.getChild(0).asParagraph();
  idLabel.setText("TICKET ID");
  stylePara(idLabel, "Arial", 6, "#C9A84C", true, false, H.LEFT, 4);

  // Add ticket ID placeholder
  var idValue = leftCell.appendParagraph("{{TICKET_ID}}");
  stylePara(idValue, "Arial", 14, "#F0EBE3", true, false, H.LEFT, 6);

  // Add note
  var idNote = leftCell.appendParagraph("Present this ticket at the venue entrance.");
  stylePara(idNote, "Arial", 7, "#9A8E7E", false, true, H.LEFT, 0);

  // Right cell — QR Code placeholder
  var rightCell = ticketTable.getCell(0, 1);
  rightCell.setBackgroundColor("#111127");
  rightCell.setPaddingTop(10);
  rightCell.setPaddingBottom(10);
  rightCell.setPaddingLeft(8);
  rightCell.setPaddingRight(12);

  // Replace "QR" with the actual placeholder
  var qrPara = rightCell.getChild(0).asParagraph();
  qrPara.setText("{{QR_CODE}}");
  stylePara(qrPara, "Arial", 9, "#F0EBE3", false, false, H.CENTER, 4);

  // "Scan at entrance" note
  var qrNote = rightCell.appendParagraph("Scan at entrance");
  stylePara(qrNote, "Arial", 6, "#9A8E7E", false, true, H.CENTER, 0);

  // ── Footer ──────────────────────────────────────────────────────────────────
  addPara(" ", "Arial", 4, "#0A0A1A", false, false, H.CENTER, 2);
  addPara(
    "────────────────────────────────────",
    "Arial", 7, "#C9A84C", false, false, H.CENTER, 4
  );
  addPara("Courtesy \u2014 Family", "Georgia", 9, "#C9A84C", false, true, H.CENTER, 3);
  addPara(
    "This ticket grants access to the event venue. Non-transferable.",
    "Arial", 6, "#9A8E7E", false, false, H.CENTER, 4
  );

  // ── Bottom gold bar ─────────────────────────────────────────────────────────
  var bottomBar = body.appendTable([["  "]]);
  bottomBar.setBorderColor("#C9A84C");
  bottomBar.setBorderWidth(0);
  var bottomCell = bottomBar.getCell(0, 0);
  bottomCell.setBackgroundColor("#C9A84C");
  bottomCell.setPaddingTop(3);
  bottomCell.setPaddingBottom(3);
  stylePara(bottomCell.getChild(0).asParagraph(), "Arial", 2, "#C9A84C", false, false, H.CENTER, 0);

  // ═══════════════════════════════════════════════════════════════════════════
  //  DONE — Log the Document ID
  // ═══════════════════════════════════════════════════════════════════════════
  doc.saveAndClose();

  var docId  = doc.getId();
  var docUrl = "https://docs.google.com/document/d/" + docId + "/edit";

  Logger.log("====================================================");
  Logger.log("Ticket template created successfully!");
  Logger.log("Document ID: " + docId);
  Logger.log("Open it here: " + docUrl);
  Logger.log("====================================================");
  Logger.log("NEXT STEPS:");
  Logger.log("1. Open the doc at the URL above");
  Logger.log("2. Delete the [INSERT LOGO HERE] line");
  Logger.log("3. Insert > Image > Upload from computer > logo 2.png");
  Logger.log("4. Resize the logo to about 5cm wide and center it");
  Logger.log("5. Copy the Document ID above into CONFIG.TICKET_TEMPLATE_DOC_ID");
  Logger.log("====================================================");
}
