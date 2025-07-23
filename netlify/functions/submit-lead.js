const { google } = require("googleapis");

exports.handler = async function (event, context) {
  try {
    console.log("Received event.body:", event.body);

    // Parse URL-encoded form data
    const parsedData = Object.fromEntries(new URLSearchParams(event.body));
    console.log("Parsed data:", parsedData);

    // Check for service account credentials
    console.log("GOOGLE_SERVICE_ACCOUNT_CREDENTIALS env:", process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);

    // Authenticate with Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = "15ut4AnBmHdBliKedUw28VExVaJHX_XFeldETfTqYgTI"; // your Google Sheet ID
    const range = "Sheet1!A2:K"; // Adjust based on your sheet layout

    const values = [
      [
        parsedData.partnerName,
        parsedData.partnerDivision,
        parsedData.divisionProduct,
        parsedData.companyName,
        parsedData.decisionMaker,
        parsedData.address,
        parsedData.decisionMakerEmail,
        parsedData.decisionMakerPhone,
        parsedData.date,
        parsedData.notes,
        new Date().toISOString(),
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Lead submitted successfully" }),
    };
  } catch (error) {
    console.error("Error submitting lead:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to submit lead", details: error.message }),
    };
  }
};
