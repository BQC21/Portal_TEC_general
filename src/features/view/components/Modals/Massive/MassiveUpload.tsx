"use client";

import { FormEvent, useState } from "react";
import type { ChangeEvent } from "react";

import * as XLSX from "xlsx";

import { AddProductCloseIcon } from "@/features/view/components/Icons/AddCloseIcon";
import { MassiveUploadModalProps } from "@/lib/types/components/General/modals";
import {
	bulkInsertRows,
	mapRowsByColumns,
	pickFirstMatchingSheet,
	sanitizeNumericFields,
	stripSkipColumns,
} from "@/lib/utils/helpers/massive/massiveUpload";

export function MassiveUploadModal({
	title,
	description,
	tableName,
	expectedHeaders,
	columns,
	transformRows,
	relatedInserts,
	onClose,
	onSuccess,
}: MassiveUploadModalProps) {
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [detectedHeaders, setDetectedHeaders] = useState<string[] | null>(null);
	const [detectedSheet, setDetectedSheet] = useState<string | null>(null);

	function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		setFile(event.target.files?.[0] ?? null);
		setError(null);
		setDetectedHeaders(null);
		setDetectedSheet(null);
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
			const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
			const matchedSheet = pickFirstMatchingSheet(workbook, expectedHeaders);

			if (!matchedSheet) {
				throw new Error("No se encontraron encabezados válidos para este archivo.");
			}

			setDetectedSheet(matchedSheet.sheetName);
			setDetectedHeaders(matchedSheet.detectedHeaders);

			const sheetRows = (matchedSheet.rows ?? []) as string[][];
			if (sheetRows.length === 0) {
				throw new Error("El archivo no contiene filas para importar.");
			}

			const mappedRows = mapRowsByColumns(
				sheetRows,
				columns,
				matchedSheet.detectedHeaders,
				matchedSheet.headerStart ?? 0,
			);

			if (mappedRows.length === 0) {
				throw new Error("El archivo no contiene filas para importar.");
			}

			const transformedRows = transformRows ? await transformRows(mappedRows) : mappedRows;
			const payload = sanitizeNumericFields(stripSkipColumns(transformedRows, columns), columns);
			const inserted = await bulkInsertRows(tableName, payload);

			if (relatedInserts) {
				await relatedInserts(inserted, transformedRows);
			}

			onSuccess?.();
			onClose();
		} catch (uploadError) {
			const message =
				uploadError instanceof Error ? uploadError.message : "Ocurrió un error durante la importación.";
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
						<h2 className="text-2xl font-bold text-slate-900">{title}</h2>
						<p className="text-sm text-slate-600">{description}</p>
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
