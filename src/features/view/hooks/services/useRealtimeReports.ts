import { createQuote, deleteQuote, getQuotes, updateQuote } from "@/features/controller/services/QuoteQueries";
import { createReport, deleteReport, getReports, updateReport } from "@/features/controller/services/ReportQueries";
import { createClient } from "@/lib/supabase/client";
import { Quote, QuoteFormData, useQuoteMutationResult, useQuoteResult } from "@/lib/types/supabase/quote-types";
import { Report, ReportFormData, useReportMutationResult, useReportResult } from "@/lib/types/supabase/report-types";
import { useCallback, useEffect, useState } from "react";

const supabase = createClient();

export function useReports(): useReportResult {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); 

    const fetchReports = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getReports();
            setReports(data);
        } catch (err) {
            const message = err instanceof Error ? err.message: "Error al cargar los reportes";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchReports();
    }, [fetchReports]);

    /* 
        previene colision de suscripciones
    */
        useEffect(() => {
            const channelName = `quotes-realtime-${Date.now()}-${Math.random().toString(36).slice(2)}`; 
            const channel = supabase
                .channel(channelName)
                .on(
                    "postgres_changes",
                    { event: "INSERT", schema: "public", table: "reporte" },
                    () => {
                        void fetchReports();
                    }
                )
                .on(
                    "postgres_changes",
                    { event: "UPDATE", schema: "public", table: "reporte" },
                    () => {
                        void fetchReports();
                    }
                )
                .on(
                    "postgres_changes",
                    { event: "DELETE", schema: "public", table: "reporte" },
                    () => {
                        void fetchReports();
                    }
                )
                .subscribe();
    
            // Cierra el canal realtime para evitar listeners duplicados y fugas de memoria.
            return () => {
                void supabase.removeChannel(channel);
            };
    
        }, [fetchReports]);

    return {
        reports,
        loading,
        error,
        refetch: fetchReports
    };
}

export function useReportMutations(): useReportMutationResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // crear 
    const create = useCallback(async (report: ReportFormData) => {
        try {
            setLoading(true);
            setError(null);

            return await createReport(report);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Error al crear el reporte";

            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // actualizar 
    const update = useCallback(async (id: string, report: ReportFormData) => {
        try {
            setLoading(true);
            setError(null);

            return await updateReport(id, report);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Error al actualizar el reporte";

            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // eliminar 
    const remove = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            await deleteReport(id);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Error al eliminar el reporte";

            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        create,
        update,
        remove,
    };
}