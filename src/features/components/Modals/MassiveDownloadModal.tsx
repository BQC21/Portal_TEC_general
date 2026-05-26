"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Product } from "@/lib/types/product-types";

import { FormatFile_OPTIONS } from "@/lib/utils/options"

import { AddProductCloseIcon } from "@/features/components/Icons/AddProductCloseIcon";
import { AddProductSelectField } from "../Form_fields/AddProductSelectField";
import { AddProductTextField } from "../Form_fields/AddProductTextField";

import { 
    prepareAndDownloadFile,
} from "@/lib/utils/helpers/massiveDownload"

type MassiveDownloadModalProps = {
    productsToDownload?: Product[];
    exchangeRate: number;
    defaultFileName?: string;
    onClose: () => void;
};

type DownloadFormState = {
    format: string;
    fileName: string;
    includeHeaders: boolean;
};

export function MassiveDownloadModal({ productsToDownload, exchangeRate, defaultFileName, onClose }:
    MassiveDownloadModalProps) {
    void exchangeRate;

    // Estado del form para la descarga masiva
    const [form, setForm] = useState<DownloadFormState>({
        format: "csv",
        fileName: defaultFileName ?? "BaseDatos_productos_TEC",
        includeHeaders: true,
    });
    const [error, setError] = useState<string | null>(null); // mensajes de advertencia / error
    const [isDownloading, setIsDownloading] = useState<boolean>(false); // bandera de descarga en curso

    const formatOptions = useMemo(
        () => FormatFile_OPTIONS.filter((option) => option !== "---"),
        []
    );

    // Actualizar campos del formulario
    function updateField<K extends keyof DownloadFormState>(field: K, value: DownloadFormState[K]) {
        setForm((current) => {
            const updated = { ...current, [field]: value };
            return updated;
        });
    }

    // --- Lista de eventos
    async function handleDownload(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null); // no hay error
        setIsDownloading(true); // descarga en curso

        try {
            const products: Product[] = productsToDownload ?? [];

            // Si aún no hay productos, advertir al usuario (no hay filas a descargar)
            if (products.length === 0) {
                setError("No hay productos para descargar.");
                return;
            }

            if (!form.fileName.trim()) {
                setError("Ingresa un nombre de archivo válido.");
                return;
            }

            // Generar y descargar el archivo
            await prepareAndDownloadFile(products, form.format, form.fileName.trim(), form.includeHeaders);

            // Cerrar modal y resetear estados si se desea
            onClose();
        } catch (err: unknown) {
            console.error("Error en descarga masiva:", err);
            const message = err instanceof Error
                ? err.message
                : "Ocurrió un error durante la generación del archivo.";
            setError(message);
        } finally {
            setIsDownloading(false); // fin de la descarga
        }
    }

    return(
        <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Añadir Nuevo Producto</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        aria-label="Cerrar modal"
                    >
                        <AddProductCloseIcon />
                    </button>
                </div>
                <form onSubmit={handleDownload} className="max-h-[calc(95vh-88px)] overflow-y-auto px-6 py-6">
                    <div className="space-y-8">
                        <section className="space-y-5">
                            {/* armar formato y extensión */}
                            <AddProductSelectField 
                                label = "Seleccione formato a descargar"
                                options = {formatOptions}
                                value = {form.format}
                                onChange = {(value) => updateField("format", value)}
                            />
                            <AddProductTextField
                                label="Nombre del archivo a descargar"
                                placeholder={defaultFileName}
                                value={form.fileName}
                                onChange={(value) => updateField("fileName", value)}
                            />
                            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={form.includeHeaders}
                                    onChange={(event) => updateField("includeHeaders", event.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-indigo-700 focus:ring-indigo-300"
                                />
                                Incluir encabezados
                            </label>
                            {error && (
                                <p className="text-sm font-medium text-red-600">{error}</p>
                            )}
                        </section>
                    </div>
                    <div className="mt-8 flex justify-end gap-4 border-t border-slate-200 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-300 px-6 py-3 text-lg font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isDownloading}
                            className="rounded-xl bg-indigo-700 px-6 py-3 text-lg font-semibold text-white transition hover:bg-indigo-800"
                        >
                            {isDownloading ? "Descargando..." : "Descargar base de datos"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default MassiveDownloadModal;