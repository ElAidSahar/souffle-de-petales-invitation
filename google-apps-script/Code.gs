/**
 * RSVP backend for the wedding invitation.
 *
 * Setup (once):
 * 1. Open https://script.google.com and create a new project.
 * 2. Paste this file as Code.gs.
 * 3. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the web-app URL into js/config.js → rsvpEndpoint
 *
 * A spreadsheet named "Wedding RSVPs" is created in your Google Drive
 * on the first submission.
 */
const SHEET_NAME = "RSVPs";
const FILE_NAME = "Wedding RSVPs";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.attending ? "Yes" : "No",
      Number(data.guests || 0),
      data.message || "",
      data.voice ? "Voice note recorded" : "",
      data.lang || "",
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, service: "wedding-rsvp" });
}

function getSheet_() {
  const files = DriveApp.getFilesByName(FILE_NAME);
  const ss = files.hasNext()
    ? SpreadsheetApp.open(files.next())
    : SpreadsheetApp.create(FILE_NAME);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Name",
      "Attending",
      "Guests",
      "Message",
      "Voice",
      "Language",
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
