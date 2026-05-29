// Usage: node scripts/check_xlsx_overflow.js /path/to/file.xlsx
// Install dependency if needed: npm install xlsx

import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const MAX_SAFE_UPLOAD_NUMBER = 1_000_000_000;

function toSafeNumberForCheck(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  if (value === null || value === undefined) return NaN;
  let s = String(value).trim();
  if (s === '') return NaN;
  s = s.replace(/[\s\$S€£¥¢₱₲]/g, '');
  if (s.includes('/')) s = s.split('/')[0];
  if (s.includes(',')) {
    if (s.includes('.')) s = s.replace(/,/g, '');
    else s = s.replace(/,/g, '.');
  }
  const m = s.match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : NaN;
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.length < 1) {
    console.error('Usage: node scripts/check_xlsx_overflow.js /path/to/file.xlsx');
    process.exit(1);
  }

  const filePath = path.resolve(argv[0]);
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }

  const wb = XLSX.readFile(filePath, { cellDates: true });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

  // Try to detect header row by looking for keywords
  let headerRowIndex = -1;
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = rows[i];
    if (!Array.isArray(row)) continue;
    const joined = row.join(' ').toLowerCase();
    if (joined.includes('potencia') && (joined.includes('precio') || joined.includes('igv'))) {
      headerRowIndex = i;
      break;
    }
  }
  if (headerRowIndex === -1) headerRowIndex = 0;

  const dataRows = rows.slice(headerRowIndex + 1);
  console.log(`Detected sheet: ${sheetName}`);
  console.log(`Header row: ${headerRowIndex + 1}`);

  const problems = [];

  dataRows.forEach((row, idx) => {
    // fields of interest by index based on the app mapping
    const fieldMap = {
      7: 'potencia_maxima',
      8: 'mppt_dod',
      9: 'potencia_ac',
      10: 'voc_vmax',
      11: 'vmpp_vmin',
      13: 'impp_imax_out',
      15: 'precio_soles',
      16: 'precio_dolares',
      17: 'igv',
      18: 'precio_soles_igv',
      19: 'precio_dolares_igv'
    };

    Object.entries(fieldMap).forEach(([colIdxStr, field]) => {
      const colIdx = Number(colIdxStr);
      const cell = row[colIdx];
      if (cell === undefined || cell === null || String(cell).trim() === '') return;
      const parsed = toSafeNumberForCheck(cell);
      if (!Number.isFinite(parsed)) {
        problems.push({ row: headerRowIndex + 1 + idx + 1, col: colIdx + 1, field, raw: cell, parsed });
      } else if (Math.abs(parsed) > MAX_SAFE_UPLOAD_NUMBER) {
        problems.push({ row: headerRowIndex + 1 + idx + 1, col: colIdx + 1, field, raw: cell, parsed });
      }
    });
  });

  if (problems.length === 0) {
    console.log('No numeric overflow candidates found.');
  } else {
    console.log('Found problematic cells:');
    problems.forEach(p => {
      console.log(`Row ${p.row}, Col ${p.col} (${p.field}) -> raw='${p.raw}' parsed=${p.parsed}`);
    });
  }
}

main();
