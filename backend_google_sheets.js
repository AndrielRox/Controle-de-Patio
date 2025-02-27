const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SHEET_ID = process.env.SHEET_ID;
const GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const auth = new google.auth.GoogleAuth({
  credentials: GOOGLE_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

app.post("/api/register-truck", async (req, res) => {
  try {
    const { nota, fornecedor, placa, telefone, transportadora } = req.body;
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Dados!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[nota, fornecedor, placa, telefone, transportadora, "portaria"]],
      },
    });
    res.status(200).send("Caminhão cadastrado com sucesso");
  } catch (error) {
    res.status(500).send("Erro ao cadastrar caminhão");
  }
});

app.post("/api/update-truck-location", async (req, res) => {
  try {
    const { id, location } = req.body;
    res.status(200).send("Localização atualizada");
  } catch (error) {
    res.status(500).send("Erro ao atualizar localização");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
