"use client";

import { FormEvent, useState } from "react";

import { AddProductCloseIcon } from "@/features/view/components/Icons/AddCloseIcon";
import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField";
import { AddProductTextField } from "@/features/view/components/Form_fields/AddTextField";
import { MassiveDownloadModalProps } from "@/lib/types/components/General/modals";
import {
	DOWNLOAD_FORMAT_OPTIONS,
	DownloadFormat,
	prepareAndDownloadFile,
} from "@/lib/utils/helpers/massive/massiveDownload";

export function MassiveDownloadModal<T>({
	title,
	description,
	items,
	columns,
	defaultFileName,
	onClose,
}: MassiveDownloadModalProps<T>) {
	const [fileName, setFileName] = useState(defaultFileName);
	const [format, setFormat] = useState<DownloadFormat>("xlsx");
	const [error, setError] = useState<string | null>(null);
	const [isDownloading, setIsDownloading] = useState(false);

	const canDownload = items.length > 0 && fileName.trim().length > 0;

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (items.length <= 0) {
			setError("No hay registros para descargar.");
			return;
		}

		if (!fileName.trim()) {
			setError("Indica un nombre para el archivo.");
			return;
		}

		setError(null);
		setIsDownloading(true);

		try {
			prepareAndDownloadFile(items, columns, format, fileName.trim());
			onClose();
		} catch (downloadError) {
			const message =
				downloadError instanceof Error
					? downloadError.message
					: "No se pudo completar la descarga masiva.";
			setError(message);
		} finally {
			setIsDownloading(false);
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
			<div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
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

				<form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
					<p className="text-sm text-slate-700">
						Registros a exportar:{" "}
						<span className="font-semibold text-slate-900">{items.length}</span>
					</p>

					<AddProductTextField
						label="Nombre del archivo"
						required
						placeholder={defaultFileName}
						value={fileName}
						onChange={setFileName}
					/>

					<AddProductSelectField
						label="Formato"
						required
						options={[...DOWNLOAD_FORMAT_OPTIONS]}
						value={format}
						onChange={(value) => setFormat(value as DownloadFormat)}
					/>

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
							disabled={isDownloading || !canDownload}
							className="rounded-xl bg-brand-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isDownloading ? "Descargando..." : "Descargar"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default MassiveDownloadModal;
