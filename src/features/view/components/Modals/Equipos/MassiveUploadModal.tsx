"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import * as XLSX from "xlsx";

import { AddProductCloseIcon } from "@/features/view/components/Icons/AddCloseIcon";
import { createClient } from "@/lib/supabase/client";
import { EQUIPOS_TABLE } from "@/lib/utils/namingTolerance";
import {
	normalizeSpreadsheetPercent,
	pickFirstMatchingSheet,
	readSpreadsheetNumber,
	readSpreadsheetText,
} from "@/lib/utils/helpers/massive/massiveUpload";

import { EQUIPOS_HEADERS } from "@/lib/utils/headers";
import { toSafeNumber } from "@/lib/utils/normalization";
import { MassiveUploadModalProps } from "@/lib/types/components/modals";

type EquipoMatchedSheet = {
	sheetName: string;
	rows: string[][];
	headerStart: number;
	headerRow: number;
	detectedHeaders: string[];
};

type EquipoUploadRow = {
	cod_prov: string;
	proveedor: string;
	cod_producto: string;
	tipo_de_producto: string;
	marca: string;
	descripcion: string;
	tipo_de_conexion: string;
	potencia_maxima: number;
	mppt: number;
	potencia_ac: number;
	dod: number;
	vmpp_vmin: number;
	voc_vmax: number;
	impp_i_in: string;
	isc_i_out: number;
	unidad: string;
	precio_soles: number;
	precio_dolares: number;
	igv: number;
	precio_soles_igv: number;
	precio_dolares_igv: number;
};

function mapRowToEquipo(row: string[], offset = 0): EquipoUploadRow {
	return {
		cod_prov: readSpreadsheetText(row, offset + 0),
		proveedor: readSpreadsheetText(row, offset + 1),
		cod_producto: readSpreadsheetText(row, offset + 2),
		tipo_de_producto: readSpreadsheetText(row, offset + 3),
		marca: readSpreadsheetText(row, offset + 4),
		descripcion: readSpreadsheetText(row, offset + 5),
		tipo_de_conexion: readSpreadsheetText(row, offset + 6),
		potencia_maxima: readSpreadsheetNumber(row, offset + 7),
		mppt: readSpreadsheetNumber(row, offset + 8),
		potencia_ac: readSpreadsheetNumber(row, offset + 9),
		dod: readSpreadsheetNumber(row, offset + 10),
		vmpp_vmin: readSpreadsheetNumber(row, offset + 11),
		voc_vmax: readSpreadsheetNumber(row, offset + 12),
		impp_i_in: readSpreadsheetText(row, offset + 13),
		isc_i_out: readSpreadsheetNumber(row, offset + 14),
		unidad: readSpreadsheetText(row, offset + 15),
		precio_soles: readSpreadsheetNumber(row, offset + 16),
		precio_dolares: readSpreadsheetNumber(row, offset + 17),
		igv: normalizeSpreadsheetPercent(readSpreadsheetNumber(row, offset + 18)),
		precio_soles_igv: readSpreadsheetNumber(row, offset + 19),
		precio_dolares_igv: readSpreadsheetNumber(row, offset + 20),
	};
}

