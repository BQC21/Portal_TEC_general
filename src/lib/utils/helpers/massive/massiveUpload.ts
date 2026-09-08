import * as XLSX from "xlsx";

import { createClient } from "@/lib/supabase/client";
import { emptyToNull, toSafeNumber } from "@/lib/utils/normalization";
import { SpreadsheetArrayRow, SpreadsheetObjectRow, UploadColumn, UploadColumnKind } from "@/lib/types/components/Massive/upload";
import { BRAND_TABLE, EQUIPOS_TABLE, MATERIALES_TABLE, PROJECTS_EQUIPOS_TABLE, PROJECTS_MATERIALES_TABLE, PROJECTS_TABLE, QUOTE_TABLE, SUPPLIER_TABLE, ZONE_TABLE } from "../../namingTolerance";

export const MAX_SAFE_UPLOAD_NUMBER = 1_000_000_000;
export const MASSIVE_UPLOAD_CHUNK_SIZE = 500;

function requireLookup(
	map: Map<string, string>,
	name: string,
	entityLabel: string,
	rowIndex: number,
) {
	const id = resolveLookupName(map, name);
	if (!id) {
		throw new Error(`No se encontró ${entityLabel} "${name}" en la fila ${rowIndex + 1}.`);
	}

	return id;
}

function asNameList(value: unknown) {
	return Array.isArray(value) ? (value as string[]) : parseNameList(value);
}

function toNullableId(value: string | undefined) {
	if (!value) {
		return null;
	}

	const numeric = Number(value);
	return Number.isFinite(numeric) ? numeric : value;
}

export function transformEquiposRows(rows: Record<string, unknown>[]) {
	return rows.map((row) => ({
		...row,
		impp_i_in: emptyToNull(row.impp_i_in),
	}));
}

export function transformMaterialesRows(rows: Record<string, unknown>[]) {
	return rows;
}

export function transformSupplierRows(rows: Record<string, unknown>[]) {
	return rows.map((row) => ({
		...row,
		ruc: emptyToNull(row.ruc),
		contacto: emptyToNull(row.contacto),
		telefono: emptyToNull(row.telefono),
	}));
}

export async function transformBrandRows(rows: Record<string, unknown>[]) {
	const supplierMap = await fetchNameIdMap(SUPPLIER_TABLE, "nombre");

	return rows.map((row, index) => {
		const names = asNameList(row.proveedores);
		const ids = names.map((name) => Number(requireLookup(supplierMap, name, "el proveedor", index)));
		const { proveedores: _proveedores, ...rest } = row;

		return {
			...rest,
			proveedor_id: ids[0] ?? null,
			proveedor_ids: ids,
		};
	});
}

export async function transformTypeRows(rows: Record<string, unknown>[]) {
	const brandMap = await fetchNameIdMap(BRAND_TABLE, "nombre");

	return rows.map((row, index) => {
		const names = asNameList(row.marcas);
		const ids = names.map((name) => Number(requireLookup(brandMap, name, "la marca", index)));
		const { marcas: _marcas, ...rest } = row;

		return {
			...rest,
			marca_id: ids[0] ?? null,
			marca_ids: ids,
		};
	});
}

export function transformZoneRows(rows: Record<string, unknown>[]) {
	return rows;
}

export async function transformProjectRows(rows: Record<string, unknown>[]) {
	const [zoneMap, equipoMap, materialMap] = await Promise.all([
		fetchNameIdMap(ZONE_TABLE, "zona"),
		fetchNameIdMap(EQUIPOS_TABLE, "descripcion"),
		fetchNameIdMap(MATERIALES_TABLE, "descripcion"),
	]);

	return rows.map((row, index) => {
		const zonaName = String(row.zona ?? "").trim();
		if (!zonaName) {
			throw new Error(`Falta la zona en la fila ${index + 1}.`);
		}

		const zonaId = requireLookup(zoneMap, zonaName, "la zona", index);
		const equipoNames = asNameList(row.equipos);
		const materialNames = asNameList(row.materiales);
		const enlace = String(row.enlace ?? "").trim();

		return {
			nombre: row.nombre,
			zona_id: toNullableId(zonaId),
			angulo: row.angulo,
			tipo_instalacion: row.tipo_instalacion,
			configuracion: row.configuracion,
			demanda_mensual: row.demanda_mensual,
			demanda_electrica: row.demanda_electrica,
			enlace: enlace === "" ? null : enlace,
			estado_proyecto: row.estado_proyecto,
			_equipo_ids: equipoNames.map((name) => requireLookup(equipoMap, name, "el equipo", index)),
			_material_ids: materialNames.map((name) => requireLookup(materialMap, name, "el material", index)),
		};
	});
}

