export type SpreadsheetArrayRow = string[];
export type SpreadsheetObjectRow = Record<string, unknown>;

export type UploadColumnKind =
	| "text"
	| "number"
	| "percent"
	| "currency"
	| "date"
	| "numberArray"
	| "nameList"
	| "skip";

export type UploadColumn = {
	key: string;
	label: string;
	kind: UploadColumnKind;
};

export type MatchedSpreadsheetSheet = {
	sheetName: string;
	rows: SpreadsheetArrayRow[] | SpreadsheetObjectRow[];
	headerStart?: number;
	headerRow?: number;
	detectedHeaders: string[];
};