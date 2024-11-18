const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
const { parse } = require("json2csv");
const fs = require("fs");
const path = require("path");
const Product = require("../models/product");

async function getLeads(productName, numOfLines) {
  const product = await Product.findOne({ productName });
  if (!product) {
    throw new Error("check for valid product");
  }
  if (numOfLines > product.stock) {
    throw new Error("check for numofLines");
  }

  const sheetLink = product.sheetLink;
  const spreadsheetId = sheetLink.match(
    /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/
  )[1];
  const range = product.sheetName;

  const scopes = [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ];

  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_CREDENTIALS_PATH,
    scopes,
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetInfo = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet = spreadsheetInfo.data.sheets.find(
    (sheet) => sheet.properties.title === range
  );
  if (!sheet) {
    throw new Error(`Sheet with name "${range}" not found.`);
  }

  const sheetId = sheet.properties.sheetId;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    throw new Error("No data found in the sheet");
  }

  const headers = rows[0];
  const requiredLeads = rows.slice(1, numOfLines + 1);

  const data = requiredLeads.map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: "ROWS",
              startIndex: 1,
              endIndex: numOfLines + 1,
            },
          },
        },
      ],
    },
  });

  return data;
}

async function downloadLeads(req, res) {
  const { productname, numofLines } = req.query;
  const numOfLines = parseInt(numofLines, 10);

  try {
    const leads = await getLeads(productname, numOfLines);
    const csv = parse(leads);
    const filePath = path.join(__dirname, "../first_50_leads.csv");
    fs.writeFileSync(filePath, csv);

    res.download(filePath, "first_50_leads.csv", (err) => {
      if (err) {
        console.error("Error sending file:", err);
      }
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
}

module.exports = { downloadLeads };
