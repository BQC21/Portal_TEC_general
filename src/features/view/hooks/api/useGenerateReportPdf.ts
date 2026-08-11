"use client";

import { FinantialPdfPayload } from "@/lib/types/components/Python_components/FinantialPdfPayload";
import { ReportPdfPayload } from "@/lib/types/components/Python_components/ReportPdfPayload";
import { useCallback, useState } from "react";

export function useGenerateReportPdf() {
    const [data, setData] = useState<Blob | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generate = useCallback(async (payload: ReportPdfPayload | FinantialPdfPayload) => {
        try {
            setLoading(true);
            setError(null);
            setData(null);

            const res = await fetch("/api/pdf_reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            // en caso no haya respuesta
            if (!res.ok) {
                const errBody = await res.json().catch(() => null);
                throw new Error(errBody?.error ?? "No se pudo generar el PDF");
            }

            const blob = await res.blob();
            setData(blob);

            // descarga automática
            const disposition = res.headers.get("Content-Disposition");
            const match = disposition?.match(/filename="?([^"]+)"?/);
            const filename = match?.[1] ?? 
                (payload.tipo === "finantial" 
                    ? "analisis_financiero.pdf"
                    : "cotizacion.pdf");

            // crear enlace
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            // devolver el blob
            return blob;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error generando PDF";
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, generate };
}