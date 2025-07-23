const { google } = require('googleapis');
const sheets = google.sheets('v4');
const querystring = require('querystring');

exports.handler = async (event) => {
  console.log('Received event.body:', event.body);

  try {
    if (!event.body) {
      throw new Error('No body received in request');
    }

    // Parse URL-encoded form data
    const data = querystring.parse(event.body);

    console.log('Parsed data:', data);

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

    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = 'Leads!A:J';
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
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to submit lead', details: error.message }),
    };
  }
};

