import * as XLSX from "xlsx";

import { toSafeNumber } from "@/lib/utils/helpers";

type SpreadsheetArrayRow = string[];
type SpreadsheetObjectRow = Record<string, unknown>;

export function normalizeSpreadsheetHeader(value: string) {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "")
		.trim();
}

// leer texto de la celda
export function readSpreadsheetText(row: SpreadsheetArrayRow | SpreadsheetObjectRow, indexOrKeys: number | readonly string[]) {
	if (Array.isArray(row)) {
		const value = row[indexOrKeys as number];

		return value !== undefined && value !== null ? String(value).trim() : "";
	}

	for (const key of indexOrKeys as readonly string[]) {
		const value = row[key];
		if (value !== undefined && value !== null && String(value).trim() !== "") {
			return String(value).trim();
		}
	}

	return "";
}

export function readSpreadsheetNumber(row: SpreadsheetArrayRow | SpreadsheetObjectRow, indexOrKeys: number | readonly string[]) {
	if (Array.isArray(row)) {
		const value = row[indexOrKeys as number];

		return value !== undefined && value !== null && String(value).trim() !== ""
			? toSafeNumber(value)
			: 0;
	}

	for (const key of indexOrKeys as readonly string[]) {
		const value = row[key];
		if (value !== undefined && value !== null && String(value).trim() !== "") {
			return toSafeNumber(value);
		}
	}

	return 0;
}

export function normalizeSpreadsheetPercent(value: number) {
	if (!value) {
		return 0;
	}

	// Convert input to a decimal fraction suitable for storage:
	// - If the spreadsheet provides a percentage like 18 (meaning 18%), store 0.18
	// - If it already provides a fraction like 0.18, keep as-is
	return value > 1 ? value / 100 : value;
}

export function sheetHasHeaders(row: SpreadsheetArrayRow | SpreadsheetObjectRow, expected: readonly string[] | Record<string, string[]>) {
	if (Array.isArray(row) && Array.isArray(expected)) {
		if (row.length < expected.length) {
			return false;
		}

		return expected.every((expectedHeader, index) => {
			const actualHeader = row[index] ?? "";
			return normalizeSpreadsheetHeader(actualHeader) === normalizeSpreadsheetHeader(expectedHeader);
		});
	}

	if (!Array.isArray(row) && !Array.isArray(expected)) {
		const normalizedHeaders = new Set(Object.keys(row).map(normalizeSpreadsheetHeader));

		return Object.values(expected).every((candidateList) =>
			candidateList.some((candidate: string) => normalizedHeaders.has(normalizeSpreadsheetHeader(candidate)))
		);
	}

	return false;
}


export function pickFirstMatchingSheet(
	workbook: XLSX.WorkBook,
	expectedHeaders: readonly string[] | Record<string, string[]>
) {
	for (const sheetName of workbook.SheetNames) {
		const worksheet = workbook.Sheets[sheetName];

		const rows = Array.isArray(expectedHeaders)
			? XLSX.utils.sheet_to_json<SpreadsheetArrayRow>(worksheet, {
				header: 1,
				defval: "",
				raw: false,
				blankrows: false,
			})
			: XLSX.utils.sheet_to_json<SpreadsheetObjectRow>(worksheet, {
				defval: "",
				raw: false,
				blankrows: false,
			});

		if (rows.length > 0) {
			const firstRow = rows[0];

			if (Array.isArray(expectedHeaders)) {
				// Search all rows for a header row and allow the header to start at any column index
				for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
					const candidateRow = rows[rowIndex];

					if (!Array.isArray(candidateRow)) continue;

					const maxStart = Math.max(0, candidateRow.length - expectedHeaders.length);

					for (let start = 0; start <= maxStart; start += 1) {
						let matched = true;

						for (let h = 0; h < expectedHeaders.length; h += 1) {
							const actualHeader = candidateRow[start + h] ?? "";
							if (normalizeSpreadsheetHeader(actualHeader) !== normalizeSpreadsheetHeader(expectedHeaders[h])) {
								matched = false;
								break;
							}
						}

						if (matched) {
							// Return rows after the header row, and include headerStart, headerRow and the detected header names
							const detected = [] as string[];
							for (let h = 0; h < expectedHeaders.length; h += 1) {
								detected.push(String(candidateRow[start + h] ?? ""));
							}

							return {
								sheetName,
								rows: rows.slice(rowIndex + 1),
								headerStart: start,
								headerRow: rowIndex + 1, // 1-based for UI
								detectedHeaders: detected,
							};
						}
					}
				}
			} else if (!Array.isArray(firstRow)) {
				const aliasHeaders = expectedHeaders as Record<string, string[]>;
				if (sheetHasHeaders(firstRow, aliasHeaders)) {
					return { sheetName, rows, detectedHeaders: Object.keys(firstRow) };
				}
			}
		}
	}

	return null;
}