export async function insertProjectJoins(
	inserted: Record<string, unknown>[],
	sourceRows: Record<string, unknown>[],
) {
	const joinEquipos: Record<string, unknown>[] = [];
	const joinMateriales: Record<string, unknown>[] = [];
	const addedAt = new Date().toISOString();

	sourceRows.forEach((source, index) => {
		const project = inserted[index];
		const projectId = project?.id;

		if (projectId === undefined || projectId === null) {
			throw new Error(`No se obtuvo el id del proyecto insertado en la fila ${index + 1}.`);
		}

		for (const equipoId of asNameList(source._equipo_ids)) {
			joinEquipos.push({
				equipo_id: toNullableId(equipoId),
				proyecto_id: toNullableId(String(projectId)),
				fecha_agregado: addedAt,
				cantidad: 1,
			});
		}

		for (const materialId of asNameList(source._material_ids)) {
			joinMateriales.push({
				material_id: toNullableId(materialId),
				proyecto_id: toNullableId(String(projectId)),
				fecha_agregado: addedAt,
				cantidad: 1,
			});
		}
	});

	if (joinEquipos.length > 0) {
		await bulkInsertRows(PROJECTS_EQUIPOS_TABLE, joinEquipos);
	}

	if (joinMateriales.length > 0) {
		await bulkInsertRows(PROJECTS_MATERIALES_TABLE, joinMateriales);
	}
}

export async function transformQuoteRows(rows: Record<string, unknown>[]) {
	const projectMap = await fetchNameIdMap(PROJECTS_TABLE, "nombre");

	return rows.map((row, index) => {
		const projectName = String(row.proyecto ?? "").trim();
		if (!projectName) {
			throw new Error(`Falta el proyecto asociado en la fila ${index + 1}.`);
		}

		const { proyecto: _proyecto, ...rest } = row;

		return {
			...rest,
			proyecto_id: toNullableId(requireLookup(projectMap, projectName, "el proyecto", index)),
			markup: 0,
			gm_general: 0,
			gm_viaticos: 0,
		};
	});
}

export async function transformReportRows(rows: Record<string, unknown>[]) {
	const quoteMap = await fetchNameIdMap(QUOTE_TABLE, "cod_cotizacion");

	return rows.map((row, index) => {
		const quoteCode = String(row.cotizacion ?? "").trim();
		if (!quoteCode) {
			throw new Error(`Falta la cotización asociada en la fila ${index + 1}.`);
		}

		const { cotizacion: _cotizacion, proyecto: _proyecto, ...rest } = row;

		return {
			...rest,
			cotizacion_id: toNullableId(requireLookup(quoteMap, quoteCode, "la cotización", index)),
			ruc_dni: emptyToNull(row.ruc_dni),
		};
	});
}

export async function transformFinantialRows(rows: Record<string, unknown>[]) {
	const quoteMap = await fetchNameIdMap(QUOTE_TABLE, "cod_cotizacion");

	return rows.map((row, index) => {
		const quoteCode = String(row.cotizacion ?? "").trim();
		if (!quoteCode) {
			throw new Error(`Falta la cotización asociada en la fila ${index + 1}.`);
		}

		const { cotizacion: _cotizacion, proyecto: _proyecto, ...rest } = row;

		return {
			...rest,
			cotizacion_id: toNullableId(requireLookup(quoteMap, quoteCode, "la cotización", index)),
		};
	});
}

// normalizar encabezado
export function normalizeSpreadsheetHeader(value: string) {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "")
		.trim();
}

