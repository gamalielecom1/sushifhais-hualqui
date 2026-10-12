// Google Apps Script — pégalo en Extensiones > Apps Script de tu Google Sheet.
// Luego: Implementar > Nueva implementación > Aplicación web
//   - Ejecutar como: Yo
//   - Quién tiene acceso: Cualquier usuario
// Copia la URL resultante (termina en /exec) y ponla en .env.local como
// NEXT_PUBLIC_SHEETS_ENDPOINT

const SHEET_NAME = "Registros";
const HEADERS = ["Fecha registro", "Nombre", "Correo", "Teléfono", "Cumpleaños"];

function doPost(e) {
  const sheet = getSheet_();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.nombre || "",
    data.correo || "",
    data.telefono || "",
    data.cumpleanos || "",
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true })
  ).setMimeType(ContentService.MimeType.JSON);
}

// Permite abrir la URL del script en el navegador para confirmar que está
// desplegado y respondiendo correctamente (no guarda nada).
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, message: "Sushi Fhais Hualqui registro activo" })
  ).setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }

  return sheet;
}
