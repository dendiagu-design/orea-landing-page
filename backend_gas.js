/*
 * =========================================================
 * OREA Lead Generation - Google Apps Script Backend
 * =========================================================
 *
 * HOW TO DEPLOY:
 * 1. Go to https://script.google.com/ and click "New Project".
 * 2. Delete the default code, and copy-paste all this code into Code.gs.
 * 3. Replace the `CHECKLIST_PDF_LINK` below with the actual Google Drive link of your PDF.
 * 4. Above the editor, click "Deploy" > "New deployment".
 * 5. On the "Select type" gear icon, choose "Web app".
 * 6. Set "Description" to "Lead Gen Webhook", "Execute as" to "Me", and "Who has access" to "Anyone".
 * 7. Click Deploy (Authorize permissions to Gmail and Sheets when prompted).
 * 8. Copy the "Web app URL" that is generated.
 * 9. Paste that URL into your `script.js` file at `const WEBHOOK_URL`.
 */

const CHECKLIST_PDF_LINK = "https://your-drive-link-here.pdf"; // Replace with actual PDF link
const FROM_NAME = "OREA Team";
const EMAIL_SUBJECT = "Your Smart Seller's Checklist 📄";

function doPost(e) {
  try {
    // Parse the incoming JSON data from our Frontend payload
    const data = JSON.parse(e.postData.contents);
    const fullName = data.fullName;
    const email = data.email;
    const timestamp = new Date();

    // 1. Save data to Google Sheets
    // Note: To use an existing sheet, you could use SpreadsheetApp.openById("your-sheet-id")
    // Here we use active spreadsheet if this script is bound to a Sheet, or create a standalone one
    let sheet;
    try {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    } catch(err) {
      // If deployed as standalone script, create a new sheet or use a specific ID
      // For now, let's assume it's created from within a Google Sheet
      throw new Error("Please create this script from within a Google Sheet (Extensions > Apps Script) so it knows where to save the data.");
    }
    
    // If sheet is empty, add headers first
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Full Name", "Email"]);
      // Optional formatting for headers
      sheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#f3f4f6");
    }
    sheet.appendRow([timestamp, fullName, email]);

    // 2. Send the actual Email to the user
    const htmlBody = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; max-width: 600px; margin: 0 auto; line-height: 1.6; border: 1px solid #e5e7eb; padding: 40px; border-radius: 12px;">
        <h2 style="color: #111; font-size: 24px; margin-top: 0;">Hi ${fullName},</h2>
        <p style="font-size: 16px; color: #555;">You're one step closer to maximizing your property's value!</p>
        
        <p style="font-size: 16px; color: #555;">As promised, here is your free <strong>Smart Seller's Checklist</strong>. Inside you'll find the 20 quick-fix improvements that can boost your selling price by up to $20,000.</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${CHECKLIST_PDF_LINK}" style="background-color: #111; color: #fff; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px; display: inline-block;">Download Checklist Now</a>
        </div>
        
        <p style="font-size: 16px; color: #555;">If you have any questions or are curious about our transparent, low-fee digital real estate model, simply reply to this email.</p>
        
        <br>
        <p style="font-size: 16px; color: #111; margin-bottom: 0;">Best regards,</p>
        <p style="font-size: 16px; font-weight: bold; color: #111; margin-top: 5px;">${FROM_NAME}</p>
      </div>
    `;

    MailApp.sendEmail({
      to: email,
      subject: EMAIL_SUBJECT,
      htmlBody: htmlBody,
      name: FROM_NAME
    });

    // 3. Return Success Response
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data saved and email sent!"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // 4. Return Error Response
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
