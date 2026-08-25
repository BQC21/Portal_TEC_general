import { Equipos } from "@/lib/types/supabase/equipos-types";
import { Materiales } from "@/lib/types/supabase/materiales-types";
import * as XLSX from "xlsx-js-style";

type ExportCellValue = string | number | null;

export type ExportColumn<T> = {
	key: keyof T;
	label: string;
};

export const EQUIPOS_EXPORT_COLUMNS: ExportColumn<Equipos>[] = [
	{ key: "cod_prov", label: "COD PROV" },
	{ key: "proveedor", label: "PROVEEDOR" },
	{ key: "cod_producto", label: "COD PRODUCTO" },
	{ key: "tipo_de_producto", label: "TIPO DE PRODUCTO" },
	{ key: "marca", label: "MARCA" },
	{ key: "descripcion", label: "DESCRIPCIÓN" },
	{ key: "unidad", label: "UNIDAD" },
	{ key: "tipo_conexion", label: "TIPO DE CONEXIÓN" },
	{ key: "potencia_maxima", label: "POTENCIA MÁXIMA" },
	{ key: "mppt", label: "# DE MPPT" },
	{ key: "cadenas", label: "# DE CADENAS" },
	{ key: "potencia_ac", label: "POTENCIA AC" },
	{ key: "dod", label: "DoD" },
	{ key: "vmpp_vmin", label: "VMPP/VMIN" },
	{ key: "voc_vmax", label: "VOC/VMAX" },
	{ key: "impp_i_in", label: "IMPP/I IN" },
	{ key: "isc_i_out", label: "ISC/I OUT" },
	{ key: "precio_soles", label: "PRECIO S/" },
	{ key: "precio_dolares", label: "PRECIO $" },
	{ key: "igv", label: "IGV" },
	{ key: "precio_soles_igv", label: "PRECIO + IGV S/" },
	{ key: "precio_dolares_igv", label: "PRECIO + IGV $" },
];

export const MATERIALES_EXPORT_COLUMNS: ExportColumn<Materiales>[] = [
	{ key: "cod_prov", label: "COD PROV" },
	{ key: "proveedor", label: "PROVEEDOR" },
	{ key: "cod_producto", label: "COD PRODUCTO" },
	{ key: "tipo_de_producto", label: "TIPO DE PRODUCTO" },
	{ key: "marca", label: "MARCA" },
	{ key: "descripcion", label: "DESCRIPCIÓN" },
	{ key: "parte_electrica", label: "PARTE ELÉCTRICA" },
	{ key: "unidad", label: "UNIDAD" },
	{ key: "precio_soles", label: "PRECIO S/" },
	{ key: "precio_dolares", label: "PRECIO $" },
	{ key: "igv", label: "IGV" },
	{ key: "precio_soles_igv", label: "PRECIO + IGV S/" },
	{ key: "precio_dolares_igv", label: "PRECIO + IGV $" },
];

export const DOWNLOAD_FORMAT_OPTIONS = ["xlsx", "csv"] as const;
export type DownloadFormat = (typeof DOWNLOAD_FORMAT_OPTIONS)[number];

export function addExtension(name: string, fmt: string) {
	const normalized = fmt.toLowerCase();
	const ext = normalized === "csv" ? ".csv" : normalized === "xlsx" ? ".xlsx" : `.${normalized}`;
	return name.toLowerCase().endsWith(ext) ? name : `${name}${ext}`;
}

function formatExportCell(value: unknown): ExportCellValue {
	if (value === null || value === undefined || value === "---") {
		return "---";
	}

	if (typeof value === "string" && value.trim() === "") {
		return "---";
	}

	if (value instanceof Date) {
		return value.toISOString().split("T")[0];
	}

	if (typeof value === "number") {
		return Number.isFinite(value) ? value : "---";
	}

	return String(value);
}

function computeColumnWidths(rows: ExportCellValue[][], headers: string[]) {
	return headers.map((header, columnIndex) => {
		const maxCellLength = rows.reduce((maxLength, row) => {
			const cellValue = row[columnIndex];
			const cellLength = cellValue === null ? 3 : String(cellValue).length;
			return Math.max(maxLength, cellLength);
		}, header.length);

		return { wch: Math.min(maxCellLength + 2, 40) };
	});
}

function applyHeaderStyle(worksheet: XLSX.WorkSheet, headers: string[]) {
	headers.forEach((_, columnIndex) => {
		const cellAddress = XLSX.utils.encode_cell({ r: 0, c: columnIndex });
		const cell = worksheet[cellAddress];

		if (cell) {
			cell.s = {
				fill: { patternType: "solid", fgColor: { rgb: "1F4E78" } },
				font: { bold: true, color: { rgb: "FFFFFF" } },
				alignment: { horizontal: "center", vertical: "center" },
			};
		}
	});
}

export function itemsToRows<T>(items: T[], columns: ExportColumn<T>[]) {
	const headers = columns.map((column) => column.label);
	const rows: ExportCellValue[][] = items.map((item) =>
		columns.map((column) => formatExportCell(item[column.key])),
	);

	return { rows, headers };
}

export function generateCSV<T>(items: T[], columns: ExportColumn<T>[], includeHeadersFlag = true) {
	const { rows, headers } = itemsToRows(items, columns);
	const aoaRows: ExportCellValue[][] = includeHeadersFlag ? [headers, ...rows] : rows;
	const worksheet = XLSX.utils.aoa_to_sheet(aoaRows);
	return XLSX.utils.sheet_to_csv(worksheet);
}

export function generateXLSX<T>(items: T[], columns: ExportColumn<T>[], includeHeadersFlag = true) {
	const { rows, headers } = itemsToRows(items, columns);
	const workbookRows: ExportCellValue[][] = includeHeadersFlag ? [headers, ...rows] : rows;
	const worksheet = XLSX.utils.aoa_to_sheet(workbookRows);

	if (includeHeadersFlag) {
		applyHeaderStyle(worksheet, headers);
	}

	worksheet["!cols"] = computeColumnWidths(rows, headers);

	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

	const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array", cellStyles: true }) as ArrayBuffer;
	return new Blob([wbout], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	});
}

export function triggerDownload(content: string | Blob, mimeType: string, nameWithExt: string) {
	const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = nameWithExt;
	document.body.appendChild(a);
	a.click();
	a.remove();

	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function prepareAndDownloadFile<T>(
	items: T[],
	columns: ExportColumn<T>[],
	fmt: string,
	nameNoExt: string,
	includeHeadersFlag = true,
) {
	const normalizedFmt = fmt.toLowerCase();
	const finalName = addExtension(nameNoExt, normalizedFmt);

	if (normalizedFmt === "csv") {
		const content = generateCSV(items, columns, includeHeadersFlag);
		triggerDownload(`\uFEFF${content}`, "text/csv;charset=utf-8;", finalName);
		return;
	}

	if (normalizedFmt === "xlsx") {
		const content = generateXLSX(items, columns, includeHeadersFlag);
		triggerDownload(
			content,
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			finalName,
		);
	}
}
