"use client";

import { useMemo, useState } from "react";

import { AddProductCloseIcon } from "@/features/view/components/Icons/AddCloseIcon";
import { AddProductTextField } from "@/features/view/components/Form_fields/AddTextField";
import { EQUIPOS_TABLE } from "@/lib/utils/namingTolerance";
import { bulkDeleteAllRows } from "@/lib/utils/helpers/massive/massiveClean";
import { MassiveCleanModalProps } from "@/lib/types/components/modals";

export const CONFIRM_PASSWORD = "LIMPIEZA";

export function MassiveCleanModal({ currentCount, onClose, onSuccess }: MassiveCleanModalProps) {

	// ----------
	// Estados
	// ----------

	const [isCleaning, setIsCleaning] = useState(false); // se ha borrado?
	const [error, setError] = useState<string | null>(null); // mensaje de error 
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // mostrar contraseña
	const [confirmText, setConfirmText] = useState(""); // confirmar contraseña

	// ----------
	// Almacenamiento
	// ----------
	const totalRows = useMemo(() => currentCount, [currentCount]); // conteo de filas
	const canDelete = confirmText === CONFIRM_PASSWORD; // Permiso para borrar

	// ----------
	// Eventos
	// ----------
	function handleOpenPasswordConfirm() {
		if (totalRows <= 0) {
			setError("No hay registros para eliminar.");
			return;
		}

		setError(null);
		setConfirmText("");
		setShowPasswordConfirm(true);
	}

	function handleClosePasswordConfirm() {
		if (isCleaning) return;
		setShowPasswordConfirm(false);
		setConfirmText("");
		setError(null);
	}

	async function handleClean() {
		if (!canDelete) {
			setError(`Escribe la contraseña para confirmar el borrado.`);
			return;
		}

		if (totalRows <= 0) {
			setError("No hay registros para eliminar.");
			return;
		}

		setError(null);
		setIsCleaning(true);

		try {
			await bulkDeleteAllRows(EQUIPOS_TABLE);
			onSuccess?.();
			onClose();
		} catch (cleanError) {
			const message = cleanError instanceof Error ? cleanError.message : "No se pudo completar la limpieza masiva.";
			setError(message);
		} finally {
			setIsCleaning(false);
		}
	}

	return (
		<>
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
				<div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
					<div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
						<div>
							<h2 className="text-2xl font-bold text-slate-900">Limpieza masiva de equipos</h2>
							<p className="text-sm text-slate-600">Esta acción elimina todas las filas de equipos principales.</p>
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

					<div className="space-y-5 px-6 py-6">
						<p className="text-sm text-slate-700">
							Registros actuales detectados: <span className="font-semibold text-slate-900">{totalRows}</span>
						</p>
						<p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
							Confirma solo si deseas vaciar la tabla completa.
						</p>

						{error && !showPasswordConfirm && (
							<p className="text-sm font-medium text-red-600">{error}</p>
						)}

						<div className="flex justify-end gap-4 border-t border-slate-200 pt-6">
							<button
								type="button"
								onClick={onClose}
								className="rounded-xl border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
							>
								Cancelar
							</button>
							<button
								type="button"
								onClick={handleOpenPasswordConfirm}
								disabled={totalRows <= 0}
								className="rounded-xl bg-rose-700 px-6 py-3 text-base font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
							>
								Confirmar limpieza
							</button>
						</div>
					</div>
				</div>
			</div>

			{showPasswordConfirm && (
				<div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4">
					<div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">
						<div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
							<div>
								<h2 className="text-xl font-bold text-slate-900">Confirmación de seguridad</h2>
								<p className="text-sm text-slate-600">
									Escribe la contrsaeña para ejecutar el borrado masivo.
								</p>	
							</div>
							<button
								type="button"
								onClick={handleClosePasswordConfirm}
								disabled={isCleaning}
								className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-60"
								aria-label="Cerrar confirmación"
							>
								<AddProductCloseIcon />
							</button>
						</div>

						<div className="space-y-5 px-6 py-6">
							<p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
								Se eliminarán {totalRows} registros de equipos.
							</p>

							<AddProductTextField
								label={`Contraseña de confirmación`}
								required
								value={confirmText}
								onChange={setConfirmText}
							/>

							{error && <p className="text-sm font-medium text-red-600">{error}</p>}

							<div className="flex justify-end gap-4 border-t border-slate-200 pt-6">
								<button
									type="button"
									onClick={handleClosePasswordConfirm}
									disabled={isCleaning}
									className="rounded-xl border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
								>
									Volver
								</button>
								<button
									type="button"
									onClick={handleClean}
									disabled={isCleaning || !canDelete}
									className="rounded-xl bg-rose-700 px-6 py-3 text-base font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
								>
									{isCleaning ? "Limpiando..." : "Ejecutar borrado"}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default MassiveCleanModal;