// leer texto de la celda
export function readSpreadsheetText(row: SpreadsheetArrayRow | SpreadsheetObjectRow, 
	indexOrKeys: number | readonly string[]) {
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

// leer número de la celda
export function readSpreadsheetNumber(row: SpreadsheetArrayRow | SpreadsheetObjectRow, 
	indexOrKeys: number | readonly string[]) {
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

// Normalizar porcentajes
export function normalizeSpreadsheetPercent(value: number) {
	if (!value) {
		return 0;
	}

	// Convert input to a decimal fraction suitable for storage:
	// - If the spreadsheet provides a percentage like 18 (meaning 18%), store 0.18
	// - If it already provides a fraction like 0.18, keep as-is
	return value > 1 ? value / 100 : value;
}

// Booleano para identificar encabezados
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

// Función para encontrar la primera hoja que coincida con los encabezados esperados
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
							// Return rows after the header row, and include headerStart, 
							// headerRow and the detected header names
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

function isBlankToken(value: unknown) {
	if (value === undefined || value === null) {
		return true;
	}

	const text = String(value).trim();
	return text === "" || text === "-" || text === "---" || text === "—";
}

function isEmptyMappedValue(value: unknown) {
	if (value === undefined || value === null) {
		return true;
	}

	if (Array.isArray(value)) {
		return value.length === 0;
	}

	if (typeof value === "string") {
		return value.trim() === "";
	}

	return false;
}

function chunkArray<T>(values: T[], chunkSize: number) {
	const chunks: T[][] = [];

	for (let index = 0; index < values.length; index += chunkSize) {
		chunks.push(values.slice(index, chunkSize + index));
	}

	return chunks;
}

export function headersFromColumns(columns: readonly UploadColumn[]) {
	return columns.map((column) => column.label);
}

export function parseNameList(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value
			.map((item) => String(item ?? "").trim())
			.filter((item) => item && !isBlankToken(item));
	}

	if (isBlankToken(value)) {
		return [];
	}

	return String(value)
		.split(/[\n,;]+/)
		.map((item) => item.trim())
		.filter((item) => item && !isBlankToken(item));
}

export function parseNumberArray(value: unknown): number[] {
	if (Array.isArray(value)) {
		return value.map((item) => toSafeNumber(item));
	}

	if (isBlankToken(value)) {
		return [];
	}

	return String(value)
		.split(/[,\s]+/)
		.map((item) => item.trim())
		.filter(Boolean)
		.map((item) => toSafeNumber(item));
}

export function parseSpreadsheetDate(value: unknown): string | null {
	if (isBlankToken(value)) {
		return null;
	}

	const text = String(value).trim();
	const dmyMatch = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

	if (dmyMatch) {
		const [, day, month, year] = dmyMatch;
		const parsed = new Date(Number(year), Number(month) - 1, Number(day));
		return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
	}

	const parsed = new Date(text);
	return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function parseCellByKind(value: unknown, kind: UploadColumnKind) {
	switch (kind) {
		case "number":
		case "currency":
			return isBlankToken(value) ? null : toSafeNumber(value);
		case "percent":
			return isBlankToken(value) ? 0 : normalizeSpreadsheetPercent(toSafeNumber(value));
		case "date":
			return parseSpreadsheetDate(value);
		case "numberArray":
			return parseNumberArray(value);
		case "nameList":
			return parseNameList(value);
		case "text":
		case "skip":
		default:
			return isBlankToken(value) ? "" : String(value).trim();
	}
}

export function mapRowsByColumns(
	rows: SpreadsheetArrayRow[],
	columns: readonly UploadColumn[],
	detectedHeaders: readonly string[] = [],
	headerStart = 0,
) {
	const headerIndexByName = new Map<string, number>();

	detectedHeaders.forEach((header, index) => {
		headerIndexByName.set(normalizeSpreadsheetHeader(header), headerStart + index);
	});

	const mappedRows: Record<string, unknown>[] = [];

	for (const row of rows) {
		if (!Array.isArray(row)) {
			continue;
		}

		const mapped: Record<string, unknown> = {};
		let empty = true;

		for (let columnIndex = 0; columnIndex < columns.length; columnIndex += 1) {
			const column = columns[columnIndex];
			const matchedIndex = headerIndexByName.get(normalizeSpreadsheetHeader(column.label));
			const cellIndex = matchedIndex ?? headerStart + columnIndex;
			mapped[column.key] = parseCellByKind(row[cellIndex], column.kind);

			if (!isEmptyMappedValue(mapped[column.key])) {
				empty = false;
			}
		}

		if (!empty) {
			mappedRows.push(mapped);
		}
	}

	return mappedRows;
}

export function stripSkipColumns(
	rows: Record<string, unknown>[],
	columns: readonly UploadColumn[],
) {
	const skipKeys = new Set(columns.filter((column) => column.kind === "skip").map((column) => column.key));

	return rows.map((row) => {
		const payload: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(row)) {
			if (key.startsWith("_") || skipKeys.has(key)) {
				continue;
			}

			payload[key] = value;
		}

		return payload;
	});
}

export function sanitizeNumericFields(
	rows: Record<string, unknown>[],
	columns: readonly UploadColumn[],
) {
	const numericKeys = new Set(
		columns
			.filter((column) => column.kind === "number" || column.kind === "percent" || column.kind === "currency")
			.map((column) => column.key),
	);

	return rows.map((row, rowIndex) => {
		const copy: Record<string, unknown> = { ...row };

		for (const key of Object.keys(copy)) {
			if (!numericKeys.has(key) && typeof copy[key] !== "number") {
				continue;
			}

			if (!numericKeys.has(key)) {
				continue;
			}

			const raw = copy[key];
			if (raw === undefined || raw === null || raw === "") {
				copy[key] = numericKeys.has(key) && columns.find((column) => column.key === key)?.kind === "percent" ? 0 : null;
				continue;
			}

			if (typeof raw === "number") {
				if (!Number.isFinite(raw) || Math.abs(raw) > MAX_SAFE_UPLOAD_NUMBER) {
					throw new Error(
						`No se pudo completar la subida masiva: valor numérico inválido en fila ${rowIndex + 1} campo ${key} valor ${raw}`,
					);
				}
				continue;
			}

			const parsed = toSafeNumber(raw);
			if (!Number.isFinite(parsed) || Math.abs(parsed) > MAX_SAFE_UPLOAD_NUMBER) {
				throw new Error(
					`No se pudo completar la subida masiva: valor numérico inválido en fila ${rowIndex + 1} campo ${key} valor ${String(raw)}`,
				);
			}

			copy[key] = parsed;
		}

		return copy;
	});
}

export function resolveLookupName(map: Map<string, string>, name: string) {
	return map.get(normalizeSpreadsheetHeader(name));
}

export async function fetchNameIdMap(tableName: string, nameColumn: string) {
	const supabase = createClient();
	const { data, error } = await supabase.from(tableName).select("*");

	if (error) {
		throw new Error(`No se pudo leer ${tableName} para resolver relaciones: ${error.message}`);
	}

	const map = new Map<string, string>();

	for (const row of data ?? []) {
		const record = row as unknown as Record<string, unknown>;
		const name = String(record[nameColumn] ?? "").trim();
		if (!name || isBlankToken(name)) {
			continue;
		}

		map.set(normalizeSpreadsheetHeader(name), String(record.id));
	}

	return map;
}

export async function lookupIdsByName(tableName: string, nameColumn: string, names: readonly string[]) {
	const map = await fetchNameIdMap(tableName, nameColumn);
	const result = new Map<string, string>();

	for (const name of names) {
		const trimmed = String(name ?? "").trim();
		if (!trimmed || isBlankToken(trimmed)) {
			continue;
		}

		const id = resolveLookupName(map, trimmed);
		if (!id) {
			throw new Error(`No se encontró "${trimmed}" en ${tableName}.`);
		}

		result.set(trimmed, id);
	}

	return result;
}

export async function bulkInsertRows<T extends Record<string, unknown>>(
	tableName: string,
	rows: T[],
): Promise<T[]> {
	if (rows.length === 0) {
		throw new Error("El archivo no contiene filas para importar.");
	}

	const supabase = createClient();
	const inserted: T[] = [];

	for (const chunk of chunkArray(rows, MASSIVE_UPLOAD_CHUNK_SIZE)) {
		const { data, error } = await supabase.from(tableName).insert(chunk).select();

		if (error) {
			throw new Error(`No se pudo completar la subida masiva: ${error.message}`);
		}

		inserted.push(...((data ?? []) as T[]));
	}

	return inserted;
}