export function MassiveUploadModal({ onClose, onSuccess }: MassiveUploadModalProps) {
	const supabase = useMemo(() => createClient(), []);
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [detectedHeaders, setDetectedHeaders] = useState<string[] | null>(null);
	const [detectedSheet, setDetectedSheet] = useState<string | null>(null);
	const [detectedHeaderStart, setDetectedHeaderStart] = useState<number | null>(null);
	const [detectedHeaderRow, setDetectedHeaderRow] = useState<number | null>(null);

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		setFile(event.target.files?.[0] ?? null);
		setError(null);
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);

		if (!file) {
			setError("Selecciona un archivo XLSX para importar.");
			return;
		}

		if (!file.name.toLowerCase().endsWith(".xlsx")) {
			setError("El archivo debe tener formato XLSX.");
			return;
		}

		setIsUploading(true);

		try {
			// leer encabezados y filas de la hoja detectada
			const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
			const matchedSheet = pickFirstMatchingSheet(workbook, EQUIPOS_HEADERS.filter(h => h != "Acciones")) as EquipoMatchedSheet | null;

			if (!matchedSheet) {
				throw new Error("No se encontraron encabezados válidos para equipos principales.");
			}

			setDetectedSheet(matchedSheet.sheetName);
			setDetectedHeaders(matchedSheet.detectedHeaders);
			setDetectedHeaderStart(matchedSheet.headerStart);
			setDetectedHeaderRow(matchedSheet.headerRow);

			if (matchedSheet.rows.length === 0) {
				throw new Error("El archivo no contiene filas para importar.");
			}

            const payload = matchedSheet.rows.map((row) => mapRowToEquipo(row, matchedSheet.headerStart));

			// claves numéricas
			const numericKeys: Array<keyof EquipoUploadRow> = [
				"potencia_maxima",
				"mppt",
				"potencia_ac",
				"dod",
				"vmpp_vmin",
				"voc_vmax",
				"isc_i_out",
				"precio_soles",
				"precio_dolares",
				"igv",
				"precio_soles_igv",
				"precio_dolares_igv",
			];

			const dbPayload = payload.map((r, rowIdx) => {
				const copy: Record<string, unknown> = { ...r };

				for (const key of numericKeys) {
					const raw = r[key] as unknown;
					if (raw === undefined || raw === null || raw === "") {
						copy[key] = 0;
						continue;
					}

					// If it's already a number, keep it
					if (typeof raw === "number") {
						copy[key] = raw;
						continue;
					}

					let s = String(raw).trim();

					// If looks like a fraction "20/20", take first part
					if (/^\s*\d+\s*\/\s*\d+\s*$/.test(s)) {
						s = s.split("/")[0];
					}

					const num = toSafeNumber(s);
					if (!Number.isFinite(num)) {
						// fallback to 0 and log for debugging
						console.warn(`MassiveUpload: could not parse numeric field ${String(key)} 
							on row ${rowIdx + 1}, raw='${String(raw)}'`);
						copy[key] = 0;
					} else {
						copy[key] = num;
					}
				}

				return copy as unknown as EquipoUploadRow;
			});

			// Validate numeric ranges before attempting DB insert to detect overflow sources
			const MAX_SAFE_UPLOAD_NUMBER = 1_000_000_000; // must match toSafeNumber cap
			const offending: { row: number; field: keyof EquipoUploadRow; value: number | string }[] = [];

			dbPayload.forEach((r, idx) => {
				const checks: Array<keyof EquipoUploadRow> = [
					"potencia_maxima",
					"mppt",
					"potencia_ac",
					"dod",
					"vmpp_vmin",
					"voc_vmax",
					"isc_i_out",
					"precio_soles",
					"precio_dolares",
					"igv",
					"precio_soles_igv",
					"precio_dolares_igv",
				];

				for (const field of checks) {
					const val = r[field] as unknown;
					if (typeof val === "number" && !Number.isFinite(val)) {
						offending.push({ row: idx + 1, field, value: String(val) });
					} else if (typeof val === "number" && Math.abs(val) > MAX_SAFE_UPLOAD_NUMBER) {
						offending.push({ row: idx + 1, field, value: val });
					}
				}
			});

			if (offending.length > 0) {
				console.warn("Massive upload blocked due to numeric overflow candidates:", offending);
				const first = offending[0];
				throw new Error(`No se pudo completar la subida masiva: numeric field overflow en fila 
					${first.row} campo ${first.field} valor ${first.value}`);
			}

			const { error: insertError } = await supabase.from(EQUIPOS_TABLE).insert(dbPayload);

			if (insertError) {
				throw new Error(`No se pudo completar la subida masiva: ${insertError.message}`);
			}

			onSuccess?.();
			onClose();
		} catch (uploadError) {
			const message = uploadError instanceof Error ? uploadError.message : "Ocurrió un error durante la importación.";
			setError(message);
		} finally {
			setIsUploading(false);
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
			<div className="max-h-[95vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
				<div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
					<div>
						<h2 className="text-2xl font-bold text-slate-900">Subida masiva de equipos</h2>
						<p className="text-sm text-slate-600">Selecciona un archivo XLSX con la estructura de la hoja de equipos principales.</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
						aria-label="Cerrar modal"
					>
						<AddProductCloseIcon />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
					<label className="block space-y-2 text-sm font-medium text-slate-700">
						<span>Archivo XLSX</span>
						<input
							type="file"
							accept=".xlsx"
							onChange={handleFileChange}
							className="block w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-white hover:border-brand-500"
						/>
					</label>

					{file && (
						<p className="text-sm text-slate-600">
							Archivo seleccionado: <span className="font-semibold text-slate-900">{file.name}</span>
						</p>
					)}

					{detectedSheet && (
						<div className="mt-3 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
							<p className="font-medium text-slate-900">Hoja detectada: {detectedSheet}</p>
							{/* {detectedHeaderRow !== null && (
								<p>Fila de encabezado: {detectedHeaderRow}</p>
							)}
							{detectedHeaderStart !== null && (
								<p>
									Columna de inicio: {String.fromCharCode(65 + detectedHeaderStart)} (índice {detectedHeaderStart})
								</p>
							)} */}
							{detectedHeaders && detectedHeaders.length > 0 && (
								<p className="mt-1">Encabezados detectados: {detectedHeaders.join(", ")}</p>
							)}
						</div>
					)}

					{error && <p className="text-sm font-medium text-red-600">{error}</p>}

					<div className="flex justify-end gap-4 border-t border-slate-200 pt-6">
						<button
							type="button"
							onClick={onClose}
							className="rounded-xl border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={isUploading}
							className="rounded-xl bg-brand-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isUploading ? "Importando..." : "Confirmar subida"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default MassiveUploadModal;
