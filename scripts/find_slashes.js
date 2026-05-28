// Usage: node scripts/find_slashes.js /path/to/file.xlsx
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const argv = process.argv.slice(2);
if (argv.length < 1) {
  console.error('Usage: node scripts/find_slashes.js /path/to/file.xlsx');
  process.exit(1);
}
const filePath = path.resolve(argv[0]);
if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(1);
}
const wb = XLSX.readFile(filePath, { cellDates: true });
const results = [];
for (const sheetName of wb.SheetNames) {
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    if (!Array.isArray(row)) continue;
    for (let c = 0; c < row.length; c++) {
      const cell = row[c];
      if (cell === null || cell === undefined) continue;
      const s = String(cell).trim();
      if (/\d+\s*\/\s*\d+/.test(s)) {
        results.push({ sheet: sheetName, row: r+1, col: c+1, raw: s });
      }
    }
  }
}
if (results.length === 0) {
  console.log('No slash patterns found in file.');
} else {
  console.log('Found slash patterns:');
  for (const r of results) {
    console.log(`${r.sheet} - Row ${r.row} Col ${r.col}: '${r.raw}'`);
  }
}
