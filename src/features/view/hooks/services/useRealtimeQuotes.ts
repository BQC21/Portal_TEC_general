import { createQuote, deleteQuote, getQuotes, updateQuote } from "@/features/controller/services/QuoteQueries";
import { createClient } from "@/lib/supabase/client";
import { Quote, QuoteFormData, useQuoteMutationResult, useQuoteResult } from "@/lib/types/supabase/quote-types";
import { useCallback, useEffect, useState } from "react";

const supabase = createClient();

export function useQuotes(): useQuoteResult {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); 

    const fetchQuotes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getQuotes();
            setQuotes(data);
        } catch (err) {
            const message = err instanceof Error ? err.message: "Error al cargar las cotizaciones";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchQuotes();
    }, [fetchQuotes]);

    /* 
        previene colision de suscripciones
    */
        useEffect(() => {
            const channelName = `quotes-realtime-${Date.now()}-${Math.random().toString(36).slice(2)}`; 
            const channel = supabase
                .channel(channelName)
                .on(
                    "postgres_changes",
                    { event: "INSERT", schema: "public", table: "cotizacion" },
                    () => {
                        void fetchQuotes();
                    }
                )
                .on(
                    "postgres_changes",
                    { event: "UPDATE", schema: "public", table: "cotizacion" },
                    () => {
                        void fetchQuotes();
                    }
                )
                .on(
                    "postgres_changes",
                    { event: "DELETE", schema: "public", table: "cotizacion" },
                    () => {
                        void fetchQuotes();
                    }
                )
                .subscribe();
    
            // Cierra el canal realtime para evitar listeners duplicados y fugas de memoria.
            return () => {
                void supabase.removeChannel(channel);
            };
    
        }, [fetchQuotes]);

    return {
        quotes,
        loading,
        error,
        refetch: fetchQuotes
    };
}

export function useQuoteMutations(): useQuoteMutationResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // crear 
    const create = useCallback(async (quote: QuoteFormData) => {
        try {
            setLoading(true);
            setError(null);

            return await createQuote(quote);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Error al crear la cotización";

            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // actualizar 
    const update = useCallback(async (id: string, quote: QuoteFormData) => {
        try {
            setLoading(true);
            setError(null);

            return await updateQuote(id, quote);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Error al actualizar la cotización";

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

            await deleteQuote(id);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Error al eliminar la cotización";

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