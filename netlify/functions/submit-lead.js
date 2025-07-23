const querystring = require('querystring');
const { google } = require('googleapis');

exports.handler = async (event) => {
  try {
    console.log("GOOGLE_SERVICE_ACCOUNT_CREDENTIALS env:", process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
    
    const data = querystring.parse(event.body);

    const {
      partnerName,
      partnerDivision,
      divisionProduct,
      companyName,
      decisionMaker,
      address,
      decisionMakerEmail,
      decisionMakerPhone,
      date,
      notes,
    } = data;

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authClient = await auth.getClient();

    const sheets = google.sheets('v4');

    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = 'Leads!A:J'; // 10 columns
    const values = [[
      partnerName,
      partnerDivision,
      divisionProduct,
      companyName,
      decisionMaker,
      address,
      decisionMakerEmail,
      decisionMakerPhone,
      date,
      notes,
    ]];

    await sheets.spreadsheets.values.append({
      auth: authClient,
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Lead submitted successfully' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to submit lead' }),
    };
  }
};
