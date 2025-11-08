import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST requests allowed' });

  const { country, phone } = req.body;
  if (!phone || !country) return res.status(400).json({ message: 'Missing phone or country' });

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: process.env.GOOGLE_TYPE,
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.append({
  spreadsheetId: process.env.SPREADSHEET_ID,
  range: 'Sheet1!A:B', // A = country, B = phone
  valueInputOption: 'RAW',
  requestBody: { values: [[country, phone]] },
});


    return res.status(200).json({ message: 'Number saved!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error saving number', error: error.message });
  }
}
