import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/saveNumber', async (req, res) => {
  const { country, phone } = req.body;
  if (!country || !phone) return res.status(400).json({ message: 'Missing country or phone' });

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: process.env.GOOGLE_TYPE,
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'A:B',
      valueInputOption: 'RAW',
      requestBody: { values: [[country, phone]] },
    });

    res.status(200).json({ message: 'Number saved!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving number', error: err });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

